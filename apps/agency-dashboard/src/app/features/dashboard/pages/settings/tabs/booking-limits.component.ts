import {
  Component,
  input,
  output,
  signal,
  computed,
  effect,
  EventEmitter,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AgencySettings } from '@workspace/core';

type CapacityBehavior = 'hide' | 'waitlist' | 'show-booked';

interface CapacityRule {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
  icon: string;
}

@Component({
  selector: 'app-booking-limits',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  template: `
    <!-- Unsaved Changes Bar -->
    @if (hasUnsavedChanges()) {
      <div class="unsaved-bar">
        <div class="unsaved-bar-inner">
          <div class="unsaved-bar-info">
            <div class="unsaved-bar-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div>
              <div class="unsaved-bar-title">Unsaved Changes</div>
              <div class="unsaved-bar-desc">You have unsaved changes to your booking limits &amp; capacity settings</div>
            </div>
          </div>
          <div class="unsaved-bar-actions">
            <button type="button" class="btn-discard" (click)="discardChanges()">Discard</button>
            <button type="button" class="btn-save-gradient" (click)="emitChanges()">Save Changes</button>
          </div>
        </div>
      </div>
    }

    <div class="booking-limits-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1>Booking Limits & Capacity</h1>
          <p>Control how many bookings you can accept per day, per package, and manage capacity rules</p>
        </div>
      </div>

      <div class="two-column-layout">
        <!-- Main Content -->
        <div class="main-content">

          <!-- Global Daily Limits -->
          <section class="settings-card">
            <div class="card-header-row">
              <div>
                <h2>Global Daily Limits</h2>
                <p class="card-subtitle">Set maximum bookings across all packages and services</p>
              </div>
              <label class="toggle-switch" for="enableGlobalLimit">
                <input
                  type="checkbox"
                  id="enableGlobalLimit"
                  [checked]="globalLimitEnabled()"
                  (change)="toggleGlobalLimit()"
                />
                <span class="toggle-slider"></span>
                <span class="toggle-label">{{ globalLimitEnabled() ? 'Enabled' : 'Disabled' }}</span>
              </label>
            </div>

            <div class="card-body" [class.disabled-section]="!globalLimitEnabled()">
              <div class="limit-input-group">
                <div>
                  <label class="field-label" for="bookingLimitPerDay">
                    Maximum Bookings Per Day
                    <span class="required-marker">*</span>
                  </label>
                  <input
                    type="number"
                    id="bookingLimitPerDay"
                    class="number-input"
                    [ngModel]="bookingLimitPerDay()"
                    (ngModelChange)="onBookingLimitChange($event)"
                    [disabled]="!globalLimitEnabled()"
                    min="1"
                    max="9999"
                    placeholder="20"
                  />
                </div>
                <div class="input-hint-block">
                  <div class="hint-example">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="var(--color-info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                    <span><strong>Example:</strong> Max {{ bookingLimitPerDay() || 20 }} bookings/day across all packages</span>
                  </div>
                  <div class="hint-secondary">
                    This prevents overbooking across your entire agency portfolio
                  </div>
                </div>
              </div>

              <!-- Usage Indicator -->
              <div class="usage-banner">
                <div class="usage-banner-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                  </svg>
                </div>
                <div class="usage-banner-content">
                  <div class="usage-banner-title">Current Usage</div>
                  <div class="usage-progress-row">
                    <div class="usage-progress-info">
                      <span>Today: 0 / {{ bookingLimitPerDay() || 0 }} bookings</span>
                      <span>0%</span>
                    </div>
                    <div class="usage-progress-track">
                      <div class="usage-progress-bar" [style.width.%]="0"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Capacity Rules -->
          <section class="settings-card">
            <div class="card-header-section">
              <h2>Capacity Rules</h2>
              <p class="card-subtitle">Configure how capacity is calculated and managed</p>
            </div>

            <div class="card-body">
              @for (rule of capacityRules(); track rule.id) {
                <div class="capacity-rule-item" [class.last-rule]="$last">
                  <div class="capacity-rule-header">
                    <div class="capacity-rule-info">
                      <div class="capacity-rule-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          @if (rule.id === 'staff') {
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          } @else if (rule.id === 'resource') {
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                          } @else {
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          }
                        </svg>
                      </div>
                      <div>
                        <span class="capacity-rule-label">{{ rule.label }}</span>
                        <span class="capacity-rule-desc">{{ rule.description }}</span>
                      </div>
                    </div>
                    <label class="toggle-switch" [for]="'capacityRule-' + rule.id">
                      <input
                        type="checkbox"
                        [id]="'capacityRule-' + rule.id"
                        [checked]="rule.enabled"
                        (change)="toggleCapacityRule(rule.id)"
                      />
                      <span class="toggle-slider"></span>
                      <span class="toggle-label">{{ rule.enabled ? 'On' : 'Off' }}</span>
                    </label>
                  </div>

                  @if (rule.enabled) {
                    <div class="capacity-rule-expanded">
                      @if (rule.id === 'staff') {
                        <div class="rule-detail-row">
                          <input type="number" class="number-input small" value="5" min="1" placeholder="5" />
                          <div class="rule-detail-hint">
                            <span class="hint-example">
                              <strong>Example:</strong> Each staff member can handle max 5 bookings per day
                            </span>
                            <span class="hint-secondary">Total capacity = (Number of available staff) x (Bookings per staff)</span>
                          </div>
                        </div>
                      } @else if (rule.id === 'resource') {
                        <div class="rule-detail-hint">
                          <span class="hint-example">
                            <strong>Example:</strong> 3 Safari Vehicles available = max 3 concurrent bookings
                          </span>
                          <span class="hint-secondary">Configure specific resources in the Resources section</span>
                        </div>
                      } @else {
                        <div class="rule-detail-hint">
                          <span class="hint-example">
                            <strong>Example:</strong> 09:00 AM - 12:00 PM slot = max 2 bookings
                          </span>
                          <span class="hint-secondary">Configure time slots in the Schedule section</span>
                        </div>
                      }
                    </div>
                  }

                  @if (!$last) {
                    <div class="rule-divider"></div>
                  }
                </div>
              }
            </div>
          </section>

          <!-- When Capacity is Reached -->
          <section class="settings-card">
            <div class="card-header-section">
              <h2>When Capacity is Reached</h2>
              <p class="card-subtitle">Choose what happens when booking limits are met</p>
            </div>

            <div class="card-body">
              <div class="radio-options">
                @for (option of capacityBehaviorOptions; track option.value) {
                  <label
                    class="radio-card"
                    [class.radio-card-selected]="capacityBehavior() === option.value"
                  >
                    <input
                      type="radio"
                      name="capacityBehavior"
                      [value]="option.value"
                      [checked]="capacityBehavior() === option.value"
                      (change)="onCapacityBehaviorChange(option.value)"
                    />
                    <div class="radio-card-content">
                      <div class="radio-card-title">{{ option.label }}</div>
                      <div class="radio-card-desc">{{ option.description }}</div>
                      <div class="radio-card-tip">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                             stroke="var(--color-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        <span>{{ option.tip }}</span>
                      </div>
                    </div>
                  </label>
                }
              </div>
            </div>
          </section>

          <!-- Validation Summary -->
          <div class="validation-banner">
            <div class="validation-banner-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <div class="validation-banner-content">
              <div class="validation-banner-title">Validation & Conflicts</div>
              <div class="validation-items">
                <div class="validation-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="var(--color-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Global daily limit ({{ bookingLimitPerDay() || 0 }}) configured - OK</span>
                </div>
                <div class="validation-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="var(--color-success)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <span>Capacity rules do not conflict with global limits - OK</span>
                </div>
                <div class="validation-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="var(--color-info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <span>Tip: Enable waitlist to capture overflow demand during peak seasons</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Help Sidebar -->
        <aside class="help-sidebar">
          <div class="sidebar-sticky">

            <!-- Understanding Limits -->
            <div class="help-card">
              <div class="help-card-header">
                <div class="help-card-icon accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="9" y1="18" x2="15" y2="18"/>
                    <line x1="10" y1="22" x2="14" y2="22"/>
                    <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
                  </svg>
                </div>
                <h3>Understanding Limits</h3>
              </div>
              <div class="help-card-items">
                <div class="help-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="var(--color-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div>
                    <div class="help-item-title">Global vs Package</div>
                    <p>Global limit applies across all packages. Package limits are per-package maximums.</p>
                  </div>
                </div>
                <div class="help-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="var(--color-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div>
                    <div class="help-item-title">Capacity Rules</div>
                    <p>Use staff, resource, or time-based rules to match your operational constraints.</p>
                  </div>
                </div>
                <div class="help-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="var(--color-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <div>
                    <div class="help-item-title">Behavior Settings</div>
                    <p>Choose how customers see fully booked slots -- hide, waitlist, or show as booked.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Example Scenarios -->
            <div class="help-card scenarios-card">
              <div class="help-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                     stroke="var(--color-info-dark)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
                  <line x1="8" y1="6" x2="16" y2="6"/>
                  <line x1="8" y1="10" x2="16" y2="10"/>
                  <line x1="8" y1="14" x2="12" y2="14"/>
                </svg>
                <h3>Example Scenarios</h3>
              </div>
              <div class="scenario-cards">
                <div class="scenario-item">
                  <div class="scenario-title">Scenario 1: Small Agency</div>
                  <p class="scenario-desc">Global: 10/day, Premium: 3/day, Budget: 7/day</p>
                  <p class="scenario-note">Total package limits (10) = Global limit</p>
                </div>
                <div class="scenario-item">
                  <div class="scenario-title">Scenario 2: Staff-Based</div>
                  <p class="scenario-desc">3 staff x 5 bookings each = 15/day capacity</p>
                  <p class="scenario-note">Capacity scales with available staff</p>
                </div>
                <div class="scenario-item">
                  <div class="scenario-title">Scenario 3: Resource-Limited</div>
                  <p class="scenario-desc">2 safari vehicles = max 2 concurrent tours</p>
                  <p class="scenario-note">Hard limit based on equipment availability</p>
                </div>
              </div>
            </div>

            <!-- Best Practices -->
            <div class="help-card">
              <h3 class="help-card-title-plain">Best Practices</h3>
              <div class="help-card-items">
                <div class="help-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="var(--color-warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <div>
                    <div class="help-item-title">Start Conservative</div>
                    <p>Set lower limits initially, increase based on demand.</p>
                  </div>
                </div>
                <div class="help-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="var(--color-warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <div>
                    <div class="help-item-title">Monitor Usage</div>
                    <p>Track capacity utilization to optimize limits over time.</p>
                  </div>
                </div>
                <div class="help-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="var(--color-warning)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  <div>
                    <div class="help-item-title">Enable Waitlist</div>
                    <p>Capture overflow demand during busy periods.</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Need Help -->
            <div class="help-card">
              <h3 class="help-card-title-plain">Need Help?</h3>
              <div class="help-links">
                <a href="javascript:void(0)" class="help-link-item">
                  <div class="help-link-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                    <span>Capacity Planning Guide</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
                <a href="javascript:void(0)" class="help-link-item">
                  <div class="help-link-left">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                         stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                    </svg>
                    <span>Contact Support</span>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </svg>
                </a>
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    /* ================================================
       UNSAVED CHANGES BAR
       ================================================ */
    .unsaved-bar {
      position: sticky;
      top: 0;
      z-index: var(--z-sticky, 200);
      background-color: #fffbeb;
      border-bottom: 2px solid #fde68a;
      box-shadow: var(--shadow-md);
    }

    .unsaved-bar-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-sm) var(--spacing-lg);
    }

    .unsaved-bar-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .unsaved-bar-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      background-color: #fef3c7;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d97706;
      flex-shrink: 0;
    }

    .unsaved-bar-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .unsaved-bar-desc {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .unsaved-bar-actions {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .btn-discard {
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        background-color: var(--bg-secondary);
      }
    }

    .btn-save-gradient {
      padding: var(--spacing-sm) var(--spacing-lg);
      background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
      border: none;
      border-radius: var(--radius-lg);
      color: #ffffff;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      cursor: pointer;
      box-shadow: var(--shadow-md);
      transition: all var(--transition-fast);

      &:hover {
        box-shadow: var(--shadow-lg);
        filter: brightness(1.05);
      }
    }

    /* ================================================
       PAGE LAYOUT
       ================================================ */
    .booking-limits-page {
      animation: fadeIn var(--transition-normal) ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .page-header {
      margin-bottom: var(--spacing-xl);

      h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs) 0;
        line-height: var(--line-height-tight);
      }

      p {
        font-size: var(--font-size-base);
        color: var(--text-secondary);
        margin: 0;
        line-height: var(--line-height-normal);
      }
    }

    .two-column-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: var(--spacing-lg);
      align-items: start;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    .main-content {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    /* ================================================
       SETTINGS CARDS
       ================================================ */
    .settings-card {
      background-color: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      overflow: hidden;
    }

    .card-header-row {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-light);

      h2 {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0 0 4px 0;
      }
    }

    .card-header-section {
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-light);

      h2 {
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0 0 4px 0;
      }
    }

    .card-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .card-body {
      padding: var(--spacing-lg);
    }

    .disabled-section {
      opacity: 0.45;
      pointer-events: none;
      user-select: none;
    }

    /* ================================================
       TOGGLE SWITCH
       ================================================ */
    .toggle-switch {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      cursor: pointer;
      user-select: none;
      flex-shrink: 0;

      input {
        position: absolute;
        opacity: 0;
        width: 0;
        height: 0;
      }
    }

    .toggle-slider {
      position: relative;
      width: 40px;
      height: 22px;
      background-color: var(--border-default);
      border-radius: var(--radius-full);
      transition: all var(--transition-fast);

      &::after {
        content: '';
        position: absolute;
        top: 3px;
        left: 3px;
        width: 16px;
        height: 16px;
        background-color: #ffffff;
        border-radius: var(--radius-full);
        transition: all var(--transition-fast);
        box-shadow: var(--shadow-xs);
      }
    }

    .toggle-switch input:checked + .toggle-slider {
      background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);

      &::after {
        transform: translateX(18px);
      }
    }

    .toggle-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    /* ================================================
       FORM INPUTS
       ================================================ */
    .field-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
    }

    .required-marker {
      color: var(--color-error);
      margin-left: 2px;
    }

    .number-input {
      width: 128px;
      padding: var(--spacing-sm) var(--spacing-md);
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);

      &::placeholder {
        color: var(--text-tertiary);
      }

      &:hover:not(:disabled) {
        border-color: var(--border-dark);
      }

      &:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }

      &:disabled {
        background-color: var(--bg-tertiary);
        cursor: not-allowed;
      }

      &.small {
        width: 96px;
      }
    }

    /* Remove number input spinner for cleaner look */
    .number-input::-webkit-outer-spin-button,
    .number-input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .number-input[type=number] {
      -moz-appearance: textfield;
    }

    .limit-input-group {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .input-hint-block {
      flex: 1;
      padding-top: 28px;
    }

    .hint-example {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin-bottom: 4px;

      strong {
        color: var(--text-primary);
      }
    }

    .hint-secondary {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    /* ================================================
       USAGE BANNER
       ================================================ */
    .usage-banner {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background: linear-gradient(135deg, #f5f3ff 0%, #eef2ff 100%);
      border: 1px solid #c7d2fe;
      border-radius: var(--radius-lg);
    }

    .usage-banner-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      background-color: #ede9fe;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #7c3aed;
      flex-shrink: 0;
    }

    .usage-banner-content {
      flex: 1;
    }

    .usage-banner-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
    }

    .usage-progress-row {
      width: 100%;
    }

    .usage-progress-info {
      display: flex;
      justify-content: space-between;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin-bottom: 4px;
    }

    .usage-progress-track {
      width: 100%;
      height: 8px;
      background-color: var(--color-neutral-200);
      border-radius: var(--radius-full);
      overflow: hidden;
    }

    .usage-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #8b5cf6, #6366f1);
      border-radius: var(--radius-full);
      transition: width var(--transition-normal);
      min-width: 0;
    }

    /* ================================================
       CAPACITY RULES
       ================================================ */
    .capacity-rule-item {
      &.last-rule .rule-divider {
        display: none;
      }
    }

    .capacity-rule-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--spacing-md);
    }

    .capacity-rule-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .capacity-rule-icon {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-lg);
      background-color: var(--bg-tertiary);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .capacity-rule-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .capacity-rule-desc {
      display: block;
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    .capacity-rule-expanded {
      margin-top: var(--spacing-md);
      padding-left: 48px;
    }

    .rule-detail-row {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .rule-detail-hint {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .rule-divider {
      height: 1px;
      background-color: var(--border-light);
      margin: var(--spacing-md) 0;
    }

    /* ================================================
       RADIO CARDS (Capacity Behavior)
       ================================================ */
    .radio-options {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .radio-card {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      border: 2px solid var(--border-light);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--border-default);
      }

      input[type="radio"] {
        margin-top: 2px;
        width: 16px;
        height: 16px;
        accent-color: #ff4e78;
        flex-shrink: 0;
        cursor: pointer;
      }
    }

    .radio-card-selected {
      border-color: #ff4e78;
      background-color: #fff5f2;
    }

    .radio-card-content {
      flex: 1;
    }

    .radio-card-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .radio-card-desc {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin-bottom: var(--spacing-sm);
      line-height: var(--line-height-normal);
    }

    .radio-card-tip {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-sm);
    }

    /* ================================================
       VALIDATION BANNER
       ================================================ */
    .validation-banner {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      background-color: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: var(--radius-xl);
    }

    .validation-banner-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      background-color: #fef3c7;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #d97706;
      flex-shrink: 0;
    }

    .validation-banner-content {
      flex: 1;
    }

    .validation-banner-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
    }

    .validation-items {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .validation-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: var(--line-height-normal);

      svg {
        margin-top: 3px;
        flex-shrink: 0;
      }
    }

    /* ================================================
       HELP SIDEBAR
       ================================================ */
    .help-sidebar {
      @media (max-width: 1024px) {
        display: none;
      }
    }

    .sidebar-sticky {
      position: sticky;
      top: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .help-card {
      background-color: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-sm);
      padding: var(--spacing-lg);
    }

    .help-card-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);

      h3 {
        font-size: var(--font-size-base);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0;
      }
    }

    .help-card-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.accent {
        background: linear-gradient(135deg, rgba(255, 147, 112, 0.12) 0%, rgba(255, 78, 120, 0.12) 100%);
        color: #ff4e78;
      }
    }

    .help-card-title-plain {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-md) 0;
    }

    .help-card-items {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .help-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);

      svg {
        margin-top: 2px;
        flex-shrink: 0;
      }

      p {
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
        margin: 0;
        line-height: var(--line-height-normal);
      }
    }

    .help-item-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    /* Scenarios Card */
    .scenarios-card {
      background: linear-gradient(135deg, #eff6ff 0%, #eef2ff 100%);
      border-color: #bfdbfe;
    }

    .scenario-cards {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .scenario-item {
      padding: var(--spacing-sm);
      background-color: var(--bg-primary);
      border-radius: var(--radius-lg);
    }

    .scenario-title {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .scenario-desc {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      margin: 0 0 4px 0;
    }

    .scenario-note {
      font-size: 10px;
      color: var(--text-tertiary);
      margin: 0;
    }

    /* Help Links */
    .help-links {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .help-link-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
      text-decoration: none;
      color: var(--text-secondary);
      transition: all var(--transition-fast);

      &:hover {
        background-color: var(--bg-tertiary);
        color: var(--text-primary);
      }

      svg {
        flex-shrink: 0;
      }
    }

    .help-link-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      span {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
      }
    }
  `],
})
export class BookingLimitsComponent implements OnInit {

