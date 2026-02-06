import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { APP_ENVIRONMENT } from '../config';

export interface WebSocketMessage {
  type: string;
  payload: {
    id: string;
    body: string;
    sender: string;
    conversationId: string;
    timestamp: string;
    type: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly API_URL = this.env.apiUrl;
  private http = inject(HttpClient);

  private socket: WebSocket | null = null;
  private messageSubject = new Subject<WebSocketMessage>();
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private pingInterval: ReturnType<typeof setInterval> | null = null;

  // Observable for components to subscribe to
  messages$ = this.messageSubject.asObservable();
  connectionStatus$ = this.connectionStatus.asObservable();

  connect(): void {
    if (this.socket?.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected');
      return;
    }

    // Get WebSocket URL from backend
    this.http.get(`${this.API_URL}/user/websocket`, { responseType: 'text' }).subscribe({
      next: (wsUrl) => {
        // Remove surrounding quotes if present (backend returns JSON string)
        let cleanUrl = wsUrl.replace(/^"|"$/g, '');

        // Convert ws:// to wss:// if API uses HTTPS (mixed content security)
        if (this.API_URL.startsWith('https://') && cleanUrl.startsWith('ws://')) {
          cleanUrl = cleanUrl.replace('ws://', 'wss://');
        }

        console.log('Got WebSocket URL:', cleanUrl);
        this.establishConnection(cleanUrl);
      },
      error: (err) => {
        console.error('Failed to get WebSocket URL:', err);
      }
    });
  }

  private establishConnection(wsUrl: string): void {
    try {
      // Close existing connection if any
      if (this.socket) {
        this.socket.close();
      }

      this.socket = new WebSocket(wsUrl);

      this.socket.onopen = () => {
        console.log('WebSocket connected successfully');
        this.connectionStatus.next(true);
        this.reconnectAttempts = 0;
        // Start ping to keep connection alive
        this.startPing();
      };

      this.socket.onmessage = (event) => {
        const data = event.data;

        // Ignore pong responses
        if (data === 'pong') {
          return;
        }

        try {
          const message = JSON.parse(data) as WebSocketMessage;
          console.log('WebSocket message received:', message);

          // Only process NewMessageNotification type
          if (message.type === 'NewMessageNotification' && message.payload) {
            this.messageSubject.next(message);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e, 'Data:', data);
        }
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.connectionStatus.next(false);
        this.stopPing();
        this.attemptReconnect();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (e) {
      console.error('Failed to establish WebSocket connection:', e);
    }
  }

  private startPing(): void {
    this.stopPing();
    // Send ping every 30 seconds to keep connection alive
    this.pingInterval = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send('ping');
      }
    }, 30000);
  }

  private stopPing(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

    setTimeout(() => {
      this.connect();
    }, this.reconnectDelay);
  }

  disconnect(): void {
    this.stopPing();
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.connectionStatus.next(false);
  }

  isConnected(): boolean {
    return this.socket?.readyState === WebSocket.OPEN;
  }
}
