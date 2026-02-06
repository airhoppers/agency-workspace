import { Component, inject, signal, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToastService } from '@workspace/shared-ui';
import { MessageService, AgencyService, WebSocketService, WebSocketMessage } from '@workspace/core';
import { Conversation, Message } from '@workspace/core';

interface ConversationDisplay extends Conversation {
  packageName?: string;
  packageColor?: string;
  timeAgo?: string;
}

interface MessageDisplay extends Message {
  formattedTime?: string;
  showDateDivider?: boolean;
  dateDividerText?: string;
  isFromAgency?: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="messages-page">
      <!-- Page Header -->
      <header class="page-header">
        <div class="header-left">
          <h1>Messages</h1>
          <p>Manage conversations with your customers</p>
        </div>
        <div class="header-right">
          <button class="filter-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filter
          </button>
          <button class="new-message-btn" (click)="openNewMessage()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Message
          </button>
        </div>
      </header>

      <!-- Messages Layout -->
      <div class="messages-layout">
        <!-- Conversations Sidebar -->
        <aside class="conversations-sidebar">
          <div class="sidebar-header">
            <h2>Conversations</h2>
            <button class="more-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
              </svg>
            </button>
          </div>

          <!-- Search -->
          <div class="search-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search conversations..." [(ngModel)]="searchQuery" (input)="filterConversations()" />
          </div>

          <!-- Tabs -->
          <div class="tabs">
            <button class="tab" [class.active]="activeTab() === 'all'" (click)="setActiveTab('all')">
              All
            </button>
            <button class="tab" [class.active]="activeTab() === 'unread'" (click)="setActiveTab('unread')">
              Unread
              @if (unreadCount() > 0) {
                <span class="tab-badge">{{ unreadCount() }}</span>
              }
            </button>
            <button class="tab" [class.active]="activeTab() === 'archived'" (click)="setActiveTab('archived')">
              Archived
            </button>
          </div>

          <!-- Conversations List -->
          <div class="conversations-list">
            @if (isLoadingConversations()) {
              <div class="loading-state">
                <div class="spinner"></div>
                <span>Loading conversations...</span>
              </div>
            } @else if (filteredConversations().length === 0) {
              <div class="empty-conversations-state">
                <div class="empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    <path d="M8 9h8M8 13h6"/>
                  </svg>
                </div>
                <h3>No Conversations Yet</h3>
                <p>You don't have any messages at the moment. Start a new conversation with your customers.</p>
              </div>
            } @else {
              @for (conv of filteredConversations(); track conv.id) {
                <div class="conversation-item" [class.active]="selectedConversation()?.id === conv.id" (click)="selectConversation(conv)">
                  <div class="avatar">
                    <img [src]="getAvatarUrl(conv)" [alt]="getParticipantName(conv)" />
                    @if (isOnline(conv)) {
                      <span class="online-indicator"></span>
                    }
                  </div>
                  <div class="conversation-content">
                    <div class="conversation-header">
                      <span class="name">{{ getParticipantName(conv) }}</span>
                      <span class="time">{{ conv.timeAgo }}</span>
                    </div>
                    @if (conv.packageName) {
                      <span class="package-tag" [style.background-color]="conv.packageColor">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        </svg>
                        {{ conv.packageName }}
                      </span>
                    }
                    <p class="preview">{{ getMessagePreview(conv) }}</p>
                  </div>
                  @if (conv.unreadCount && conv.unreadCount > 0) {
                    <span class="unread-badge">{{ conv.unreadCount }}</span>
                  }
                </div>
              }
            }
          </div>
        </aside>