  /** The parent settings object passed in from the settings page. */
  settings = input<AgencySettings | null>(null);

  /** Emits when the user wants to save their changes. */
  settingsChange = output<Partial<AgencySettings>>();

  /** Local state: booking limit value. */
  bookingLimitPerDay = signal<number>(20);

  /** Local state: whether the global daily limit toggle is on. */
  globalLimitEnabled = signal<boolean>(true);

  /** Local state: the selected capacity-reached behavior. */
  capacityBehavior = signal<CapacityBehavior>('hide');

  /** Local state: capacity rules (frontend-only). */
  capacityRules = signal<CapacityRule[]>([
    {
      id: 'staff',
      label: 'Staff Capacity Limit',
      description: 'Limit bookings based on available staff members',
      enabled: false,
      icon: 'users',
    },
    {
      id: 'resource',
      label: 'Resource Capacity',
      description: 'Limit bookings based on available resources (vehicles, rooms, etc.)',
      enabled: false,
      icon: 'briefcase',
    },
    {
      id: 'timeslot',
      label: 'Time Slot Capacity',
      description: 'Limit bookings per time slot throughout the day',
      enabled: false,
      icon: 'clock',
    },
  ]);

  /** Tracks the original value for dirty-checking. */
  private originalBookingLimit = signal<number>(20);
  private originalGlobalLimitEnabled = signal<boolean>(true);
  private originalCapacityBehavior = signal<CapacityBehavior>('hide');

