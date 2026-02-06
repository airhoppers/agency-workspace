import { Component, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgencySettings } from '@workspace/core';
import { ToastService } from '@workspace/shared-ui';

interface NotificationEvent {
  key: string;
  label: string;
  description: string;
  badgeColor: string;
  badgeBg: string;
  email: boolean;
  push: boolean;
}

@Component({
  selector: 'app-notifications-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-settings">
      <div class="notifications-layout">
        <!-- Main Content -->
        <div class="notifications-main">
          <!-- Header -->
          <div class="section-header">
            <div class="header-info">
              <h2>Notification Preferences</h2>
              <p>Configure how and when your agency receives notifications</p>
            </div>
            <button class="reset-btn" (click)="resetToDefaults()">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              Reset to Defaults
            </button>
          </div>

          <!-- Global Toggles -->
          <div class="global-toggles">
            <div class="global-toggle-item">
              <div class="global-toggle-info">
                <div class="global-icon email-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div>
                  <span class="global-label">Email Notifications</span>
                  <span class="global-desc">Receive notifications via email</span>
                </div>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  [checked]="globalEmailEnabled()"
                  (change)="toggleGlobalEmail()"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
            <div class="global-toggle-item">
              <div class="global-toggle-info">
                <div class="global-icon push-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
                  </svg>
                </div>
                <div>
                  <span class="global-label">Push Notifications</span>
                  <span class="global-desc">Receive browser push notifications</span>
                </div>
              </div>
              <label class="toggle-switch">
                <input
                  type="checkbox"
                  [checked]="globalPushEnabled()"
                  (change)="toggleGlobalPush()"
                />
                <span class="toggle-slider"></span>
              </label>
            </div>
          </div>

          <!-- Customer Notifications Section -->
          <div class="notification-section">
            <div class="section-title-row">
              <div class="section-icon customer-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h3>Customer Notifications</h3>
                <p>Notifications sent to customers about their bookings</p>
              </div>
            </div>

            <div class="notification-list">
              <div class="notification-list-header">
                <span class="col-event">Event</span>
                <span class="col-channel">Email</span>
                <span class="col-channel">Push</span>
                <span class="col-action">Action</span>
              </div>

              @for (event of customerNotifications(); track event.key) {
                <div class="notification-row">
                  <div class="event-info">
                    <span class="event-badge" [style.background]="event.badgeBg" [style.color]="event.badgeColor">
                      {{ event.label }}
                    </span>
                    <span class="event-description">{{ event.description }}</span>
                  </div>
                  <div class="channel-toggle">
                    <label class="toggle-switch toggle-sm">
                      <input
                        type="checkbox"
                        [checked]="event.email"
                        [disabled]="!globalEmailEnabled()"
                        (change)="toggleEventChannel('customer', event.key, 'email')"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="channel-toggle">
                    <label class="toggle-switch toggle-sm">
                      <input
                        type="checkbox"
                        [checked]="event.push"
                        [disabled]="!globalPushEnabled()"
                        (change)="toggleEventChannel('customer', event.key, 'push')"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="action-cell">
                    <button class="send-test-btn" (click)="sendTestNotification(event.label)">
                      Send Test
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Internal Staff Notifications Section -->
          <div class="notification-section">
            <div class="section-title-row">
              <div class="section-icon staff-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>
                </svg>
              </div>
              <div>
                <h3>Internal Staff Notifications</h3>
                <p>Notifications sent to your agency team members</p>
              </div>
            </div>

            <div class="notification-list">
              <div class="notification-list-header">
                <span class="col-event">Event</span>
                <span class="col-channel">Email</span>
                <span class="col-channel">Push</span>
                <span class="col-action">Action</span>
              </div>

              @for (event of staffNotifications(); track event.key) {
                <div class="notification-row">
                  <div class="event-info">
                    <span class="event-badge badge-indigo">
                      {{ event.label }}
                    </span>
                    <span class="event-description">{{ event.description }}</span>
                  </div>
                  <div class="channel-toggle">
                    <label class="toggle-switch toggle-sm">
                      <input
                        type="checkbox"
                        [checked]="event.email"
                        [disabled]="!globalEmailEnabled()"
                        (change)="toggleEventChannel('staff', event.key, 'email')"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="channel-toggle">
                    <label class="toggle-switch toggle-sm">
                      <input
                        type="checkbox"
                        [checked]="event.push"
                        [disabled]="!globalPushEnabled()"
                        (change)="toggleEventChannel('staff', event.key, 'push')"
                      />
                      <span class="toggle-slider"></span>
                    </label>
                  </div>
                  <div class="action-cell">
                    <button class="send-test-btn" (click)="sendTestNotification(event.label)">
                      Send Test
                    </button>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Right Sidebar -->
        <aside class="notifications-sidebar">
          <!-- Notification Channels -->
          <div class="sidebar-card">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
              Notification Channels
            </h4>
            <div class="channel-info">
              <div class="channel-item">
                <div class="channel-dot email-dot"></div>
                <div>
                  <span class="channel-name">Email</span>
                  <span class="channel-desc">Sent to the registered email address. Best for important updates and records.</span>
                </div>
              </div>
              <div class="channel-item">
                <div class="channel-dot push-dot"></div>
                <div>
                  <span class="channel-name">Push</span>
                  <span class="channel-desc">Real-time browser notifications. Best for time-sensitive alerts.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Best Practices -->
          <div class="sidebar-card">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
              Best Practices
            </h4>
            <ul class="best-practices-list">
              <li>Keep booking confirmations enabled on both channels for reliability</li>
              <li>Use push for time-sensitive events like cancellations</li>
              <li>Enable email for payment events to maintain audit trails</li>
              <li>Test notifications after making changes to verify delivery</li>
            </ul>
          </div>

          <!-- Quick Summary -->
          <div class="sidebar-card summary-card">
            <h4>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
              </svg>
              Quick Summary
            </h4>
            <div class="summary-stats">
              <div class="summary-stat">
                <span class="stat-number">{{ activeEmailCount() }}</span>
                <span class="stat-label">Email Active</span>
              </div>
              <div class="summary-stat">
                <span class="stat-number">{{ activePushCount() }}</span>
                <span class="stat-label">Push Active</span>
              </div>
              <div class="summary-stat">
                <span class="stat-number">{{ totalNotifications() }}</span>
                <span class="stat-label">Total Events</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    .notifications-settings {
      width: 100%;
    }

    .notifications-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: var(--spacing-lg);
      align-items: start;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .notifications-main {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    /* ============================
       Header
       ============================ */
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: var(--spacing-md);

      @media (max-width: 600px) {
        flex-direction: column;
      }
    }

    .header-info {
      h2 {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs) 0;
      }

      p {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .reset-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      background: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;

      &:hover {
        color: var(--text-primary);
        border-color: var(--border-dark);
        background: var(--bg-secondary);
      }

      svg {
        flex-shrink: 0;
      }
    }

    /* ============================
       Global Toggles
       ============================ */
    .global-toggles {
      display: flex;
      gap: var(--spacing-md);

      @media (max-width: 600px) {
        flex-direction: column;
      }
    }

    .global-toggle-item {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xs);
    }

    .global-toggle-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .global-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .email-icon {
      background: #ede9fe;
      color: #7c3aed;
    }

    .push-icon {
      background: #fef3c7;
      color: #d97706;
    }

    .global-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .global-desc {
      display: block;
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      margin-top: 2px;
    }

    /* ============================
       Toggle Switch (iOS-style)
       ============================ */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;
      flex-shrink: 0;

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .toggle-slider {
        position: absolute;
        cursor: pointer;
        inset: 0;
        background-color: var(--color-neutral-300);
        border-radius: var(--radius-full);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &::before {
          content: '';
          position: absolute;
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          border-radius: 50%;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
        }
      }

      input:checked + .toggle-slider {
        background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
      }

      input:checked + .toggle-slider::before {
        transform: translateX(20px);
      }

      input:disabled + .toggle-slider {
        opacity: 0.4;
        cursor: not-allowed;
      }

      input:focus-visible + .toggle-slider {
        box-shadow: 0 0 0 3px rgba(255, 78, 120, 0.2);
      }
    }

    .toggle-sm {
      width: 38px;
      height: 22px;

      .toggle-slider::before {
        height: 16px;
        width: 16px;
      }

      input:checked + .toggle-slider::before {
        transform: translateX(16px);
      }
    }

    /* ============================
       Notification Section
       ============================ */
    .notification-section {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-xs);
    }

    .section-title-row {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md);
      border-bottom: 1px solid var(--border-light);

      h3 {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        margin: 0;
      }

      p {
        font-size: var(--font-size-xs);
        color: var(--text-tertiary);
        margin: 2px 0 0 0;
      }
    }

    .section-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .customer-icon {
      background: #dbeafe;
      color: #2563eb;
    }

    .staff-icon {
      background: #fce7f3;
      color: #db2777;
    }

    /* ============================
       Notification List
       ============================ */
    .notification-list {
      display: flex;
      flex-direction: column;
    }

    .notification-list-header {
      display: grid;
      grid-template-columns: 1fr 70px 70px 90px;
      gap: var(--spacing-sm);
      align-items: center;
      padding: 0 0 var(--spacing-sm) 0;
      margin-bottom: var(--spacing-xs);

      .col-event {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-semibold);
        color: var(--text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .col-channel {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-semibold);
        color: var(--text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        text-align: center;
      }

      .col-action {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-semibold);
        color: var(--text-tertiary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        text-align: center;
      }

      @media (max-width: 600px) {
        display: none;
      }
    }

    .notification-row {
      display: grid;
      grid-template-columns: 1fr 70px 70px 90px;
      gap: var(--spacing-sm);
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-top: 1px solid var(--border-light);

      &:first-of-type {
        border-top: 1px solid var(--border-light);
      }

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
        gap: var(--spacing-xs);
        padding: var(--spacing-md) 0;

        .channel-toggle,
        .action-cell {
          justify-self: start;
        }
      }
    }

    .event-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .event-badge {
      display: inline-flex;
      align-items: center;
      padding: 3px 10px;
      font-size: 11px;
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-full);
      width: fit-content;
    }

    .badge-indigo {
      background: #e0e7ff;
      color: #4338ca;
    }

    .event-description {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      padding-left: 2px;
    }

    .channel-toggle {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .action-cell {
      display: flex;
      justify-content: center;
    }

    .send-test-btn {
      padding: 5px 12px;
      font-size: 11px;
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;

      &:hover {
        color: #ff4e78;
        border-color: rgba(255, 78, 120, 0.3);
        background: rgba(255, 78, 120, 0.05);
      }
    }

    /* ============================
       Sidebar
       ============================ */
    .notifications-sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      position: sticky;
      top: calc(var(--header-height) + var(--spacing-lg));

      @media (max-width: 1024px) {
        position: static;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      }
    }

    .sidebar-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: var(--spacing-md);
      box-shadow: var(--shadow-xs);

      h4 {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-md) 0;
        padding-bottom: var(--spacing-sm);
        border-bottom: 1px solid var(--border-light);

        svg {
          color: var(--text-tertiary);
          flex-shrink: 0;
        }
      }
    }

    .channel-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .channel-item {
      display: flex;
      gap: var(--spacing-sm);
      align-items: flex-start;
    }

    .channel-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      margin-top: 5px;
      flex-shrink: 0;
    }

    .email-dot {
      background: #7c3aed;
    }

    .push-dot {
      background: #d97706;
    }

    .channel-name {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .channel-desc {
      display: block;
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      line-height: var(--line-height-normal);
      margin-top: 2px;
    }

    .best-practices-list {
      margin: 0;
      padding: 0 0 0 var(--spacing-md);
      list-style: none;

      li {
        position: relative;
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
        line-height: var(--line-height-relaxed);
        padding: 4px 0 4px 8px;

        &::before {
          content: '';
          position: absolute;
          left: -12px;
          top: 12px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
        }
      }
    }

    .summary-card {
      .summary-stats {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: var(--spacing-sm);
        text-align: center;
      }

      .summary-stat {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: var(--spacing-sm);
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
      }

      .stat-number {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .stat-label {
        font-size: 10px;
        color: var(--text-tertiary);
        font-weight: var(--font-weight-medium);
        text-transform: uppercase;
        letter-spacing: 0.03em;
      }
    }
  `]
})
export class NotificationsSettingsComponent {
  settings = input<AgencySettings | null>(null);
  settingsChange = output<AgencySettings>();

  private toast = inject(ToastService);

  globalEmailEnabled = signal(true);
  globalPushEnabled = signal(true);

  customerNotifications = signal<NotificationEvent[]>([
    {
      key: 'bookingCreated',
      label: 'Booking Created',
      description: 'When a new booking is submitted by a customer',
      badgeColor: '#1e40af',
      badgeBg: '#dbeafe',
      email: true,
      push: true,
    },
    {
      key: 'bookingConfirmed',
      label: 'Booking Confirmed',
      description: 'When a booking has been confirmed by the agency',
      badgeColor: '#065f46',
      badgeBg: '#d1fae5',
      email: true,
      push: true,
    },
    {
      key: 'bookingCancelled',
      label: 'Booking Cancelled',
      description: 'When a booking is cancelled by either party',
      badgeColor: '#dc2626',
      badgeBg: '#fee2e2',
      email: true,
      push: true,
    },
    {
      key: 'bookingRescheduled',
      label: 'Booking Rescheduled',
      description: 'When booking dates are changed',
      badgeColor: '#7c3aed',
      badgeBg: '#ede9fe',
      email: true,
      push: false,
    },
    {
      key: 'bookingReminder',
      label: 'Booking Reminder',
      description: 'Automated reminder before the trip date',
      badgeColor: '#92400e',
      badgeBg: '#fef3c7',
      email: true,
      push: true,
    },
    {
      key: 'paymentFailed',
      label: 'Payment Failed',
      description: 'When a customer payment could not be processed',
      badgeColor: '#dc2626',
      badgeBg: '#fee2e2',
      email: true,
      push: false,
    },
  ]);

  staffNotifications = signal<NotificationEvent[]>([
    {
      key: 'newBookingRequest',
      label: 'New Booking Request',
      description: 'When a customer submits a new booking',
      badgeColor: '#4338ca',
      badgeBg: '#e0e7ff',
      email: true,
      push: true,
    },
    {
      key: 'cancellationRequest',
      label: 'Cancellation Request',
      description: 'When a customer requests to cancel a booking',
      badgeColor: '#4338ca',
      badgeBg: '#e0e7ff',
      email: true,
      push: true,
    },
    {
      key: 'paymentReceived',
      label: 'Payment Received',
      description: 'When a payment is successfully processed',
      badgeColor: '#4338ca',
      badgeBg: '#e0e7ff',
      email: true,
      push: false,
    },
    {
      key: 'staffPaymentFailed',
      label: 'Payment Failed',
      description: 'When a customer payment fails or is declined',
      badgeColor: '#4338ca',
      badgeBg: '#e0e7ff',
      email: true,
      push: true,
    },
    {
      key: 'newReview',
      label: 'New Review',
      description: 'When a customer leaves a review on a package',
      badgeColor: '#4338ca',
      badgeBg: '#e0e7ff',
      email: true,
      push: false,
    },
  ]);

  constructor() {
    // Sync global toggles from settings input on init
    const currentSettings = this.settings();
    if (currentSettings) {
      this.globalEmailEnabled.set(currentSettings.emailNotifications !== false);
      this.globalPushEnabled.set(currentSettings.pushNotifications !== false);
    }
  }

  ngOnChanges(): void {
    const currentSettings = this.settings();
    if (currentSettings) {
      this.globalEmailEnabled.set(currentSettings.emailNotifications !== false);
      this.globalPushEnabled.set(currentSettings.pushNotifications !== false);
    }
  }

  toggleGlobalEmail(): void {
    const newValue = !this.globalEmailEnabled();
    this.globalEmailEnabled.set(newValue);
    this.emitSettingsChange({ emailNotifications: newValue });
  }

  toggleGlobalPush(): void {
    const newValue = !this.globalPushEnabled();
    this.globalPushEnabled.set(newValue);
    this.emitSettingsChange({ pushNotifications: newValue });
  }

  toggleEventChannel(section: 'customer' | 'staff', eventKey: string, channel: 'email' | 'push'): void {
    const sourceSignal = section === 'customer' ? this.customerNotifications : this.staffNotifications;
    const updated = sourceSignal().map(event => {
      if (event.key === eventKey) {
        return { ...event, [channel]: !event[channel] };
      }
      return event;
    });
    sourceSignal.set(updated);
  }

  sendTestNotification(eventLabel: string): void {
    this.toast.success(`Test notification sent for "${eventLabel}"`);
  }

  resetToDefaults(): void {
    this.globalEmailEnabled.set(true);
    this.globalPushEnabled.set(true);

    this.customerNotifications.update(events =>
      events.map(e => ({ ...e, email: true, push: true }))
    );
    this.staffNotifications.update(events =>
      events.map(e => ({ ...e, email: true, push: true }))
    );

    this.emitSettingsChange({
      emailNotifications: true,
      pushNotifications: true,
    });

    this.toast.info('Notification preferences reset to defaults');
  }

  activeEmailCount(): number {
    if (!this.globalEmailEnabled()) return 0;
    const customerActive = this.customerNotifications().filter(e => e.email).length;
    const staffActive = this.staffNotifications().filter(e => e.email).length;
    return customerActive + staffActive;
  }

  activePushCount(): number {
    if (!this.globalPushEnabled()) return 0;
    const customerActive = this.customerNotifications().filter(e => e.push).length;
    const staffActive = this.staffNotifications().filter(e => e.push).length;
    return customerActive + staffActive;
  }

  totalNotifications(): number {
    return this.customerNotifications().length + this.staffNotifications().length;
  }

  private emitSettingsChange(partial: Partial<AgencySettings>): void {
    const current = this.settings() || {};
    this.settingsChange.emit({ ...current, ...partial });
  }
}
