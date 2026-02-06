import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgencySettings } from '@workspace/core';

/** Internal structure persisted as JSON in AgencySettings.cancellationPolicy */
interface CancellationPolicyConfig {
  selectedTemplate: 'flexible' | 'moderate' | 'strict' | 'custom';
  policyName: string;
  rules: CutoffRule[];
  fees: CancellationFees;
  noShow: NoShowPolicy;
  description: string;
  visibility: PolicyVisibility;
  applyTo: 'new-only' | 'all-future';
}

interface CutoffRule {
  id: string;
  label: string;
  timeAmount: number;
  timeUnit: 'hours' | 'days' | 'weeks';
  refundPercent: number;
}

interface CancellationFees {
  fixedFeeEnabled: boolean;
  fixedFeeAmount: number;
  percentageFeeEnabled: boolean;
  percentageFeeAmount: number;
}

interface NoShowPolicy {
  chargePercent: number;
  gracePeriodMinutes: number;
}

interface PolicyVisibility {
  bookingConfirmation: boolean;
  confirmationEmail: boolean;
  packageDetails: boolean;
  bookingDashboard: boolean;
}

interface PolicyTemplate {
  key: 'flexible' | 'moderate' | 'strict';
  name: string;
  subtitle: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  iconBg: string;
  iconColor: string;
  icon: string;
  bulletColor: string;
  bullets: string[];
  defaultConfig: Partial<CancellationPolicyConfig>;
}

const TEMPLATES: PolicyTemplate[] = [
  {
    key: 'flexible',
    name: 'Flexible',
    subtitle: 'Guest-friendly',
    accentColor: '#4caf50',
    accentBg: '#e8f5e9',
    accentBorder: '#a5d6a7',
    iconBg: '#e8f5e9',
    iconColor: '#2e7d32',
    icon: 'M5 13l4 4L19 7',
    bulletColor: '#4caf50',
    bullets: [
      'Free cancellation up to 24h',
      '50% refund within 48h',
      'No-show: 50% charge',
    ],
    defaultConfig: {
      policyName: 'Flexible Cancellation Policy',
      rules: [
        { id: 'free', label: 'Free Cancellation Window', timeAmount: 24, timeUnit: 'hours', refundPercent: 100 },
        { id: 'partial', label: 'Partial Refund Window', timeAmount: 48, timeUnit: 'hours', refundPercent: 50 },
      ],
      fees: { fixedFeeEnabled: true, fixedFeeAmount: 25, percentageFeeEnabled: false, percentageFeeAmount: 10 },
      noShow: { chargePercent: 50, gracePeriodMinutes: 15 },
      description: `Our flexible cancellation policy is designed with your convenience in mind:\n\n- Free cancellation up to 24 hours before your booking\n- 50% refund for cancellations within 48 hours\n- $25 processing fee applies to all cancellations\n- No-shows will be charged 50% of the booking amount\n- 15-minute grace period for late arrivals\n\nWe want you to book with confidence!`,
    },
  },
  {
    key: 'moderate',
    name: 'Moderate',
    subtitle: 'Balanced',
    accentColor: '#ff9800',
    accentBg: '#fff3e0',
    accentBorder: '#ffcc80',
    iconBg: '#fff3e0',
    iconColor: '#ef6c00',
    icon: 'M3 6l3 3-3 3M12 6h6M12 12h6M12 18h6',
    bulletColor: '#ff9800',
    bullets: [
      'Free cancellation up to 48h',
      '50% refund within 7 days',
      'No-show: 100% charge',
    ],
    defaultConfig: {
      policyName: 'Moderate Cancellation Policy',
      rules: [
        { id: 'free', label: 'Free Cancellation Window', timeAmount: 48, timeUnit: 'hours', refundPercent: 100 },
        { id: 'partial', label: 'Partial Refund Window', timeAmount: 7, timeUnit: 'days', refundPercent: 50 },
      ],
      fees: { fixedFeeEnabled: true, fixedFeeAmount: 25, percentageFeeEnabled: false, percentageFeeAmount: 10 },
      noShow: { chargePercent: 100, gracePeriodMinutes: 15 },
      description: `Our moderate cancellation policy provides flexibility while protecting our operations:\n\n- Free cancellation up to 48 hours before your booking\n- 50% refund for cancellations within 7 days\n- $25 processing fee applies to all cancellations\n- No-shows will be charged 100% of the booking amount\n- 15-minute grace period for late arrivals\n\nWe understand plans change. Please cancel as early as possible to receive the maximum refund.`,
    },
  },
  {
    key: 'strict',
    name: 'Strict',
    subtitle: 'Protected',
    accentColor: '#f44336',
    accentBg: '#ffebee',
    accentBorder: '#ef9a9a',
    iconBg: '#ffebee',
    iconColor: '#c62828',
    icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
    bulletColor: '#f44336',
    bullets: [
      'Free cancellation up to 7 days',
      'No refund after cutoff',
      'No-show: 100% charge',
    ],
    defaultConfig: {
      policyName: 'Strict Cancellation Policy',
      rules: [
        { id: 'free', label: 'Free Cancellation Window', timeAmount: 7, timeUnit: 'days', refundPercent: 100 },
      ],
      fees: { fixedFeeEnabled: true, fixedFeeAmount: 25, percentageFeeEnabled: false, percentageFeeAmount: 10 },
      noShow: { chargePercent: 100, gracePeriodMinutes: 15 },
      description: `Our strict cancellation policy protects our operational commitments:\n\n- Free cancellation up to 7 days before your booking\n- No refunds for cancellations after the cutoff period\n- $25 processing fee applies to all cancellations\n- No-shows will be charged 100% of the booking amount\n- 15-minute grace period for late arrivals\n\nPlease review booking details carefully before confirming.`,
    },
  },
];