  /** Computed unsaved-changes flag. */
  hasUnsavedChanges = computed(() => {
    return (
      this.bookingLimitPerDay() !== this.originalBookingLimit() ||
      this.globalLimitEnabled() !== this.originalGlobalLimitEnabled() ||
      this.capacityBehavior() !== this.originalCapacityBehavior()
    );
  });

  /** Radio options for "When Capacity is Reached" section. */
  readonly capacityBehaviorOptions: {
    value: CapacityBehavior;
    label: string;
    description: string;
    tip: string;
  }[] = [
    {
      value: 'hide',
      label: 'Hide Available Times',
      description:
        'Fully booked time slots will not appear in the booking calendar.',
      tip: 'Best for: Preventing customer confusion and maintaining clean booking experience',
    },
    {
      value: 'waitlist',
      label: 'Allow Waitlist',
      description:
        'Customers can join a waitlist when capacity is reached.',
      tip: 'Best for: Capturing demand and filling cancellations automatically',
    },
    {
      value: 'show-booked',
      label: 'Show as "Fully Booked"',
      description:
        'Display time slots with a "Fully Booked" label but prevent booking.',
      tip: 'Best for: Showing availability transparency to build trust',
    },
  ];

  /** Sync incoming settings to local state when they change. */
  private settingsEffect = effect(() => {
    const s = this.settings();
    if (s) {
      const limit = s.bookingLimitPerDay ?? 20;
      const enabled = limit > 0;

      this.bookingLimitPerDay.set(limit);
      this.globalLimitEnabled.set(enabled);

      this.originalBookingLimit.set(limit);
      this.originalGlobalLimitEnabled.set(enabled);
      this.originalCapacityBehavior.set(this.capacityBehavior());
    }
  });