        <!-- Chat Panel -->
        <main class="chat-panel">
          @if (!selectedConversation()) {
            <div class="no-conversation-state">
              <div class="chat-bubbles-icon">
                <div class="bubble bubble-1"></div>
                <div class="bubble bubble-2"></div>
              </div>
              <h2>Select a Conversation</h2>
              <p class="subtitle">Choose a conversation from the list to view messages, or start a new conversation with your customers.</p>

              <div class="browse-templates">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                <span>Browse Templates</span>
              </div>

              <div class="quick-tips">
                <h4>Quick Tips</h4>
                <div class="tip-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Use templates to save time on common responses</span>
                </div>
                <div class="tip-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Filter conversations by travel package for better organization</span>
                </div>
                <div class="tip-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Set up auto-responses for frequently asked questions</span>
                </div>
              </div>
            </div>
          } @else {
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="chat-user-info">
                <div class="avatar">
                  <img [src]="getAvatarUrl(selectedConversation()!)" [alt]="getParticipantName(selectedConversation()!)" />
                </div>
                <div class="user-details">
                  <div class="name-row">
                    <span class="name">{{ getParticipantName(selectedConversation()!) }}</span>
                    @if (selectedConversation()!.packageName) {
                      <span class="package-tag" [style.background-color]="selectedConversation()!.packageColor">
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                        </svg>
                        {{ selectedConversation()!.packageName }}
                      </span>
                    }
                  </div>
                  <span class="status" [class.online]="isOnline(selectedConversation()!)">
                    <span class="status-dot"></span>
                    {{ isOnline(selectedConversation()!) ? 'Active now' : 'Offline' }}
                  </span>
                </div>
              </div>
              <div class="chat-actions">
                <button class="action-btn" title="More options">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Messages Container -->
            <div class="messages-container" #messagesContainer>
              @if (isLoadingMessages()) {
                <div class="loading-state">
                  <div class="spinner"></div>
                  <span>Loading messages...</span>
                </div>
              } @else {
                @for (message of displayMessages(); track message.id) {
                  @if (message.showDateDivider) {
                    <div class="date-divider">
                      <span>{{ message.dateDividerText }}</span>
                    </div>
                  }
                  <div class="message" [class.sent]="isAgencyMessage(message)" [class.received]="!isAgencyMessage(message)">
                    @if (!isAgencyMessage(message)) {
                      <div class="message-avatar">
                        <img [src]="getAvatarUrl(selectedConversation()!)" alt="User" />
                      </div>
                    }
                    <div class="message-content">
                      <div class="message-bubble">
                        <p>{{ message.body }}</p>
                      </div>
                      @if (message.attachment) {
                        <div class="message-attachment">
                          <div class="attachment-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                            </svg>
                          </div>
                          <div class="attachment-info">
                            <span class="attachment-name">{{ message.attachment.name }}</span>
                            <span class="attachment-size">{{ message.attachment.size }}</span>
                          </div>
                          <button class="download-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                            Download
                          </button>
                        </div>
                      }
                      <span class="message-time">{{ message.formattedTime }}</span>
                    </div>
                    @if (isAgencyMessage(message)) {
                      <div class="message-avatar">
                        <img [src]="getAgencyAvatarUrl()" alt="Agent" />
                      </div>
                    }
                  </div>
                }
              }

              <!-- Typing Indicator -->
              @if (isTyping()) {
                <div class="typing-indicator">
                  <div class="message-avatar">
                    <img [src]="getAvatarUrl(selectedConversation()!)" alt="User" />
                  </div>
                  <div class="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                  <span class="typing-text">{{ getParticipantName(selectedConversation()!) }} is typing...</span>
                </div>
              }
            </div>

            <!-- Chat Input -->
            <div class="chat-input-container">
              <div class="input-actions-top">
                <button class="input-action" (click)="toggleEmojiPicker()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>
                  </svg>
                </button>
                <button class="input-action" (click)="attachFile()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                  </svg>
                </button>
                <button class="input-action" (click)="insertImage()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                </button>
                <input
                  type="text"
                  class="message-input"
                  [(ngModel)]="newMessage"
                  placeholder="Type your message..."
                  (keyup.enter)="sendMessage()"
                />
                <button class="send-btn" [disabled]="!newMessage.trim()" (click)="sendMessage()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </button>
              </div>
              <div class="input-actions-bottom">
                <button class="quick-action">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  Use Template
                </button>
                <button class="quick-action">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Quick Reply
                </button>
                <button class="quick-action">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Schedule
                </button>
              </div>
            </div>
          }
        </main>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon messages">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ totalMessages() }}</span>
            <span class="stat-label">Total Messages</span>
          </div>
          <span class="stat-change positive">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            12%
          </span>
        </div>

