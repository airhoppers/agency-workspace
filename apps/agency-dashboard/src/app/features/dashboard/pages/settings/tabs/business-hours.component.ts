import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgencySettings, BusinessHours, DayHours } from '@workspace/core';

interface WeekDay {
  key: string;
  label: string;
  shortLabel: string;
}

interface HolidayException {
  id: string;
  name: string;
  date: string;
  type: 'closed' | 'special';
  specialOpen?: number;
  specialClose?: number;
}

const WEEK_DAYS: WeekDay[] = [
  { key: 'Monday', label: 'Monday', shortLabel: 'Mon' },
  { key: 'Tuesday', label: 'Tuesday', shortLabel: 'Tue' },
  { key: 'Wednesday', label: 'Wednesday', shortLabel: 'Wed' },
  { key: 'Thursday', label: 'Thursday', shortLabel: 'Thu' },
  { key: 'Friday', label: 'Friday', shortLabel: 'Fri' },
  { key: 'Saturday', label: 'Saturday', shortLabel: 'Sat' },
  { key: 'Sunday', label: 'Sunday', shortLabel: 'Sun' },
];

const DEFAULT_HOURS: DayHours = { open: 9, close: 17, closed: false };
const DEFAULT_CLOSED: DayHours = { open: 9, close: 17, closed: true };

const AVAILABLE_HOURS: number[] = Array.from({ length: 24 }, (_, i) => i);