  ngOnInit(): void {
    // Initial sync handled by the effect above.
  }

  /** Called when the user changes the booking limit input value. */
  onBookingLimitChange(value: number): void {
    const clamped = Math.max(0, Math.min(9999, value ?? 0));
    this.bookingLimitPerDay.set(clamped);
  }

  /** Toggle the global limit on/off. */
  toggleGlobalLimit(): void {
    this.globalLimitEnabled.update((v) => !v);
  }

  /** Toggle a specific capacity rule. */
  toggleCapacityRule(ruleId: string): void {
    this.capacityRules.update((rules) =>
      rules.map((r) =>
        r.id === ruleId ? { ...r, enabled: !r.enabled } : r
      )
    );
  }

  /** Select a capacity-reached behavior. */
  onCapacityBehaviorChange(value: CapacityBehavior): void {
    this.capacityBehavior.set(value);
  }

  /** Emit the current local state up to the parent. */
  emitChanges(): void {
    const effectiveLimit = this.globalLimitEnabled()
      ? this.bookingLimitPerDay()
      : 0;

    this.settingsChange.emit({
      bookingLimitPerDay: effectiveLimit,
    });

    // Update originals so the unsaved-changes bar disappears.
    this.originalBookingLimit.set(this.bookingLimitPerDay());
    this.originalGlobalLimitEnabled.set(this.globalLimitEnabled());
    this.originalCapacityBehavior.set(this.capacityBehavior());
  }

  /** Revert local state to match original values. */
  discardChanges(): void {
    this.bookingLimitPerDay.set(this.originalBookingLimit());
    this.globalLimitEnabled.set(this.originalGlobalLimitEnabled());
    this.capacityBehavior.set(this.originalCapacityBehavior());
  }
}