        <div class="stat-card">
          <div class="stat-icon unread">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ unreadCount() }}</span>
            <span class="stat-label">Unread Messages</span>
          </div>
          <span class="stat-change positive">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            8%
          </span>
        </div>

        <div class="stat-card">
          <div class="stat-icon response">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ avgResponseTime() }}</span>
            <span class="stat-label">Avg Response Time</span>
          </div>
          <span class="stat-change negative">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            10%
          </span>
        </div>

        <div class="stat-card">
          <div class="stat-icon satisfaction">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ customerSatisfaction() }}</span>
            <span class="stat-label">Customer Satisfaction</span>
          </div>
          <span class="stat-change positive">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18 15 12 9 6 15"/>
            </svg>
            5%
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .messages-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
      height: calc(100vh - 100px);
      min-height: 600px;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-left h1 {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px 0;
    }

    .header-left p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .header-right {
      display: flex;
      gap: 12px;
    }

    .filter-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }
    }

    .new-message-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9;
        transform: translateY(-1px);
      }
    }

    /* Messages Layout */
    .messages-layout {
      display: grid;
      grid-template-columns: 380px 1fr;
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      flex: 1;
      min-height: 0;
    }

    /* Conversations Sidebar */
    .conversations-sidebar {
      display: flex;
      flex-direction: column;
      border-right: 1px solid #e5e7eb;
      background: #fafafa;
    }

    .sidebar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #e5e7eb;
      background: white;

      h2 {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }
    }

    .more-btn {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 6px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        color: #374151;
      }
    }

    /* Search */
    .search-container {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      background: white;
      border-bottom: 1px solid #e5e7eb;

      svg {
        color: #9ca3af;
        flex-shrink: 0;
      }

      input {
        flex: 1;
        border: none;
        background: transparent;
        font-size: 14px;
        color: #111827;
        outline: none;

        &::placeholder {
          color: #9ca3af;
        }
      }
    }

    /* Tabs */
    .tabs {
      display: flex;
      gap: 4px;
      padding: 12px 20px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    .tab {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: transparent;
      border: none;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        color: #374151;
      }

      &.active {
        background: #111827;
        color: white;
      }
    }

    .tab-badge {
      padding: 2px 8px;
      background: #FF4E78;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      color: white;
    }

    .tab.active .tab-badge {
      background: white;
      color: #111827;
    }

    /* Conversations List */
    .conversations-list {
      flex: 1;
      overflow-y: auto;
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #9ca3af;
      text-align: center;
      gap: 12px;
    }

    .spinner {
      width: 32px;
      height: 32px;
      border: 3px solid #e5e7eb;
      border-top-color: #FF4E78;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Empty Conversations State - Sidebar */
    .empty-conversations-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 24px;
      text-align: center;
      height: 100%;

      .empty-icon {
        width: 64px;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f3f4f6;
        border-radius: 50%;
        margin-bottom: 20px;
        color: #9ca3af;
      }

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #374151;
        margin: 0 0 8px 0;
      }

      p {
        font-size: 13px;
        color: #6b7280;
        margin: 0;
        line-height: 1.5;
      }
    }

    .conversation-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px 20px;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 1px solid #f3f4f6;
      background: white;

      &:hover {
        background: #f9fafb;
      }

      &.active {
        background: rgba(255, 78, 120, 0.1);
        border-left: 3px solid #FF4E78;
      }
    }

    .conversation-item .avatar {
      position: relative;
      flex-shrink: 0;

      img {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        object-fit: cover;
      }
    }

    .online-indicator {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: #10b981;
      border: 2px solid white;
      border-radius: 50%;
    }

    .conversation-content {
      flex: 1;
      min-width: 0;
    }

    .conversation-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }

    .conversation-header .name {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .conversation-header .time {
      font-size: 12px;
      color: #9ca3af;
    }

    .package-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 500;
      color: white;
      margin-bottom: 4px;
    }

    .preview {
      font-size: 13px;
      color: #6b7280;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .unread-badge {
      flex-shrink: 0;
      min-width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
      background: #ef4444;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      color: white;
    }

    /* Chat Panel */
    .chat-panel {
      display: flex;
      flex-direction: column;
      background: white;
      min-height: 0;
    }

    .no-conversation-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 40px;
      max-width: 480px;
      margin: 0 auto;

      .chat-bubbles-icon {
        position: relative;
        width: 80px;
        height: 80px;
        margin-bottom: 24px;

        .bubble {
          position: absolute;
          border-radius: 20px;
        }

        .bubble-1 {
          width: 56px;
          height: 44px;
          background: linear-gradient(135deg, #FFB5A6 0%, #FF9370 100%);
          top: 0;
          left: 0;
          border-bottom-left-radius: 8px;

          &::before {
            content: '';
            position: absolute;
            top: 12px;
            left: 10px;
            right: 10px;
            height: 6px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 3px;
          }

          &::after {
            content: '';
            position: absolute;
            top: 24px;
            left: 10px;
            width: 24px;
            height: 6px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 3px;
          }
        }

        .bubble-2 {
          width: 48px;
          height: 38px;
          background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
          bottom: 0;
          right: 0;
          border-bottom-right-radius: 8px;

          &::before {
            content: '';
            position: absolute;
            top: 10px;
            left: 8px;
            right: 8px;
            height: 5px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 3px;
          }

          &::after {
            content: '';
            position: absolute;
            top: 20px;
            left: 8px;
            width: 18px;
            height: 5px;
            background: rgba(255, 255, 255, 0.6);
            border-radius: 3px;
          }
        }
      }

      h2 {
        font-size: 22px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 12px 0;
      }

      .subtitle {
        font-size: 14px;
        color: #6b7280;
        margin: 0 0 24px 0;
        line-height: 1.6;
      }

      .browse-templates {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 12px 24px;
        background: transparent;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        color: #374151;
        cursor: pointer;
        transition: all 0.2s;
        margin-bottom: 32px;

        &:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        svg {
          color: #9ca3af;
        }
      }

      .quick-tips {
        width: 100%;
        padding-top: 24px;
        border-top: 1px solid #e5e7eb;

        h4 {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin: 0 0 16px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          text-align: left;
          margin-bottom: 12px;

          svg {
            flex-shrink: 0;
            color: #FF4E78;
            margin-top: 2px;
          }

          span {
            font-size: 13px;
            color: #6b7280;
            line-height: 1.5;
          }
        }
      }
    }

    /* Chat Header */
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e5e7eb;
    }

    .chat-user-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .chat-user-info .avatar img {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .name-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .name-row .name {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #9ca3af;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background: #9ca3af;
      border-radius: 50%;
    }

    .status.online {
      color: #10b981;

      .status-dot {
        background: #10b981;
      }
    }

    .chat-actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border: none;
      border-radius: 10px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #e5e7eb;
        color: #374151;
      }
    }

    /* Messages Container */
    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      background: #f9fafb;
    }

    .date-divider {
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 8px 0;

      span {
        padding: 6px 16px;
        background: white;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 500;
        color: #6b7280;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
      }
    }

    .message {
      display: flex;
      gap: 10px;
      max-width: 75%;

      &.sent {
        align-self: flex-end;
        flex-direction: row-reverse;
      }

      &.received {
        align-self: flex-start;
      }
    }

    .message-avatar img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }

    .message-content {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .message-bubble {
      padding: 12px 16px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;

      p {
        margin: 0;
      }
    }

    .message.received .message-bubble {
      background: white;
      color: #374151;
      border-bottom-left-radius: 4px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .message.sent .message-bubble {
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      color: white;
      border-bottom-right-radius: 4px;
    }

    .message-time {
      font-size: 11px;
      color: #9ca3af;
      padding: 0 4px;
    }

    .message.sent .message-time {
      text-align: right;
    }

    /* Attachment */
    .message-attachment {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: white;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
      margin-top: 8px;
    }

    .attachment-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border-radius: 8px;
      color: #6b7280;
    }

    .attachment-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .attachment-name {
      font-size: 13px;
      font-weight: 500;
      color: #111827;
    }

    .attachment-size {
      font-size: 11px;
      color: #9ca3af;
    }

    .download-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border: none;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 500;
      color: white;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }

    /* Typing Indicator */
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
    }

    .typing-dots {
      display: flex;
      gap: 4px;

      span {
        width: 8px;
        height: 8px;
        background: #d1d5db;
        border-radius: 50%;
        animation: typing 1.4s infinite;

        &:nth-child(2) { animation-delay: 0.2s; }
        &:nth-child(3) { animation-delay: 0.4s; }
      }
    }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-4px); }
    }

    .typing-text {
      font-size: 12px;
      color: #9ca3af;
      font-style: italic;
    }

    /* Chat Input */
    .chat-input-container {
      padding: 16px 24px;
      border-top: 1px solid #e5e7eb;
      background: white;
    }

    .input-actions-top {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: #f9fafb;
      border-radius: 12px;
      border: 1px solid #e5e7eb;
    }

    .input-action {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      border: none;
      border-radius: 8px;
      color: #9ca3af;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #e5e7eb;
        color: #374151;
      }
    }

    .message-input {
      flex: 1;
      padding: 8px 12px;
      border: none;
      background: transparent;
      font-size: 14px;
      color: #111827;
      outline: none;

      &::placeholder {
        color: #9ca3af;
      }
    }

    .send-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border: none;
      border-radius: 10px;
      color: white;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        opacity: 0.9;
        transform: scale(1.05);
      }

      &:disabled {
        background: #e5e7eb;
        color: #9ca3af;
        cursor: default;
      }
    }

    .input-actions-bottom {
      display: flex;
      gap: 12px;
      margin-top: 12px;
    }

    .quick-action {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: transparent;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
        color: #374151;
      }
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: white;
      border-radius: 16px;
      border: 1px solid #e5e7eb;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;

      &.messages {
        background: #ede9fe;
        color: #8b5cf6;
      }

      &.unread {
        background: #fef3c7;
        color: #f59e0b;
      }

      &.response {
        background: #d1fae5;
        color: #10b981;
      }

      &.satisfaction {
        background: #fce7f3;
        color: #ec4899;
      }
    }

    .stat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
    }

    .stat-label {
      font-size: 13px;
      color: #6b7280;
    }

    .stat-change {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 8px;
      border-radius: 6px;

      &.positive {
        background: #d1fae5;
        color: #059669;
      }

      &.negative {
        background: #fee2e2;
        color: #dc2626;
      }
    }

    /* Responsive */
    @media (max-width: 1200px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 900px) {
      .messages-layout {
        grid-template-columns: 1fr;
      }

      .conversations-sidebar {
        display: none;
      }
    }
  `]
})
export class MessagesComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  private messageService = inject(MessageService);
  private agencyService = inject(AgencyService);
  private webSocketService = inject(WebSocketService);
  private toast = inject(ToastService);
  private wsSubscription?: Subscription;

  isLoadingConversations = signal(true);
  isLoadingMessages = signal(false);
  conversations = signal<ConversationDisplay[]>([]);
  filteredConversations = signal<ConversationDisplay[]>([]);
  messages = signal<Message[]>([]);
  displayMessages = signal<MessageDisplay[]>([]);
  selectedConversation = signal<ConversationDisplay | null>(null);
  activeTab = signal<'all' | 'unread' | 'archived'>('all');
  isTyping = signal(false);

  searchQuery = '';
  newMessage = '';

  // Stats
  totalMessages = signal(0);
  unreadCount = signal(0);
  avgResponseTime = signal('--');
  customerSatisfaction = signal(0);

  private packageColors = ['#10b981', '#6366f1', '#f59e0b', '#ec4899', '#8b5cf6'];
  private shouldScrollToBottom = false;

  ngOnInit(): void {
    this.loadConversations();
    this.connectWebSocket();
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
    this.webSocketService.disconnect();
  }

  private connectWebSocket(): void {
    // Connect to WebSocket
    this.webSocketService.connect();

    // Subscribe to incoming messages
    this.wsSubscription = this.webSocketService.messages$.subscribe((wsMessage) => {
      this.handleIncomingMessage(wsMessage);
    });
  }

  private handleIncomingMessage(wsMessage: WebSocketMessage): void {
    const currentConv = this.selectedConversation();

    // Check if the message belongs to the currently selected conversation
    if (currentConv && wsMessage.payload.conversationId === currentConv.id) {
      // Check if message already exists (avoid duplicates from optimistic updates)
      const existingMessages = this.displayMessages();
      const messageExists = existingMessages.some(m => m.id === wsMessage.payload.id);

      // Determine if message is from agency
      const isFromAgency = currentConv.user?.id !== wsMessage.payload.sender;

      // Check if this is a pending optimistic message (temp ID) that should be replaced
      const pendingMessage = existingMessages.find(m =>
        m.id.startsWith('temp-') &&
        m.body === wsMessage.payload.body &&
        m.isFromAgency === isFromAgency
      );

      if (pendingMessage) {
        // Replace the temp message with the real one from server
        this.displayMessages.update(msgs =>
          msgs.map(m => m.id === pendingMessage.id ? {
            id: wsMessage.payload.id,
            body: wsMessage.payload.body,
            sender: wsMessage.payload.sender,
            timestamp: wsMessage.payload.timestamp,
            type: wsMessage.payload.type,
            formattedTime: this.formatTime(wsMessage.payload.timestamp),
            isFromAgency
          } : m)
        );
      } else if (!messageExists) {
        // Create new message display object
        const newMessage: MessageDisplay = {
          id: wsMessage.payload.id,
          body: wsMessage.payload.body,
          sender: wsMessage.payload.sender,
          timestamp: wsMessage.payload.timestamp,
          type: wsMessage.payload.type,
          formattedTime: this.formatTime(wsMessage.payload.timestamp),
          isFromAgency
        };

        // Add to messages list
        this.displayMessages.update(msgs => [...msgs, newMessage]);
        this.shouldScrollToBottom = true;
      }
    }

    // Update conversation list (update last message preview)
    this.updateConversationPreview(wsMessage);
  }

  private updateConversationPreview(wsMessage: WebSocketMessage): void {
    const convId = wsMessage.payload.conversationId;
    const currentConv = this.selectedConversation();

    // Check if message is from another user (not agency) and not in current conversation
    const isFromUser = this.conversations().some(conv =>
      conv.id === convId && conv.user?.id === wsMessage.payload.sender
    );
    const isInCurrentConversation = currentConv?.id === convId;

    this.conversations.update(convs => {
      return convs.map(conv => {
        if (conv.id === convId) {
          // Increment unread count if message is from user and not in current conversation
          const newUnreadCount = (isFromUser && !isInCurrentConversation)
            ? (conv.unreadCount || 0) + 1
            : conv.unreadCount;

          return {
            ...conv,
            lastMessage: {
              message: {
                id: wsMessage.payload.id,
                body: wsMessage.payload.body,
                sender: wsMessage.payload.sender,
                timestamp: wsMessage.payload.timestamp
              }
            },
            timeAgo: 'Just now',
            unreadCount: newUnreadCount
          };
        }
        return conv;
      });
    });

    // Recalculate total unread count
    if (isFromUser && !isInCurrentConversation) {
      const totalUnread = this.conversations().reduce((sum, c) => sum + (c.unreadCount || 0), 0);
      this.unreadCount.set(totalUnread);
    }

    // Increment total messages count only for messages from users (not our own sent messages)
    if (isFromUser) {
      this.totalMessages.update(count => count + 1);
    }

    // Also update filtered conversations
    this.filterConversations();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  loadConversations(): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) {
      this.isLoadingConversations.set(false);
      this.conversations.set([]);
      this.filteredConversations.set([]);
      return;
    }

    this.messageService.getAgencyConversations(agency.id).subscribe({
      next: (convs) => {
        const enhanced = this.enhanceConversations(convs);
        this.conversations.set(enhanced);
        this.filteredConversations.set(enhanced);

        // Calculate total unread from conversations
        const totalUnread = enhanced.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
        this.unreadCount.set(totalUnread);

        // Set total conversations count
        this.totalMessages.set(enhanced.length);

        this.isLoadingConversations.set(false);

        // Load message counts for each conversation to get actual total messages
        this.loadTotalMessagesCount(agency.id, enhanced);
      },
      error: (err) => {
        console.error('Failed to load conversations:', err);
        this.isLoadingConversations.set(false);
        this.conversations.set([]);
        this.filteredConversations.set([]);
      }
    });
  }

  private loadTotalMessagesCount(agencyId: string, conversations: ConversationDisplay[]): void {
    if (conversations.length === 0) {
      this.totalMessages.set(0);
      return;
    }

    // Fetch messages from each conversation to count total
    let totalCount = 0;
    let completedRequests = 0;

    conversations.forEach(conv => {
      this.messageService.getAgencyMessages(agencyId, conv.id, { limit: 100 }).subscribe({
        next: (response) => {
          totalCount += response.messages?.length || 0;
          completedRequests++;

          // Update total when all requests complete
          if (completedRequests === conversations.length) {
            this.totalMessages.set(totalCount);
          }
        },
        error: () => {
          completedRequests++;
          // Update even on error to avoid hanging
          if (completedRequests === conversations.length) {
            this.totalMessages.set(totalCount);
          }
        }
      });
    });
  }

  enhanceConversations(convs: Conversation[]): ConversationDisplay[] {
    return convs.map((conv, index) => {
      // Get time from last message timestamp or use current time
      const lastMsgTime = conv.lastMessage?.message?.timestamp;
      return {
        ...conv,
        // Only show package tag if booking reference exists
        packageName: conv.booking?.bookingReference ? `Booking #${conv.booking.bookingReference}` : undefined,
        packageColor: conv.booking ? this.packageColors[index % this.packageColors.length] : undefined,
        timeAgo: lastMsgTime ? this.getTimeAgo(lastMsgTime) : ''
      };
    });
  }

  selectConversation(conv: ConversationDisplay): void {
    this.selectedConversation.set(conv);
    this.loadMessages(conv.id);
    this.isTyping.set(false);

    // Mark conversation as read and update unread counts
    if (conv.unreadCount && conv.unreadCount > 0) {
      this.markConversationAsRead(conv);
    }
  }

  private markConversationAsRead(conv: ConversationDisplay): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) return;

    // Update local state immediately (optimistic update)
    const previousUnread = conv.unreadCount || 0;

    this.conversations.update(convs => {
      return convs.map(c => {
        if (c.id === conv.id) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      });
    });

    // Update total unread count
    this.unreadCount.update(count => Math.max(0, count - previousUnread));

    // Update the selected conversation
    this.selectedConversation.update(c => c ? { ...c, unreadCount: 0 } : null);

    // Update filtered conversations
    this.filterConversations();

    // Call API to mark conversation as read (silent fail if endpoint doesn't exist)
    this.messageService.markAgencyConversationAsRead(agency.id, conv.id).subscribe({
      error: () => {
        // Silently ignore errors - the local state is already updated
      }
    });
  }

  loadMessages(conversationId: string): void {
    const agency = this.agencyService.getCurrentAgency();
    this.isLoadingMessages.set(true);

    if (!agency) {
      this.isLoadingMessages.set(false);
      this.displayMessages.set([]);
      return;
    }

    this.messageService.getAgencyMessages(agency.id, conversationId, { limit: 50 }).subscribe({
      next: (response) => {
        const messages = response.messages || [];
        this.messages.set(messages);
        this.processMessages(messages);
        this.isLoadingMessages.set(false);
        this.shouldScrollToBottom = true;
      },
      error: (err) => {
        console.error('Failed to load messages:', err);
        this.isLoadingMessages.set(false);
        this.displayMessages.set([]);
      }
    });
  }

  processMessages(messages: Message[]): void {
    const conv = this.selectedConversation();
    let lastDate = '';

    // Sort messages by timestamp ascending (oldest first) for chat display
    const sortedMessages = [...messages].sort((a, b) => {
      const timeA = new Date(a.timestamp || a.createdAt || 0).getTime();
      const timeB = new Date(b.timestamp || b.createdAt || 0).getTime();
      return timeA - timeB;
    });

    const processed: MessageDisplay[] = sortedMessages.map(msg => {
      // Use timestamp from API (or fall back to createdAt for backwards compatibility)
      const msgTimestamp = msg.timestamp || msg.createdAt || '';
      const msgDate = msgTimestamp ? new Date(msgTimestamp).toDateString() : '';
      const showDivider = msgDate !== lastDate && msgDate !== '';
      lastDate = msgDate;

      // Determine if message is from agency:
      // If sender matches user.id -> it's from the user (not agency)
      // Otherwise -> it's from the agency
      const isFromAgency = conv?.user?.id !== msg.sender;

      return {
        ...msg,
        formattedTime: this.formatTime(msgTimestamp),
        showDateDivider: showDivider,
        dateDividerText: this.getDateDividerText(msgTimestamp),
        isFromAgency
      };
    });

    this.displayMessages.set(processed);
  }

  sendMessage(): void {
    if (!this.newMessage.trim() || !this.selectedConversation()) return;

    const agency = this.agencyService.getCurrentAgency();
    const conv = this.selectedConversation();
    if (!agency || !conv) return;

    // Add message optimistically - use agency ID as sender
    const newMsg: MessageDisplay = {
      id: 'temp-' + Date.now(),
      body: this.newMessage,
      sender: conv.agency?.id || agency.id,
      timestamp: new Date().toISOString(),
      formattedTime: 'Just now',
      isFromAgency: true
    };

    this.displayMessages.update(msgs => [...msgs, newMsg]);
    this.shouldScrollToBottom = true;
    const messageBody = this.newMessage;
    this.newMessage = '';

    this.messageService.sendAgencyMessage(agency.id, this.selectedConversation()!.id, { body: messageBody }).subscribe({
      next: (sentMsg) => {
        // Replace temp message with real one
        this.displayMessages.update(msgs =>
          msgs.map(m => m.id === newMsg.id ? { ...sentMsg, formattedTime: 'Just now', isFromAgency: true } : m)
        );
        // Increment total messages count
        this.totalMessages.update(count => count + 1);
      },
      error: () => {
        this.toast.error('Failed to send message');
        // Remove failed message
        this.displayMessages.update(msgs => msgs.filter(m => m.id !== newMsg.id));
      }
    });
  }

  filterConversations(): void {
    const query = this.searchQuery.toLowerCase();
    const tab = this.activeTab();

    let filtered = this.conversations();

    if (query) {
      filtered = filtered.filter(conv =>
        this.getParticipantName(conv).toLowerCase().includes(query) ||
        conv.packageName?.toLowerCase().includes(query) ||
        conv.lastMessage?.message?.body?.toLowerCase().includes(query) ||
        conv.user?.email?.toLowerCase().includes(query)
      );
    }

    if (tab === 'unread') {
      filtered = filtered.filter(conv => conv.unreadCount && conv.unreadCount > 0);
    } else if (tab === 'archived') {
      filtered = []; // Archived conversations not yet supported
    }

    this.filteredConversations.set(filtered);
  }

  setActiveTab(tab: 'all' | 'unread' | 'archived'): void {
    this.activeTab.set(tab);
    this.filterConversations();
  }

  getParticipantName(conv: Conversation | ConversationDisplay): string {
    // Use user info from the new API structure
    if (conv.user) {
      const firstName = conv.user.firstName || '';
      const lastName = conv.user.lastName || '';
      if (firstName || lastName) {
        return `${firstName} ${lastName}`.trim();
      }
      return conv.user.email || conv.user.username || 'Unknown';
    }
    return 'Unknown';
  }

  getMessagePreview(conv: Conversation): string {
    // Use the new lastMessage structure: { message, sender }
    const body = conv.lastMessage?.message?.body || '';
    return body.length > 35 ? body.substring(0, 35) + '...' : body;
  }

  getAvatarUrl(conv: Conversation | ConversationDisplay): string {
    // Use user's profile picture if available
    if (conv.user?.profilePictureUrl) {
      return conv.user.profilePictureUrl;
    }
    const name = this.getParticipantName(conv).replace(' ', '+');
    return `https://ui-avatars.com/api/?name=${name}&background=random&color=fff&size=96`;
  }

  getAgencyAvatarUrl(): string {
    const agency = this.agencyService.getCurrentAgency();
    // Use agency logo if available
    if (agency?.logoUrl) {
      return agency.logoUrl;
    }
    const name = agency?.name || 'Agent';
    return `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=FF4E78&color=fff&size=96`;
  }

  isOnline(conv: Conversation | ConversationDisplay): boolean {
    // Check if there's recent activity (within last 5 minutes)
    const lastMsgTime = conv.lastMessage?.message?.timestamp;
    if (lastMsgTime) {
      const diffMs = Date.now() - new Date(lastMsgTime).getTime();
      return diffMs < 5 * 60 * 1000; // 5 minutes
    }
    return false;
  }

  isAgencyMessage(message: Message | MessageDisplay): boolean {
    // Check if already processed
    if ((message as MessageDisplay).isFromAgency !== undefined) {
      return (message as MessageDisplay).isFromAgency!;
    }

    // If sender is NOT the user, it's from the agency
    const conv = this.selectedConversation();
    return conv?.user?.id !== message.sender;
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  getTimeAgo(dateStr?: string): string {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays}d ago`;
  }

  getDateDividerText(dateStr?: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  openNewMessage(): void {
    this.toast.info('New message dialog coming soon');
  }

  toggleEmojiPicker(): void {
    this.toast.info('Emoji picker coming soon');
  }

  attachFile(): void {
    this.toast.info('File attachment coming soon');
  }

  insertImage(): void {
    this.toast.info('Image upload coming soon');
  }
}
