import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_ENVIRONMENT } from '../config';
import {
  Conversation,
  Message,
  SendMessageRequest,
  PaginatedResponse,
  PaginationParams,
  MessagePaginationResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly API_URL = this.env.apiUrl;

  constructor(private http: HttpClient) {}

  // Agency Message endpoints
  getAgencyConversations(agencyId: string): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.API_URL}/agency/${agencyId}/messages/conversations`);
  }

  getAgencyConversationById(agencyId: string, conversationId: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.API_URL}/agency/${agencyId}/messages/conversations/${conversationId}`);
  }

  getAgencyMessages(agencyId: string, conversationId: string, params: { cursor?: string; limit: number }): Observable<MessagePaginationResponse> {
    let httpParams = new HttpParams().set('limit', params.limit.toString());
    if (params.cursor) {
      httpParams = httpParams.set('cursor', params.cursor);
    }
    return this.http.get<MessagePaginationResponse>(
      `${this.API_URL}/agency/${agencyId}/messages/${conversationId}`,
      { params: httpParams }
    );
  }

  sendAgencyMessage(agencyId: string, conversationId: string, data: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.API_URL}/agency/${agencyId}/messages/${conversationId}`, data);
  }

  deleteAgencyMessage(agencyId: string, messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/agency/${agencyId}/messages/${messageId}`);
  }

  // User Message endpoints
  getUserConversations(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.API_URL}/user/messages/conversations`);
  }

  getUserConversationById(conversationId: string): Observable<Conversation> {
    return this.http.get<Conversation>(`${this.API_URL}/user/messages/conversations/${conversationId}`);
  }

  getUserMessages(conversationId: string, params: PaginationParams): Observable<PaginatedResponse<Message>> {
    const httpParams = new HttpParams()
      .set('offset', params.offset.toString())
      .set('limit', params.limit.toString());
    return this.http.get<PaginatedResponse<Message>>(
      `${this.API_URL}/user/messages/${conversationId}`,
      { params: httpParams }
    );
  }

  sendUserMessage(conversationId: string, data: SendMessageRequest): Observable<Message> {
    return this.http.post<Message>(`${this.API_URL}/user/messages/${conversationId}`, data);
  }

  deleteUserMessage(messageId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/user/messages/${messageId}`);
  }

  markConversationAsRead(conversationId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/user/messages/${conversationId}/mark-read`, {});
  }

  // Agency-specific mark as read
  markAgencyConversationAsRead(agencyId: string, conversationId: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/agency/${agencyId}/messages/${conversationId}/mark-read`, {});
  }
}