function createDefaultConfig(): CancellationPolicyConfig {
  return {
    selectedTemplate: 'moderate',
    policyName: 'Moderate Cancellation Policy',
    rules: [
      { id: 'free', label: 'Free Cancellation Window', timeAmount: 48, timeUnit: 'hours', refundPercent: 100 },
      { id: 'partial', label: 'Partial Refund Window', timeAmount: 7, timeUnit: 'days', refundPercent: 50 },
    ],
    fees: { fixedFeeEnabled: true, fixedFeeAmount: 25, percentageFeeEnabled: false, percentageFeeAmount: 10 },
    noShow: { chargePercent: 100, gracePeriodMinutes: 15 },
    description: `Our moderate cancellation policy provides flexibility while protecting our operations:\n\n- Free cancellation up to 48 hours before your booking\n- 50% refund for cancellations within 7 days\n- $25 processing fee applies to all cancellations\n- No-shows will be charged 100% of the booking amount\n- 15-minute grace period for late arrivals\n\nWe understand plans change. Please cancel as early as possible to receive the maximum refund.`,
    visibility: {
      bookingConfirmation: true,
      confirmationEmail: true,
      packageDetails: true,
      bookingDashboard: false,
    },
    applyTo: 'new-only',
  };
}

@Component({
  selector: 'app-cancellation-policy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cancellation-policy">
      <div class="policy-layout">
        <!-- Main Content -->
        <div class="policy-main">

          <!-- Policy Templates -->
          <section class="policy-section">
            <div class="section-header">
              <div>
                <h2 class="section-title">Policy Templates</h2>
                <p class="section-subtitle">Choose a pre-configured template or create your own custom policy</p>
              </div>
            </div>

            <div class="section-body">
              <div class="template-grid">
                @for (tpl of templates; track tpl.key) {
                  <div
                    class="template-card"
                    [class.template-card--selected]="config.selectedTemplate === tpl.key"
                    [style.--tpl-accent]="tpl.accentColor"
                    [style.--tpl-bg]="tpl.accentBg"
                    [style.--tpl-border]="tpl.accentBorder"
                    (click)="selectTemplate(tpl.key)"
                  >
                    <div class="template-header">
                      <div class="template-info">
                        <div class="template-icon" [style.background-color]="tpl.iconBg">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                               fill="none" [attr.stroke]="tpl.iconColor" stroke-width="2"
                               stroke-linecap="round" stroke-linejoin="round">
                            <path [attr.d]="tpl.icon"/>
                          </svg>
                        </div>
                        <div>
                          <div class="template-name">
                            <span>{{ tpl.name }}</span>
                            @if (config.selectedTemplate === tpl.key) {
                              <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" width="10" height="10"
                                   viewBox="0 0 24 24" fill="#ff4e78" stroke="#ff4e78" stroke-width="2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                              </svg>
                            }
                          </div>
                          <div class="template-subtitle">{{ tpl.subtitle }}</div>
                        </div>
                      </div>
                      <div class="template-radio">
                        <input
                          type="radio"
                          [name]="'template-' + instanceId"
                          [value]="tpl.key"
                          [checked]="config.selectedTemplate === tpl.key"
                          (change)="selectTemplate(tpl.key)"
                        />
                      </div>
                    </div>

                    <div class="template-bullets">
                      @for (bullet of tpl.bullets; track bullet) {
                        <div class="template-bullet">
                          <span class="bullet-dot" [style.background-color]="tpl.bulletColor"></span>
                          <span>{{ bullet }}</span>
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <button class="create-custom-btn" (click)="createCustomPolicy()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>Create Custom Policy</span>
              </button>
            </div>
          </section>

          <!-- Custom Policy Editor -->
          <section class="policy-section">
            <div class="section-header">
              <div>
                <h2 class="section-title">Custom Policy Editor</h2>
                <p class="section-subtitle">Configure detailed cancellation rules with structured fields</p>
              </div>
            </div>

            <div class="section-body editor-body">

              <!-- Policy Name -->
              <div class="field-group">
                <label class="field-label">
                  Policy Name
                  <span class="field-required">*</span>
                </label>
                <input
                  type="text"
                  class="field-input"
                  placeholder="e.g., Summer Season Policy"
                  [(ngModel)]="config.policyName"
                  (ngModelChange)="emitChange()"
                />
                <div class="field-hint">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                       fill="none" stroke="var(--color-info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                  </svg>
                  <span>This name is for internal reference only</span>
                </div>
              </div>

              <div class="divider"></div>

              <!-- Cancellation Cutoff Time Rules -->
              <div class="field-group">
                <div class="field-label-row">
                  <label class="field-label">Cancellation Cutoff Time</label>
                  <button class="add-rule-btn" (click)="addRule()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                         fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    <span>Add Rule</span>
                  </button>
                </div>

                <div class="rules-list">
                  @for (rule of config.rules; track rule.id; let i = $index) {
                    <div class="rule-card" [class.rule-card--free]="rule.refundPercent === 100" [class.rule-card--partial]="rule.refundPercent < 100">
                      <div class="rule-header">
                        <div class="rule-title-row">
                          <div class="rule-icon" [class.rule-icon--free]="rule.refundPercent === 100" [class.rule-icon--partial]="rule.refundPercent < 100">
                            @if (rule.refundPercent === 100) {
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            } @else {
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                   fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                              </svg>
                            }
                          </div>
                          <span class="rule-label">{{ rule.label }}</span>
                        </div>
                        <button class="rule-delete-btn" (click)="removeRule(i)" title="Remove rule">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                               fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                          </svg>
                        </button>
                      </div>

                      <div class="rule-fields">
                        <div class="rule-field">
                          <label class="rule-field-label">Time Before</label>
                          <input
                            type="number"
                            class="field-input field-input--sm"
                            [ngModel]="rule.timeAmount"
                            (ngModelChange)="rule.timeAmount = $event; emitChange()"
                            min="0"
                          />
                        </div>
                        <div class="rule-field">
                          <label class="rule-field-label">Unit</label>
                          <select
                            class="field-select field-select--sm"
                            [ngModel]="rule.timeUnit"
                            (ngModelChange)="rule.timeUnit = $event; emitChange()"
                          >
                            <option value="hours">Hours</option>
                            <option value="days">Days</option>
                            <option value="weeks">Weeks</option>
                          </select>
                        </div>
                        <div class="rule-field">
                          <label class="rule-field-label">Refund Amount</label>
                          <div class="field-input-suffix">
                            <input
                              type="number"
                              class="field-input field-input--sm"
                              [ngModel]="rule.refundPercent"
                              (ngModelChange)="rule.refundPercent = $event; emitChange()"
                              min="0"
                              max="100"
                            />
                            <span class="suffix-label">%</span>
                          </div>
                        </div>
                      </div>

                      <div class="rule-example">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                             fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M9 18h6M10 22h4M12 2a7 7 0 00-3.6 13 3 3 0 00.6 1.7V18h6v-1.3A3 3 0 0015.6 15 7 7 0 0012 2z"/>
                        </svg>
                        <span>
                          <strong>Example:</strong> Cancel within {{ rule.timeAmount }} {{ rule.timeUnit }} before booking:
                          <span [class.refund-highlight--green]="rule.refundPercent === 100"
                                [class.refund-highlight--orange]="rule.refundPercent > 0 && rule.refundPercent < 100"
                                [class.refund-highlight--red]="rule.refundPercent === 0">
                            {{ rule.refundPercent }}% refund
                          </span>
                        </span>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <div class="divider"></div>

              <!-- Cancellation Fees -->
              <div class="field-group">
                <label class="field-label">Cancellation Fees</label>

                <div class="fee-list">
                  <div class="fee-item">
                    <div class="fee-info">
                      <div class="fee-name">Fixed Processing Fee</div>
                      <div class="fee-description">Charge a flat fee for all cancellations</div>
                    </div>
                    <div class="fee-controls">
                      <div class="field-input-prefix">
                        <span class="prefix-label">$</span>
                        <input
                          type="number"
                          class="field-input field-input--sm field-input--narrow"
                          [ngModel]="config.fees.fixedFeeAmount"
                          (ngModelChange)="config.fees.fixedFeeAmount = $event; emitChange()"
                          min="0"
                        />
                      </div>
                      <input
                        type="checkbox"
                        class="fee-checkbox"
                        [ngModel]="config.fees.fixedFeeEnabled"
                        (ngModelChange)="config.fees.fixedFeeEnabled = $event; emitChange()"
                      />
                    </div>
                  </div>

                  <div class="fee-item">
                    <div class="fee-info">
                      <div class="fee-name">Percentage-Based Fee</div>
                      <div class="fee-description">Charge a percentage of booking total</div>
                    </div>
                    <div class="fee-controls">
                      <div class="field-input-suffix">
                        <input
                          type="number"
                          class="field-input field-input--sm field-input--narrow"
                          [ngModel]="config.fees.percentageFeeAmount"
                          (ngModelChange)="config.fees.percentageFeeAmount = $event; emitChange()"
                          min="0"
                          max="100"
                        />
                        <span class="suffix-label">%</span>
                      </div>
                      <input
                        type="checkbox"
                        class="fee-checkbox"
                        [ngModel]="config.fees.percentageFeeEnabled"
                        (ngModelChange)="config.fees.percentageFeeEnabled = $event; emitChange()"
                      />
                    </div>
                  </div>
                </div>

                <div class="info-callout info-callout--blue">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                       fill="none" stroke="var(--color-info)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                  </svg>
                  <span>
                    Fees are deducted from refund amount. <strong>Example:</strong> $500 booking, 50% refund = $250 - \${{ config.fees.fixedFeeAmount }} fee =
                    <strong class="text-info"> \${{ 250 - config.fees.fixedFeeAmount }} final refund</strong>
                  </span>
                </div>
              </div>

              <div class="divider"></div>

              <!-- No-Show Policy -->
              <div class="field-group">
                <label class="field-label">No-Show Policy</label>

                <div class="noshow-card">
                  <div class="noshow-header">
                    <div class="noshow-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                           fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4V3"/><path d="M20 8l-5 5 5 5"/>
                      </svg>
                    </div>
                    <div>
                      <div class="noshow-title">Customer Doesn't Show Up</div>
                      <div class="noshow-subtitle">What happens when a customer fails to arrive for their booking</div>
                    </div>
                  </div>

                  <div class="noshow-fields">
                    <div class="noshow-field">
                      <label class="rule-field-label">Charge Amount</label>
                      <div class="field-input-suffix">
                        <input
                          type="number"
                          class="field-input field-input--sm"
                          [ngModel]="config.noShow.chargePercent"
                          (ngModelChange)="config.noShow.chargePercent = $event; emitChange()"
                          min="0"
                          max="100"
                        />
                        <span class="suffix-label">%</span>
                      </div>
                    </div>
                    <div class="noshow-field">
                      <label class="rule-field-label">Grace Period</label>
                      <select
                        class="field-select field-select--sm"
                        [ngModel]="config.noShow.gracePeriodMinutes"
                        (ngModelChange)="config.noShow.gracePeriodMinutes = $event; emitChange()"
                      >
                        <option [ngValue]="0">No grace period</option>
                        <option [ngValue]="15">15 minutes</option>
                        <option [ngValue]="30">30 minutes</option>
                        <option [ngValue]="60">1 hour</option>
                      </select>
                    </div>
                  </div>

                  <div class="rule-example">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                         fill="#f59e0b" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 18h6M10 22h4M12 2a7 7 0 00-3.6 13 3 3 0 00.6 1.7V18h6v-1.3A3 3 0 0015.6 15 7 7 0 0012 2z"/>
                    </svg>
                    <span>
                      <strong>Example:</strong>
                      No-shows after {{ config.noShow.gracePeriodMinutes > 0 ? config.noShow.gracePeriodMinutes + '-minute grace period' : 'scheduled time' }}:
                      <span class="refund-highlight--red">{{ config.noShow.chargePercent }}% charge</span>
                    </span>
                  </div>
                </div>
              </div>

              <div class="divider"></div>

              <!-- Policy Description -->
              <div class="field-group">
                <label class="field-label">Policy Description (Customer-Facing)</label>
                <textarea
                  class="field-textarea"
                  rows="6"
                  placeholder="Write a clear description that customers will see..."
                  [(ngModel)]="config.description"
                  (ngModelChange)="emitChange()"
                ></textarea>
                <div class="field-hint">
                  <span>Markdown formatting supported</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Where Policy Appears -->
          <section class="policy-section">
            <div class="section-header">
              <div>
                <h2 class="section-title">Where Policy Appears</h2>
                <p class="section-subtitle">Control how and where customers see this cancellation policy</p>
              </div>
            </div>

            <div class="section-body visibility-body">
              @for (item of visibilityOptions; track item.key) {
                <label class="visibility-item">
                  <input
                    type="checkbox"
                    class="visibility-checkbox"
                    [ngModel]="config.visibility[item.key]"
                    (ngModelChange)="setVisibility(item.key, $event)"
                  />
                  <div class="visibility-info">
                    <div class="visibility-name">{{ item.label }}</div>
                    <div class="visibility-description">{{ item.description }}</div>
                  </div>
                </label>
              }
            </div>
          </section>

          <!-- Apply to Existing Bookings -->
          <section class="apply-section">
            <div class="apply-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                   fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="apply-content">
              <div class="apply-title">Apply to Existing Bookings</div>
              <p class="apply-subtitle">Choose how this policy affects bookings that were made before this change</p>

              <div class="apply-options">
                <label class="apply-option">
                  <input
                    type="radio"
                    [name]="'apply-' + instanceId"
                    value="new-only"
                    [checked]="config.applyTo === 'new-only'"
                    (change)="config.applyTo = 'new-only'; emitChange()"
                  />
                  <div class="apply-option-info">
                    <div class="apply-option-name">New Bookings Only</div>
                    <div class="apply-option-desc">Only apply to bookings made after saving this policy</div>
                  </div>
                </label>
                <label class="apply-option">
                  <input
                    type="radio"
                    [name]="'apply-' + instanceId"
                    value="all-future"
                    [checked]="config.applyTo === 'all-future'"
                    (change)="config.applyTo = 'all-future'; emitChange()"
                  />
                  <div class="apply-option-info">
                    <div class="apply-option-name">All Future Bookings</div>
                    <div class="apply-option-desc">Apply to all existing bookings with future dates (notify customers)</div>
                  </div>
                </label>
              </div>

              <div class="apply-notice">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                     fill="none" stroke="#7c3aed" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
                <span>Changing policies for existing bookings will trigger notification emails to affected customers</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Sidebar -->
        <aside class="policy-sidebar">
          <div class="sidebar-sticky">

            <!-- Policy Guidelines -->
            <div class="sidebar-card">
              <div class="sidebar-card-header">
                <div class="sidebar-card-icon sidebar-card-icon--accent">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                       fill="none" stroke="#ff4e78" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                </div>
                <h3 class="sidebar-card-title">Policy Guidelines</h3>
              </div>
              <div class="guidelines-list">
                @for (guideline of guidelines; track guideline.title) {
                  <div class="guideline-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                         fill="none" stroke="var(--color-success)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <div>
                      <div class="guideline-title">{{ guideline.title }}</div>
                      <p class="guideline-desc">{{ guideline.description }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Example Calculations -->
            <div class="sidebar-card">
              <h3 class="sidebar-card-title" style="margin-bottom: var(--spacing-md)">Example Calculations</h3>
              <div class="examples-list">
                @for (example of exampleCalculations; track example.label) {
                  <div class="example-item" [class]="'example-item--' + example.variant">
                    <div class="example-label">{{ example.label }}</div>
                    <p class="example-desc">{{ example.situation }}</p>
                    <div class="example-breakdown">
                      @for (line of example.lines; track line) {
                        <div>{{ line }}</div>
                      }
                      <div class="example-result" [class]="'example-result--' + example.variant">{{ example.result }}</div>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Important Notes -->
            <div class="sidebar-card sidebar-card--warning">
              <div class="sidebar-card-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                     fill="none" stroke="#d97706" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <h3 class="sidebar-card-title">Important Notes</h3>
              </div>
              <div class="notes-list">
                @for (note of importantNotes; track note) {
                  <div class="note-item">
                    <span class="note-dot"></span>
                    <span>{{ note }}</span>
                  </div>
                }
              </div>
            </div>

          </div>
        </aside>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .cancellation-policy {
      width: 100%;
    }

    /* ==========================================
       LAYOUT
       ========================================== */

    .policy-layout {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: var(--spacing-lg);
      align-items: start;
    }

    @media (max-width: 1100px) {
      .policy-layout {
        grid-template-columns: 1fr;
      }
    }

    .policy-main {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
      min-width: 0;
    }

    .policy-sidebar {
      min-width: 0;
    }

    .sidebar-sticky {
      position: sticky;
      top: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    /* ==========================================
       SECTIONS (Cards)
       ========================================== */

    .policy-section {
      background-color: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xs);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-light);
    }

    .section-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-xs) 0;
      line-height: var(--line-height-tight);
    }

    .section-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
    }

    .section-body {
      padding: var(--spacing-lg);
    }

    .editor-body {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .visibility-body {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    /* ==========================================
       TEMPLATE CARDS
       ========================================== */

    .template-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    @media (max-width: 768px) {
      .template-grid {
        grid-template-columns: 1fr;
      }
    }

    .template-card {
      border: 2px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: var(--spacing-md) var(--spacing-md) var(--spacing-md);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--tpl-accent, var(--border-dark));
      }

      &--selected {
        border-color: var(--tpl-accent, var(--color-primary-500));
        background: linear-gradient(135deg, var(--tpl-bg, var(--bg-secondary)) 0%, #fff8f5 100%);
      }
    }

    .template-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--spacing-sm);
    }

    .template-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .template-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .template-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .star-icon {
      flex-shrink: 0;
    }

    .template-subtitle {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    .template-radio {
      flex-shrink: 0;

      input[type="radio"] {
        width: 16px;
        height: 16px;
        accent-color: #ff4e78;
        cursor: pointer;
      }
    }

    .template-bullets {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .template-bullet {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .bullet-dot {
      width: 5px;
      height: 5px;
      border-radius: var(--radius-full);
      flex-shrink: 0;
      margin-top: 5px;
    }

    .create-custom-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border: 2px dashed var(--border-default);
      border-radius: var(--radius-xl);
      background: transparent;
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      font-family: var(--font-family-base);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: #ff4e78;
        color: #ff4e78;
      }
    }

    /* ==========================================
       FORM FIELDS
       ========================================== */

    .field-group {
      display: flex;
      flex-direction: column;
    }

    .field-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
    }

    .field-required {
      color: var(--color-error);
      margin-left: 2px;
    }

    .field-label-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--spacing-md);
    }

    .field-label-row .field-label {
      margin-bottom: 0;
    }

    .field-input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      box-sizing: border-box;

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

      &--sm {
        padding: var(--spacing-xs) var(--spacing-sm);
      }

      &--narrow {
        width: 96px;
      }
    }

    .field-select {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      box-sizing: border-box;

      &:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }

      &--sm {
        padding: var(--spacing-xs) var(--spacing-sm);
      }
    }

    .field-textarea {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      resize: vertical;
      min-height: 120px;
      line-height: var(--line-height-normal);
      transition: all var(--transition-fast);
      box-sizing: border-box;

      &::placeholder {
        color: var(--text-tertiary);
      }

      &:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }
    }

    .field-input-suffix {
      position: relative;
      display: inline-flex;
      align-items: center;

      .field-input {
        padding-right: 28px;
      }

      .suffix-label {
        position: absolute;
        right: var(--spacing-sm);
        font-size: var(--font-size-xs);
        color: var(--text-tertiary);
        pointer-events: none;
      }
    }

    .field-input-prefix {
      position: relative;
      display: inline-flex;
      align-items: center;

      .field-input {
        padding-left: 24px;
      }

      .prefix-label {
        position: absolute;
        left: var(--spacing-sm);
        font-size: var(--font-size-sm);
        color: var(--text-tertiary);
        pointer-events: none;
      }
    }

    .field-hint {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: var(--spacing-xs);
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    .divider {
      height: 1px;
      background-color: var(--border-light);
    }

    .add-rule-btn {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: none;
      border: none;
      color: #ff4e78;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      font-family: var(--font-family-base);
      cursor: pointer;
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);

      &:hover {
        background-color: #fff5f2;
      }
    }

    /* ==========================================
       CUTOFF RULES
       ========================================== */

    .rules-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .rule-card {
      padding: var(--spacing-md);
      border-radius: var(--radius-xl);
      border: 1px solid var(--border-light);
      background-color: var(--bg-secondary);

      &--free {
        background: linear-gradient(to right, #e8f5e9, #e0f2f1);
        border-color: #a5d6a7;
      }

      &--partial {
        background: linear-gradient(to right, #fff3e0, #fff8e1);
        border-color: #ffcc80;
      }
    }

    .rule-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: var(--spacing-sm);
    }

    .rule-title-row {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .rule-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &--free {
        background-color: #c8e6c9;
        color: #2e7d32;
      }

      &--partial {
        background-color: #ffe0b2;
        color: #ef6c00;
      }
    }

    .rule-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .rule-delete-btn {
      background: none;
      border: none;
      color: var(--text-tertiary);
      cursor: pointer;
      padding: var(--spacing-xs);
      border-radius: var(--radius-sm);
      transition: all var(--transition-fast);
      display: flex;
      align-items: center;

      &:hover {
        color: var(--color-error);
        background-color: var(--color-error-light);
      }
    }

    .rule-fields {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: var(--spacing-sm);
    }

    @media (max-width: 600px) {
      .rule-fields {
        grid-template-columns: 1fr;
      }
    }

    .rule-field {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .rule-field-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    .rule-example {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-sm);
      padding-top: var(--spacing-sm);
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);

      svg {
        flex-shrink: 0;
        margin-top: 1px;
      }
    }

    .refund-highlight--green {
      font-weight: var(--font-weight-semibold);
      color: #2e7d32;
    }

    .refund-highlight--orange {
      font-weight: var(--font-weight-semibold);
      color: #ef6c00;
    }

    .refund-highlight--red {
      font-weight: var(--font-weight-semibold);
      color: #c62828;
    }

    /* ==========================================
       FEES
       ========================================== */

    .fee-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-sm);
    }

    .fee-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-lg);
    }

    @media (max-width: 600px) {
      .fee-item {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-sm);
      }
    }

    .fee-info {
      flex: 1;
    }

    .fee-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .fee-description {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .fee-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .fee-checkbox {
      width: 16px;
      height: 16px;
      accent-color: #ff4e78;
      cursor: pointer;
    }

    .info-callout {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);

      svg {
        flex-shrink: 0;
        margin-top: 1px;
      }

      &--blue {
        background-color: var(--color-info-light);
        border: 1px solid #90caf9;
      }
    }

    .text-info {
      color: var(--color-info-dark);
    }

    /* ==========================================
       NO-SHOW
       ========================================== */

    .noshow-card {
      padding: var(--spacing-md);
      background: linear-gradient(to right, #ffebee, #fce4ec);
      border: 1px solid #ef9a9a;
      border-radius: var(--radius-xl);
    }

    .noshow-header {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }

    .noshow-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      background-color: #ffcdd2;
      color: #c62828;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .noshow-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .noshow-subtitle {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .noshow-fields {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }

    @media (max-width: 600px) {
      .noshow-fields {
        grid-template-columns: 1fr;
      }
    }

    .noshow-field {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    /* ==========================================
       VISIBILITY CHECKBOXES
       ========================================== */

    .visibility-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-xl);
      cursor: pointer;
      transition: background-color var(--transition-fast);

      &:hover {
        background-color: var(--bg-tertiary);
      }
    }

    .visibility-checkbox {
      width: 16px;
      height: 16px;
      accent-color: #ff4e78;
      cursor: pointer;
      margin-top: 2px;
      flex-shrink: 0;
    }

    .visibility-info {
      flex: 1;
    }

    .visibility-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .visibility-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    /* ==========================================
       APPLY TO EXISTING
       ========================================== */

    .apply-section {
      display: flex;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      background: linear-gradient(135deg, #ede9fe, #e0e7ff);
      border: 1px solid #c4b5fd;
      border-radius: var(--radius-xl);
    }

    .apply-icon-wrapper {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      background-color: #ddd6fe;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .apply-content {
      flex: 1;
    }

    .apply-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .apply-subtitle {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-md) 0;
    }

    .apply-options {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .apply-option {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background-color: var(--bg-primary);
      border: 1px solid #c4b5fd;
      border-radius: var(--radius-lg);
      cursor: pointer;
      transition: background-color var(--transition-fast);

      &:hover {
        background-color: var(--bg-secondary);
      }

      input[type="radio"] {
        margin-top: 2px;
        accent-color: #ff4e78;
        cursor: pointer;
      }
    }

    .apply-option-info {
      flex: 1;
    }

    .apply-option-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .apply-option-desc {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .apply-notice {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-sm);
      padding-top: var(--spacing-sm);
      border-top: 1px solid #c4b5fd;
      font-size: var(--font-size-xs);
      color: var(--text-secondary);

      svg {
        flex-shrink: 0;
        margin-top: 1px;
      }
    }

    /* ==========================================
       SIDEBAR CARDS
       ========================================== */

    .sidebar-card {
      background-color: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xs);
      padding: var(--spacing-md);

      &--warning {
        background-color: #fffbeb;
        border-color: #fcd34d;
      }
    }

    .sidebar-card-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-md);
    }

    .sidebar-card-icon {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;

      &--accent {
        background: linear-gradient(135deg, rgba(255, 147, 112, 0.1) 0%, rgba(255, 78, 120, 0.1) 100%);
      }
    }

    .sidebar-card-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    /* Guidelines */
    .guidelines-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .guideline-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      font-size: var(--font-size-xs);

      svg {
        flex-shrink: 0;
        margin-top: 2px;
      }
    }

    .guideline-title {
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .guideline-desc {
      color: var(--text-secondary);
      margin: 0;
    }

    /* Examples */
    .examples-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .example-item {
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-lg);
      font-size: var(--font-size-xs);

      &--green {
        background-color: #e8f5e9;
        border: 1px solid #a5d6a7;
      }

      &--orange {
        background-color: #fff3e0;
        border: 1px solid #ffcc80;
      }

      &--red {
        background-color: #ffebee;
        border: 1px solid #ef9a9a;
      }
    }

    .example-label {
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .example-desc {
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-xs) 0;
    }

    .example-breakdown {
      color: var(--text-secondary);

      div {
        line-height: var(--line-height-relaxed);
      }
    }

    .example-result {
      font-weight: var(--font-weight-semibold);
      margin-top: var(--spacing-xs);

      &--green {
        color: #2e7d32;
      }

      &--orange {
        color: #ef6c00;
      }

      &--red {
        color: #c62828;
      }
    }

    /* Notes */
    .notes-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .note-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .note-dot {
      width: 5px;
      height: 5px;
      border-radius: var(--radius-full);
      background-color: #f59e0b;
      flex-shrink: 0;
      margin-top: 5px;
    }
  `],
})
export class CancellationPolicyComponent implements OnInit, OnChanges {
  @Input() settings: AgencySettings | null = null;
  @Output() settingsChange = new EventEmitter<AgencySettings>();

  readonly instanceId = Math.random().toString(36).substring(2, 9);
  readonly templates = TEMPLATES;

  config: CancellationPolicyConfig = createDefaultConfig();

  readonly visibilityOptions: { key: keyof PolicyVisibility; label: string; description: string }[] = [
    { key: 'bookingConfirmation', label: 'Booking Confirmation Page', description: 'Display policy during checkout before payment' },
    { key: 'confirmationEmail', label: 'Confirmation Email', description: 'Include policy in booking confirmation emails' },
    { key: 'packageDetails', label: 'Package Details Page', description: 'Show policy on individual package listings' },
    { key: 'bookingDashboard', label: 'Booking Dashboard', description: 'Display in customer\'s booking management area' },
  ];

  readonly guidelines = [
    { title: 'Clear Communication', description: 'Use simple language that customers can easily understand' },
    { title: 'Balance Protection', description: 'Protect your business while remaining fair to customers' },
    { title: 'Legal Compliance', description: 'Ensure policy complies with local consumer protection laws' },
  ];

  readonly exampleCalculations = [
    {
      label: 'Scenario 1',
      variant: 'green',
      situation: '$500 booking, cancel 3 days before',
      lines: ['100% refund: $500', 'Less $25 fee'],
      result: 'Final refund: $475',
    },
    {
      label: 'Scenario 2',
      variant: 'orange',
      situation: '$500 booking, cancel 5 days before',
      lines: ['50% refund: $250', 'Less $25 fee'],
      result: 'Final refund: $225',
    },
    {
      label: 'Scenario 3',
      variant: 'red',
      situation: '$500 booking, no-show',
      lines: ['100% charge: $500'],
      result: 'No refund',
    },
  ];

  readonly importantNotes = [
    'Refunds are processed within 5-7 business days',
    'Processing fees are non-refundable',
    'Grace periods apply to late arrivals',
    'Policy changes notify affected customers',
  ];

  ngOnInit(): void {
    this.parseSettingsToConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['settings'] && !changes['settings'].firstChange) {
      this.parseSettingsToConfig();
    }
  }

  selectTemplate(key: 'flexible' | 'moderate' | 'strict'): void {
    const tpl = TEMPLATES.find(t => t.key === key);
    if (!tpl) return;

    this.config.selectedTemplate = key;

    const defaults = tpl.defaultConfig;
    if (defaults.policyName) this.config.policyName = defaults.policyName;
    if (defaults.rules) this.config.rules = structuredClone(defaults.rules);
    if (defaults.fees) this.config.fees = { ...defaults.fees };
    if (defaults.noShow) this.config.noShow = { ...defaults.noShow };
    if (defaults.description) this.config.description = defaults.description;

    this.emitChange();
  }

  createCustomPolicy(): void {
    this.config.selectedTemplate = 'custom';
    this.config.policyName = 'Custom Cancellation Policy';
    this.config.rules = [
      { id: this.generateId(), label: 'Free Cancellation Window', timeAmount: 24, timeUnit: 'hours', refundPercent: 100 },
    ];
    this.config.fees = { fixedFeeEnabled: false, fixedFeeAmount: 25, percentageFeeEnabled: false, percentageFeeAmount: 10 };
    this.config.noShow = { chargePercent: 100, gracePeriodMinutes: 15 };
    this.config.description = '';
    this.emitChange();
  }

  addRule(): void {
    this.config.rules.push({
      id: this.generateId(),
      label: 'Custom Rule',
      timeAmount: 24,
      timeUnit: 'hours',
      refundPercent: 50,
    });
    this.emitChange();
  }

  removeRule(index: number): void {
    if (this.config.rules.length <= 1) return;
    this.config.rules.splice(index, 1);
    this.emitChange();
  }

  setVisibility(key: keyof PolicyVisibility, value: boolean): void {
    this.config.visibility[key] = value;
    this.emitChange();
  }

  emitChange(): void {
    const serialized = JSON.stringify(this.config);
    this.settingsChange.emit({
      ...this.settings,
      cancellationPolicy: serialized,
    });
  }

  private parseSettingsToConfig(): void {
    const raw = this.settings?.cancellationPolicy;
    if (!raw) {
      this.config = createDefaultConfig();
      return;
    }

    try {
      const parsed = JSON.parse(raw) as CancellationPolicyConfig;
      this.config = {
        selectedTemplate: parsed.selectedTemplate ?? 'moderate',
        policyName: parsed.policyName ?? '',
        rules: Array.isArray(parsed.rules) ? parsed.rules : createDefaultConfig().rules,
        fees: parsed.fees ? { ...createDefaultConfig().fees, ...parsed.fees } : createDefaultConfig().fees,
        noShow: parsed.noShow ? { ...createDefaultConfig().noShow, ...parsed.noShow } : createDefaultConfig().noShow,
        description: parsed.description ?? '',
        visibility: parsed.visibility ? { ...createDefaultConfig().visibility, ...parsed.visibility } : createDefaultConfig().visibility,
        applyTo: parsed.applyTo ?? 'new-only',
      };
    } catch {
      // If the cancellationPolicy is a plain text string (old format), use it as description
      this.config = createDefaultConfig();
      this.config.description = raw;
    }
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 11);
  }
}