@Component({
  selector: 'app-business-hours',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="business-hours-tab">
      <div class="two-column-layout">
        <!-- Main Content -->
        <div class="main-content">

          <!-- Timezone Banner -->
          <div class="timezone-banner">
            <div class="timezone-banner-content">
              <div class="timezone-icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <div class="timezone-info">
                <div class="timezone-label">Current Timezone</div>
                <div class="timezone-value">{{ displayTimezone() }}</div>
                <div class="timezone-detail">{{ timezoneOffset() }}</div>
              </div>
            </div>
            <button
              type="button"
              class="timezone-change-btn"
              (click)="onNavigateToPreferences()">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
              <span>Change in Preferences</span>
            </button>
          </div>

          <!-- Weekly Schedule Card -->
          <div class="schedule-card">
            <div class="schedule-card-header">
              <div>
                <h2 class="schedule-title">Weekly Schedule</h2>
                <p class="schedule-subtitle">Configure your operating hours for each day of the week</p>
              </div>
              <button
                type="button"
                class="copy-all-btn"
                (click)="copyMondayToAllWeekdays()">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                </svg>
                <span>Copy to All Days</span>
              </button>
            </div>

            <div class="schedule-body">
              @for (day of weekDays; track day.key) {
                <div class="day-row" [class.day-row--closed]="isDayClosed(day.key)">
                  <div class="day-toggle-section">
                    <label class="toggle-switch">
                      <input
                        type="checkbox"
                        [checked]="!isDayClosed(day.key)"
                        (change)="toggleDay(day.key)" />
                      <span class="toggle-slider"></span>
                    </label>
                    <div class="day-label-group">
                      <span class="day-name">{{ day.label }}</span>
                      @if (isDayClosed(day.key)) {
                        <span class="closed-badge">Closed</span>
                      }
                    </div>
                  </div>

                  @if (!isDayClosed(day.key)) {
                    <div class="day-hours-section">
                      <div class="time-selectors">
                        <select
                          class="time-select"
                          [class.time-select--error]="hasInvalidHours(day.key)"
                          [value]="getDayHours(day.key).open"
                          (change)="updateHour(day.key, 'open', $event)">
                          @for (hour of availableHours; track hour) {
                            <option [value]="hour" [selected]="hour === getDayHours(day.key).open">
                              {{ formatHour(hour) }}
                            </option>
                          }
                        </select>

                        <span class="time-separator">to</span>

                        <select
                          class="time-select"
                          [class.time-select--error]="hasInvalidHours(day.key)"
                          [value]="getDayHours(day.key).close"
                          (change)="updateHour(day.key, 'close', $event)">
                          @for (hour of availableHours; track hour) {
                            <option [value]="hour" [selected]="hour === getDayHours(day.key).close">
                              {{ formatHour(hour) }}
                            </option>
                          }
                        </select>
                      </div>

                      @if (hasInvalidHours(day.key)) {
                        <div class="time-error">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
                            <line x1="12" y1="16" x2="12.01" y2="16"/>
                          </svg>
                          <span>Closing time must be after opening time</span>
                        </div>
                      }

                      <button
                        type="button"
                        class="add-break-btn"
                        (click)="onAddBreak(day.key)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                             fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                          <line x1="12" y1="5" x2="12" y2="19"/>
                          <line x1="5" y1="12" x2="19" y2="12"/>
                        </svg>
                        <span>Add Break Period</span>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Holidays & Exception Days -->
          <div class="schedule-card">
            <div class="schedule-card-header">
              <div>
                <h2 class="schedule-title">Holidays & Exception Days</h2>
                <p class="schedule-subtitle">Add specific dates when your business will be closed or have special hours</p>
              </div>
              <button
                type="button"
                class="accent-btn"
                (click)="onAddException()">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>Add Exception</span>
              </button>
            </div>

            <div class="exceptions-body">
              @for (exception of holidays(); track exception.id) {
                <div class="exception-row" [class.exception-row--closed]="exception.type === 'closed'"
                     [class.exception-row--special]="exception.type === 'special'">
                  <div class="exception-icon-wrapper" [class.exception-icon--closed]="exception.type === 'closed'"
                       [class.exception-icon--special]="exception.type === 'special'">
                    @if (exception.type === 'closed') {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                        <line x1="9" y1="16" x2="15" y2="16"/>
                      </svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                    }
                  </div>
                  <div class="exception-details">
                    <div class="exception-name">{{ exception.name }}</div>
                    <div class="exception-date">
                      {{ exception.date }}
                      @if (exception.type === 'closed') {
                        <span> &bull; Closed all day</span>
                      } @else if (exception.specialOpen !== undefined && exception.specialClose !== undefined) {
                        <span> &bull; Special hours: {{ formatHour(exception.specialOpen) }} - {{ formatHour(exception.specialClose) }}</span>
                      }
                    </div>
                  </div>
                  <button type="button" class="exception-delete-btn" (click)="removeException(exception.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              } @empty {
                <div class="exceptions-empty">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  <p>No exception days configured</p>
                  <span>Add holidays or special hours for specific dates</span>
                </div>
              }
            </div>
          </div>

        </div>

        <!-- Help Sidebar -->
        <div class="help-sidebar">
          <div class="sidebar-sticky">

            <!-- Tips Card -->
            <div class="sidebar-card">
              <div class="sidebar-card-header">
                <div class="sidebar-icon-wrapper sidebar-icon--accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="9" y1="18" x2="15" y2="18"/>
                    <line x1="10" y1="22" x2="14" y2="22"/>
                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
                  </svg>
                </div>
                <h3 class="sidebar-card-title">Tips & Best Practices</h3>
              </div>
              <div class="tips-list">
                <div class="tip-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                       class="tip-check">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div>
                    <div class="tip-title">Standard Business Hours</div>
                    <p class="tip-text">Most travel agencies operate Mon-Fri, 9 AM - 5 PM with weekends off</p>
                  </div>
                </div>
                <div class="tip-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                       class="tip-check">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div>
                    <div class="tip-title">Break Periods</div>
                    <p class="tip-text">Add lunch breaks (12-1 PM) to prevent booking conflicts during team breaks</p>
                  </div>
                </div>
                <div class="tip-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
                       class="tip-check">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div>
                    <div class="tip-title">Holiday Planning</div>
                    <p class="tip-text">Add major holidays in advance to avoid booking confusion</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- How It Works Card -->
            <div class="sidebar-card sidebar-card--info">
              <div class="sidebar-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="var(--color-info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <h3 class="sidebar-card-title">How It Works</h3>
              </div>
              <div class="how-it-works-list">
                <p><strong>Operating Hours:</strong> Set your daily schedule when customers can make bookings</p>
                <p><strong>Break Periods:</strong> Block time for lunch or team meetings when bookings aren't accepted</p>
                <p><strong>Closed Days:</strong> Toggle off days when your agency is closed</p>
                <p><strong>Exceptions:</strong> Override normal hours for holidays or special events</p>
              </div>
            </div>

            <!-- Common Examples Card -->
            <div class="sidebar-card">
              <h3 class="sidebar-card-title" style="margin-bottom: var(--spacing-md)">Common Examples</h3>
              <div class="examples-list">
                <div class="example-item">
                  <div class="example-title">Standard Weekday</div>
                  <p class="example-hours">9:00 AM - 5:00 PM</p>
                  <p class="example-note">Break: 12:00 PM - 1:00 PM</p>
                </div>
                <div class="example-item">
                  <div class="example-title">Extended Friday</div>
                  <p class="example-hours">9:00 AM - 7:00 PM</p>
                  <p class="example-note">For weekend travel planning</p>
                </div>
                <div class="example-item">
                  <div class="example-title">Half-Day Saturday</div>
                  <p class="example-hours">10:00 AM - 2:00 PM</p>
                  <p class="example-note">Limited weekend availability</p>
                </div>
              </div>
            </div>

            <!-- Need Help Card -->
            <div class="sidebar-card">
              <h3 class="sidebar-card-title" style="margin-bottom: var(--spacing-md)">Need Help?</h3>
              <div class="help-links">
                <a href="javascript:void(0)" class="help-link">
                  <div class="help-link-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    <span>Business Hours Guide</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
                <a href="javascript:void(0)" class="help-link">
                  <div class="help-link-content">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>Contact Support</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                       fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ===== Layout ===== */
    .business-hours-tab {
      width: 100%;
    }

    .two-column-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: var(--spacing-lg);
      align-items: start;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      min-width: 0;
    }

    /* ===== Timezone Banner ===== */
    .timezone-banner {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
      background: linear-gradient(135deg, var(--color-info-light) 0%, #e8eaf6 100%);
      border: 1px solid var(--color-primary-200);
      border-radius: var(--radius-xl);
    }

    .timezone-banner-content {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .timezone-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      background-color: var(--color-primary-100);
      color: var(--color-primary-700);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .timezone-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .timezone-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .timezone-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      line-height: var(--line-height-tight);
    }

    .timezone-detail {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .timezone-change-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--bg-primary);
      border: 1px solid var(--color-primary-300);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-primary-700);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
      flex-shrink: 0;

      &:hover {
        background-color: var(--color-primary-50);
        border-color: var(--color-primary-400);
      }
    }

    /* ===== Schedule Card ===== */
    .schedule-card {
      background-color: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .schedule-card-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--spacing-md);
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-light);
    }

    .schedule-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-xs) 0;
    }

    .schedule-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .copy-all-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--bg-tertiary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
      flex-shrink: 0;

      &:hover {
        background-color: var(--color-neutral-200);
      }
    }

    .accent-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
      border: none;
      border-radius: var(--radius-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-inverse);
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;
      flex-shrink: 0;
      box-shadow: var(--shadow-md);

      &:hover {
        box-shadow: var(--shadow-lg);
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }

    /* ===== Day Rows ===== */
    .schedule-body {
      padding: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .day-row {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    .day-row--closed {
      opacity: 0.7;
      background-color: var(--bg-tertiary);
    }

    .day-toggle-section {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      min-width: 160px;
      flex-shrink: 0;
    }

    .day-label-group {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .day-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .closed-badge {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      font-style: italic;
    }

    /* ===== Toggle Switch ===== */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 36px;
      height: 20px;
      flex-shrink: 0;
      cursor: pointer;

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }
    }

    .toggle-slider {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--color-neutral-300);
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);

      &::before {
        content: '';
        position: absolute;
        height: 16px;
        width: 16px;
        left: 2px;
        bottom: 2px;
        background-color: var(--bg-primary);
        border-radius: 50%;
        transition: all var(--transition-fast);
        box-shadow: var(--shadow-xs);
      }
    }

    .toggle-switch input:checked + .toggle-slider {
      background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
    }

    .toggle-switch input:checked + .toggle-slider::before {
      transform: translateX(16px);
    }

    .toggle-switch input:focus-visible + .toggle-slider {
      outline: 2px solid var(--border-focus);
      outline-offset: 2px;
    }

    /* ===== Time Selectors ===== */
    .day-hours-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .time-selectors {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .time-select {
      flex: 1;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      appearance: auto;

      &:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }

      &:hover {
        border-color: var(--border-dark);
      }
    }

    .time-select--error {
      border-color: var(--color-error, #ef4444);
      background-color: #fef2f2;

      &:focus {
        border-color: var(--color-error, #ef4444);
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
      }
    }

    .time-error {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-xs);
      color: var(--color-error, #ef4444);
      margin-top: 2px;
    }

    .time-separator {
      font-size: var(--font-size-sm);
      color: var(--text-tertiary);
      flex-shrink: 0;
      padding: 0 var(--spacing-xs);
    }

    .add-break-btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: 0;
      background: none;
      border: none;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: #ff4e78;
      cursor: pointer;
      transition: color var(--transition-fast);
      align-self: flex-start;

      &:hover {
        color: #e63965;
      }
    }

    /* ===== Exceptions ===== */
    .exceptions-body {
      padding: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .exception-row {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);
    }

    .exception-row--closed {
      background-color: var(--color-error-light);
      border: 1px solid #ffcdd2;
    }

    .exception-row--special {
      background-color: var(--color-warning-light);
      border: 1px solid #ffe0b2;
    }

    .exception-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .exception-icon--closed {
      background-color: #ffcdd2;
      color: var(--color-error);
    }

    .exception-icon--special {
      background-color: #ffe0b2;
      color: var(--color-warning-dark);
    }

    .exception-details {
      flex: 1;
      min-width: 0;
    }

    .exception-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .exception-date {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .exception-delete-btn {
      padding: var(--spacing-sm);
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      flex-shrink: 0;

      &:hover {
        color: var(--color-error);
        background-color: var(--color-error-light);
      }
    }

    .exceptions-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-2xl) var(--spacing-md);
      color: var(--text-tertiary);
      text-align: center;

      p {
        margin: 0;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-secondary);
      }

      span {
        font-size: var(--font-size-xs);
        color: var(--text-tertiary);
      }
    }

    /* ===== Help Sidebar ===== */
    .help-sidebar {
      min-width: 0;
    }

    .sidebar-sticky {
      position: sticky;
      top: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .sidebar-card {
      background-color: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      padding: var(--spacing-lg);
    }

    .sidebar-card--info {
      background: linear-gradient(135deg, var(--color-info-light) 0%, #e8eaf6 100%);
      border-color: var(--color-primary-200);
    }

    .sidebar-card-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }

    .sidebar-card-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .sidebar-icon-wrapper {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sidebar-icon--accent {
      background: linear-gradient(135deg, rgba(255, 147, 112, 0.1) 0%, rgba(255, 78, 120, 0.1) 100%);
      color: #ff4e78;
    }

    /* ===== Tips ===== */
    .tips-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .tip-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
    }

    .tip-check {
      color: var(--color-success);
      flex-shrink: 0;
      margin-top: 2px;
    }

    .tip-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .tip-text {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
      line-height: var(--line-height-normal);
    }

    /* ===== How It Works ===== */
    .how-it-works-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);

      p {
        margin: 0;
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
        line-height: var(--line-height-normal);

        strong {
          color: var(--text-primary);
        }
      }
    }

    /* ===== Common Examples ===== */
    .examples-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .example-item {
      padding: var(--spacing-md);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }

    .example-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .example-hours {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0;
    }

    .example-note {
      font-size: 10px;
      color: var(--text-tertiary);
      margin: var(--spacing-xs) 0 0;
    }

    /* ===== Help Links ===== */
    .help-links {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .help-link {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px var(--spacing-md);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
      text-decoration: none;
      color: var(--text-tertiary);
      transition: all var(--transition-fast);

      &:hover {
        background-color: var(--bg-tertiary);

        .help-link-content span {
          color: var(--text-primary);
        }
      }
    }

    .help-link-content {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      span {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
      }

      svg {
        color: var(--text-secondary);
      }
    }

    /* ===== Responsive ===== */
    @media (max-width: 1024px) {
      .two-column-layout {
        grid-template-columns: 1fr;
      }

      .help-sidebar {
        order: -1;
      }

      .sidebar-sticky {
        position: static;
        flex-direction: row;
        flex-wrap: wrap;
      }

      .sidebar-card {
        flex: 1;
        min-width: 280px;
      }
    }

    @media (max-width: 768px) {
      .timezone-banner {
        flex-direction: column;
      }

      .timezone-change-btn {
        align-self: flex-start;
      }

      .schedule-card-header {
        flex-direction: column;
      }

      .day-row {
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .day-toggle-section {
        min-width: auto;
      }

      .time-selectors {
        flex-wrap: wrap;
      }
    }

    @media (max-width: 480px) {
      .sidebar-sticky {
        flex-direction: column;
      }

      .sidebar-card {
        min-width: auto;
      }
    }
  `],
})
export class BusinessHoursComponent implements OnInit {
  /** The current agency settings object. */
  readonly settings = input<AgencySettings | null>(null);

  /** Emits the full updated settings whenever business hours change. */
  readonly settingsChange = output<AgencySettings>();

  /** Emits a tab identifier to navigate to (e.g. 'preferences'). */
  readonly navigateToTab = output<string>();

  /** Internal mutable copy of the business hours map. */
  readonly hours = signal<BusinessHours>({});

  /** Static list of example holiday exceptions (frontend-only). */
  readonly holidays = signal<HolidayException[]>([
    {
      id: 'christmas-2025',
      name: 'Christmas Day',
      date: 'December 25, 2025',
      type: 'closed',
    },
    {
      id: 'new-year-2026',
      name: "New Year's Day",
      date: 'January 1, 2026',
      type: 'closed',
    },
    {
      id: 'thanksgiving-2025',
      name: 'Thanksgiving',
      date: 'November 27, 2025',
      type: 'special',
      specialOpen: 9,
      specialClose: 14,
    },
  ]);

  readonly weekDays = WEEK_DAYS;
  readonly availableHours = AVAILABLE_HOURS;

  /** Display-friendly timezone string derived from settings. */
  readonly displayTimezone = computed(() => {
    const tz = this.settings()?.timezone;
    if (!tz) return 'Not configured';
    return tz.replace(/_/g, ' ').replace(/\//g, ' / ');
  });

  /** Shows a UTC offset hint or prompt to configure. */
  readonly timezoneOffset = computed(() => {
    const tz = this.settings()?.timezone;
    if (!tz) return 'Please set your timezone in Preferences';
    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'longOffset',
      });
      const parts = formatter.formatToParts(new Date());
      const offsetPart = parts.find(p => p.type === 'timeZoneName');
      return offsetPart?.value ?? tz;
    } catch {
      return tz;
    }
  });

  private readonly settingsEffect = effect(() => {
    const s = this.settings();
    this.initializeHours(s);
  });

  ngOnInit(): void {
    this.initializeHours(this.settings());
  }

  /**
   * Seeds the local hours signal from the input settings,
   * falling back to sensible defaults (weekdays 9-17, weekends closed).
   */
  private initializeHours(s: AgencySettings | null): void {
    const incoming = s?.agencyBusinessHours?.hours;
    const result: BusinessHours = {};

    for (const day of WEEK_DAYS) {
      if (incoming && incoming[day.key]) {
        result[day.key] = { ...incoming[day.key] };
      } else {
        const isWeekend = day.key === 'Saturday' || day.key === 'Sunday';
        result[day.key] = isWeekend ? { ...DEFAULT_CLOSED } : { ...DEFAULT_HOURS };
      }
    }

    this.hours.set(result);
  }

  /** Whether a given day is marked as closed. */
  isDayClosed(dayKey: string): boolean {
    return this.hours()[dayKey]?.closed ?? false;
  }

  /** Whether a day's closing time is not after its opening time. */
  hasInvalidHours(dayKey: string): boolean {
    const h = this.hours()[dayKey];
    if (!h || h.closed) return false;
    return h.close <= h.open;
  }

  /** Returns the DayHours for a given day, with safe defaults. */
  getDayHours(dayKey: string): DayHours {
    return this.hours()[dayKey] ?? DEFAULT_HOURS;
  }

  /** Toggles a day between open and closed. */
  toggleDay(dayKey: string): void {
    const current = this.hours();
    const dayHours = current[dayKey] ?? { ...DEFAULT_HOURS };

    this.hours.set({
      ...current,
      [dayKey]: {
        ...dayHours,
        closed: !dayHours.closed,
      },
    });

    this.emitChange();
  }

  /** Updates the open or close hour for a specific day. */
  updateHour(dayKey: string, field: 'open' | 'close', event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);
    if (isNaN(value)) return;

    const current = this.hours();
    const dayHours = current[dayKey] ?? { ...DEFAULT_HOURS };

    this.hours.set({
      ...current,
      [dayKey]: {
        ...dayHours,
        [field]: value,
      },
    });

    this.emitChange();
  }

  /** Copies Monday's schedule to all other weekdays (Tue-Fri). */
  copyMondayToAllWeekdays(): void {
    const current = this.hours();
    const mondayHours = current['Monday'] ?? { ...DEFAULT_HOURS };
    const updated: BusinessHours = { ...current };

    for (const day of WEEK_DAYS) {
      if (day.key !== 'Monday' && day.key !== 'Saturday' && day.key !== 'Sunday') {
        updated[day.key] = { ...mondayHours };
      }
    }

    this.hours.set(updated);
    this.emitChange();
  }

  /**
   * Formats a 0-23 hour number into 12-hour AM/PM display.
   * e.g. 0 -> "12:00 AM", 9 -> "9:00 AM", 13 -> "1:00 PM"
   */
  formatHour(hour: number): string {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const display = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${display}:00 ${suffix}`;
  }

  /** Placeholder handler for "Add Break Period" (frontend-only). */
  onAddBreak(dayKey: string): void {
    // Break periods are a frontend-only placeholder for future implementation.
    // No-op for now; the button is rendered for UI completeness.
  }

  /** Placeholder handler for "Add Exception" (frontend-only). */
  onAddException(): void {
    // Exception day creation is a frontend-only placeholder for future implementation.
  }

  /** Removes a holiday exception by id (frontend-only list management). */
  removeException(id: string): void {
    this.holidays.update(list => list.filter(h => h.id !== id));
  }

  /** Emits a navigateToTab event targeting the preferences tab. */
  onNavigateToPreferences(): void {
    this.navigateToTab.emit('preferences');
  }

  /**
   * Builds a new AgencySettings object reflecting the current hours
   * and emits it through settingsChange.
   */
  private emitChange(): void {
    const currentSettings = this.settings() ?? {};

    const updatedSettings: AgencySettings = {
      ...currentSettings,
      agencyBusinessHours: {
        hours: { ...this.hours() },
      },
    };

    this.settingsChange.emit(updatedSettings);
  }
}
