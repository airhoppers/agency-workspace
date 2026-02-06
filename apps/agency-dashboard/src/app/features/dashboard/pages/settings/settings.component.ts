import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent, ToastService } from '@workspace/shared-ui';
import { AgencyService, AgencySettings, UpdateAgencySettingsRequest } from '@workspace/core';
import { BookingLimitsComponent } from './tabs/booking-limits.component';
import { BusinessHoursComponent } from './tabs/business-hours.component';
import { NotificationsSettingsComponent } from './tabs/notifications-settings.component';
import { CancellationPolicyComponent } from './tabs/cancellation-policy.component';
import { PreferencesComponent } from './tabs/preferences.component';
import { AuditLogComponent } from './tabs/audit-log.component';

interface SettingsTab {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    LoadingComponent,
    BookingLimitsComponent,
    BusinessHoursComponent,
    NotificationsSettingsComponent,
    CancellationPolicyComponent,
    PreferencesComponent,
    AuditLogComponent
  ],
  template: `
    <div class="settings-page">
      <!-- Header -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-text">
            <h1>Agency Settings</h1>
            <p>Configure your agency preferences, business hours, and policies</p>
          </div>
        </div>
      </div>

      <!-- Unsaved Changes Bar -->
      @if (hasUnsavedChanges()) {
        <div class="unsaved-bar">
          <div class="unsaved-content">
            <div class="unsaved-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <span>You have unsaved changes</span>
          </div>
          <div class="unsaved-actions">
            <button class="btn-discard" (click)="discardChanges()">Discard</button>
            <button class="btn-save" (click)="saveAllChanges()" [disabled]="isSaving()">
              @if (isSaving()) {
                <span class="spinner"></span>
              }
              Save Changes
            </button>
          </div>
        </div>
      }

      @if (isLoading()) {
        <div class="loading-container">
          <app-loading size="lg" text="Loading settings..."></app-loading>
        </div>
      } @else {
        <!-- Tab Navigation -->
        <div class="tabs-container">
          <nav class="tabs-nav" role="tablist">
            @for (tab of tabs; track tab.id) {
              <button
                class="tab-btn"
                [class.active]="activeTab() === tab.id"
                (click)="setActiveTab(tab.id)"
                role="tab"
                [attr.aria-selected]="activeTab() === tab.id">
                <span class="tab-icon" [innerHTML]="tab.icon"></span>
                <span class="tab-label">{{ tab.label }}</span>
              </button>
            }
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="tab-content">
          @switch (activeTab()) {
            @case ('booking-limits') {
              <app-booking-limits
                [settings]="settings()!"
                (settingsChange)="onSettingsChanged($event)">
              </app-booking-limits>
            }
            @case ('business-hours') {
              <app-business-hours
                [settings]="settings()!"
                (settingsChange)="onSettingsChanged($event)"
                (navigateToTab)="setActiveTab($event)">
              </app-business-hours>
            }
            @case ('notifications') {
              <app-notifications-settings
                [settings]="settings()!"
                (settingsChange)="onSettingsChanged($event)">
              </app-notifications-settings>
            }
            @case ('cancellation') {
              <app-cancellation-policy
                [settings]="settings()!"
                (settingsChange)="onSettingsChanged($event)">
              </app-cancellation-policy>
            }
            @case ('preferences') {
              <app-preferences
                [settings]="settings()!"
                (settingsChange)="onSettingsChanged($event)">
              </app-preferences>
            }
            @case ('audit-log') {
              <app-audit-log [agencyId]="agencyId()"></app-audit-log>
            }
          }
        </div>
      }

      <!-- Success Toast Overlay -->
      @if (showSuccess()) {
        <div class="success-overlay" (click)="showSuccess.set(false)">
          <div class="success-card" (click)="$event.stopPropagation()">
            <div class="success-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>Settings Updated Successfully</h3>
            <p>Your changes have been saved and are now active.</p>
            <button class="btn-save" (click)="showSuccess.set(false)">Continue</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }

    .settings-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-md);
    }

    /* Header */
    .page-header {
      margin-bottom: var(--spacing-lg);
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-text {
      h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs) 0;
      }
      p {
        font-size: var(--font-size-base);
        color: var(--text-secondary);
        margin: 0;
      }
    }

    /* Unsaved Changes Bar */
    .unsaved-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-sm) var(--spacing-lg);
      background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
      border: 1px solid #f59e0b;
      border-radius: var(--radius-lg);
      margin-bottom: var(--spacing-lg);
      animation: slideDown 0.3s ease;
    }

    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .unsaved-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      color: #92400e;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .unsaved-icon {
      display: flex;
      color: #f59e0b;
    }

    .unsaved-actions {
      display: flex;
      gap: var(--spacing-sm);
    }

    .btn-discard {
      padding: var(--spacing-xs) var(--spacing-md);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      background: white;
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover { background: var(--bg-secondary); }
    }

    .btn-save {
      padding: var(--spacing-xs) var(--spacing-lg);
      border: none;
      border-radius: var(--radius-md);
      background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
      color: white;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);

      &:hover { opacity: 0.9; transform: translateY(-1px); }
      &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    }

    .spinner {
      display: inline-block;
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Loading */
    .loading-container {
      display: flex;
      justify-content: center;
      padding: var(--spacing-2xl);
    }

    /* Tab Navigation */
    .tabs-container {
      margin-bottom: var(--spacing-lg);
    }

    .tabs-nav {
      display: flex;
      gap: var(--spacing-xs);
      border-bottom: 2px solid var(--border-light);
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;
      padding-bottom: 0;

      &::-webkit-scrollbar { display: none; }
    }

    .tab-btn {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      border: none;
      background: none;
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      white-space: nowrap;
      border-bottom: 2px solid transparent;
      margin-bottom: -2px;
      transition: all var(--transition-fast);

      &:hover {
        color: var(--text-primary);
        background: var(--bg-secondary);
        border-radius: var(--radius-md) var(--radius-md) 0 0;
      }

      &.active {
        color: #ff4e78;
        border-bottom-color: #ff4e78;

        .tab-icon { color: #ff4e78; }
      }
    }

    .tab-icon {
      display: flex;
      align-items: center;
      color: var(--text-tertiary);

      :host ::ng-deep svg {
        width: 18px;
        height: 18px;
      }
    }

    .tab-label {
      @media (max-width: 768px) {
        display: none;
      }
    }

    /* Tab Content */
    .tab-content {
      animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Success Overlay */
    .success-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal);
      animation: fadeIn 0.2s ease;
    }

    .success-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      text-align: center;
      max-width: 400px;
      width: 90%;
      box-shadow: var(--shadow-xl);

      .success-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255,147,112,0.1) 0%, rgba(255,78,120,0.1) 100%);
        color: #ff4e78;
        margin-bottom: var(--spacing-md);
      }

      h3 {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-sm) 0;
      }

      p {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin: 0 0 var(--spacing-lg) 0;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private toast = inject(ToastService);

  isLoading = signal(true);
  isSaving = signal(false);
  hasUnsavedChanges = signal(false);
  showSuccess = signal(false);
  settings = signal<AgencySettings | null>(null);
  originalSettings = signal<AgencySettings | null>(null);
  agencyId = signal('');
  activeTab = signal('booking-limits');

  tabs: SettingsTab[] = [
    {
      id: 'booking-limits',
      label: 'Booking Limits',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>'
    },
    {
      id: 'business-hours',
      label: 'Business Hours',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>'
    },
    {
      id: 'cancellation',
      label: 'Cancellation',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>'
    },
    {
      id: 'audit-log',
      label: 'Audit Log',
      icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>'
    }
  ];

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) {
      this.isLoading.set(false);
      return;
    }

    this.agencyId.set(agency.id);

    this.agencyService.getAgencySettings(agency.id).subscribe({
      next: (settings) => {
        this.settings.set({ ...settings });
        this.originalSettings.set({ ...settings });
        this.isLoading.set(false);
      },
      error: () => {
        // If no settings exist yet, create defaults
        const defaults: AgencySettings = {
          language: 'en',
          bookingLimitPerDay: 10,
          cancellationPolicy: '',
          currency: 'EUR',
          emailNotifications: true,
          pushNotifications: true,
          timezone: 'UTC',
          agencyBusinessHours: {
            hours: {
              Monday: { open: 9, close: 17, closed: false },
              Tuesday: { open: 9, close: 17, closed: false },
              Wednesday: { open: 9, close: 17, closed: false },
              Thursday: { open: 9, close: 17, closed: false },
              Friday: { open: 9, close: 17, closed: false },
              Saturday: { open: 9, close: 17, closed: true },
              Sunday: { open: 0, close: 0, closed: true }
            }
          }
        };
        this.settings.set(defaults);
        this.originalSettings.set({ ...defaults });
        this.isLoading.set(false);
      }
    });
  }

  setActiveTab(tabId: string): void {
    this.activeTab.set(tabId);
  }

  onSettingsChanged(updatedSettings: AgencySettings): void {
    this.settings.set(updatedSettings);
    this.hasUnsavedChanges.set(true);
  }

  discardChanges(): void {
    const original = this.originalSettings();
    if (original) {
      this.settings.set({ ...original });
    }
    this.hasUnsavedChanges.set(false);
    this.toast.info('Changes discarded');
  }

  saveAllChanges(): void {
    const current = this.settings();
    const agencyId = this.agencyId();
    if (!current || !agencyId) return;

    this.isSaving.set(true);

    const request: UpdateAgencySettingsRequest = {
      language: current.language,
      bookingLimitPerDay: current.bookingLimitPerDay,
      cancellationPolicy: current.cancellationPolicy,
      currency: current.currency,
      emailNotifications: current.emailNotifications,
      pushNotifications: current.pushNotifications,
      timezone: current.timezone,
    };

    // Serialize business hours to JSON string for the backend
    if (current.agencyBusinessHours?.hours) {
      request.businessHours = JSON.stringify(current.agencyBusinessHours.hours);
    }

    this.agencyService.updateAgencySettings(agencyId, request).subscribe({
      next: (saved) => {
        this.settings.set({ ...saved });
        this.originalSettings.set({ ...saved });
        this.hasUnsavedChanges.set(false);
        this.isSaving.set(false);
        this.showSuccess.set(true);
      },
      error: (err) => {
        this.isSaving.set(false);
        this.toast.error(err.message || 'Failed to save settings');
      }
    });
  }
}
