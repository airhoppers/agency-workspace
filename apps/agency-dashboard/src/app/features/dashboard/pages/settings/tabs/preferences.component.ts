import {
  Component,
  input,
  output,
  signal,
  computed,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgencySettings } from '@workspace/core';

interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

interface TimezoneOption {
  id: string;
  label: string;
  abbreviation: string;
  offset: string;
}

interface TimezoneGroup {
  region: string;
  zones: TimezoneOption[];
}

interface PresetConfig {
  label: string;
  currency: string;
  language: string;
  timezone: string;
}

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="preferences-layout">
      <div class="preferences-main">

        <!-- Currency Settings -->
        <section class="settings-section">
          <div class="section-header">
            <div class="section-icon currency-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div>
              <h3>Currency Settings</h3>
              <p>Set the default currency for pricing and transactions</p>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Default Currency</label>
            <div class="searchable-dropdown" [class.open]="currencyDropdownOpen()">
              <div class="dropdown-trigger" (click)="toggleCurrencyDropdown(); $event.stopPropagation()">
                @if (selectedCurrency()) {
                  <span class="selected-value">
                    <span class="currency-symbol-badge">{{ selectedCurrency()!.symbol }}</span>
                    {{ selectedCurrency()!.code }} - {{ selectedCurrency()!.name }}
                  </span>
                } @else {
                  <span class="placeholder">Select a currency...</span>
                }
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              @if (currencyDropdownOpen()) {
                <div class="dropdown-panel" (click)="$event.stopPropagation()">
                  <div class="dropdown-search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                      type="text"
                      placeholder="Search currencies..."
                      [ngModel]="currencySearch()"
                      (ngModelChange)="currencySearch.set($event)"
                      (click)="$event.stopPropagation()"
                    />
                  </div>
                  <div class="dropdown-options">
                    @for (currency of filteredCurrencies(); track currency.code) {
                      <div
                        class="dropdown-option"
                        [class.selected]="currency.code === selectedCurrencyCode()"
                        (click)="selectCurrency(currency); $event.stopPropagation()"
                      >
                        <span class="currency-symbol-badge">{{ currency.symbol }}</span>
                        <span>{{ currency.code }} - {{ currency.name }}</span>
                        @if (currency.code === selectedCurrencyCode()) {
                          <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                        }
                      </div>
                    } @empty {
                      <div class="dropdown-empty">No currencies match your search</div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          @if (selectedCurrency()) {
            <div class="selected-display-card">
              <div class="display-card-header">
                <span class="large-symbol">{{ selectedCurrency()!.symbol }}</span>
                <div>
                  <strong>{{ selectedCurrency()!.name }}</strong>
                  <span class="code-label">{{ selectedCurrency()!.code }}</span>
                </div>
              </div>
            </div>

            <div class="preview-card">
              <div class="preview-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                <span>Live Formatting Preview</span>
              </div>
              <div class="preview-rows">
                <div class="preview-row">
                  <span class="preview-label">Package Price</span>
                  <span class="preview-value">{{ selectedCurrency()!.symbol }}1,299.00</span>
                </div>
                <div class="preview-row">
                  <span class="preview-label">Deposit (20%)</span>
                  <span class="preview-value">{{ selectedCurrency()!.symbol }}259.80</span>
                </div>
                <div class="preview-row">
                  <span class="preview-label">Refund Amount (50%)</span>
                  <span class="preview-value">{{ selectedCurrency()!.symbol }}649.50</span>
                </div>
              </div>
            </div>
          }
        </section>

        <!-- Language Settings -->
        <section class="settings-section">
          <div class="section-header">
            <div class="section-icon language-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <div>
              <h3>Language Settings</h3>
              <p>Configure the language for your agency dashboard and communications</p>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Admin Dashboard Language</label>
            <div class="searchable-dropdown" [class.open]="languageDropdownOpen()">
              <div class="dropdown-trigger" (click)="toggleLanguageDropdown(); $event.stopPropagation()">
                @if (selectedLanguage()) {
                  <span class="selected-value">
                    <span class="flag-emoji">{{ selectedLanguage()!.flag }}</span>
                    {{ selectedLanguage()!.name }}
                  </span>
                } @else {
                  <span class="placeholder">Select a language...</span>
                }
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              @if (languageDropdownOpen()) {
                <div class="dropdown-panel" (click)="$event.stopPropagation()">
                  <div class="dropdown-search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                      type="text"
                      placeholder="Search languages..."
                      [ngModel]="languageSearch()"
                      (ngModelChange)="languageSearch.set($event)"
                      (click)="$event.stopPropagation()"
                    />
                  </div>
                  <div class="dropdown-options">
                    @for (lang of filteredLanguages(); track lang.code) {
                      <div
                        class="dropdown-option"
                        [class.selected]="lang.code === selectedLanguageCode()"
                        (click)="selectLanguage(lang); $event.stopPropagation()"
                      >
                        <span class="flag-emoji">{{ lang.flag }}</span>
                        <span>{{ lang.name }}</span>
                        @if (lang.code === selectedLanguageCode()) {
                          <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                        }
                      </div>
                    } @empty {
                      <div class="dropdown-empty">No languages match your search</div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          @if (selectedLanguage()) {
            <div class="selected-display-card language-display">
              <span class="large-flag">{{ selectedLanguage()!.flag }}</span>
              <strong>{{ selectedLanguage()!.name }}</strong>
            </div>
          }

          <div class="field-group">
            <label class="field-label">Customer Communication Language</label>
            <div class="radio-group">
              <label class="radio-label" [class.active]="customerLanguageMode() === 'same'">
                <input
                  type="radio"
                  name="customerLanguageMode"
                  value="same"
                  [checked]="customerLanguageMode() === 'same'"
                  (change)="customerLanguageMode.set('same')"
                />
                <div class="radio-content">
                  <span class="radio-title">Same as Admin</span>
                  <span class="radio-desc">All customer communications use the admin dashboard language</span>
                </div>
              </label>
              <label class="radio-label" [class.active]="customerLanguageMode() === 'auto'">
                <input
                  type="radio"
                  name="customerLanguageMode"
                  value="auto"
                  [checked]="customerLanguageMode() === 'auto'"
                  (change)="customerLanguageMode.set('auto')"
                />
                <div class="radio-content">
                  <span class="radio-title">Auto-detect based on customer</span>
                  <span class="radio-desc">Automatically detect and use the customer's preferred language</span>
                </div>
              </label>
            </div>
          </div>
        </section>

        <!-- Timezone Settings -->
        <section class="settings-section">
          <div class="section-header">
            <div class="section-icon timezone-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div>
              <h3>Timezone Settings</h3>
              <p>Set your agency's operating timezone for schedules and bookings</p>
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Agency Timezone</label>
            <div class="searchable-dropdown" [class.open]="timezoneDropdownOpen()">
              <div class="dropdown-trigger" (click)="toggleTimezoneDropdown(); $event.stopPropagation()">
                @if (selectedTimezone()) {
                  <span class="selected-value">
                    <span class="tz-abbr-badge">{{ selectedTimezone()!.abbreviation }}</span>
                    {{ selectedTimezone()!.label }} ({{ selectedTimezone()!.offset }})
                  </span>
                } @else {
                  <span class="placeholder">Select a timezone...</span>
                }
                <svg class="chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
              </div>
              @if (timezoneDropdownOpen()) {
                <div class="dropdown-panel" (click)="$event.stopPropagation()">
                  <div class="dropdown-search">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input
                      type="text"
                      placeholder="Search timezones..."
                      [ngModel]="timezoneSearch()"
                      (ngModelChange)="timezoneSearch.set($event)"
                      (click)="$event.stopPropagation()"
                    />
                  </div>
                  <div class="dropdown-options">
                    @for (group of filteredTimezoneGroups(); track group.region) {
                      <div class="option-group-label">{{ group.region }}</div>
                      @for (tz of group.zones; track tz.id) {
                        <div
                          class="dropdown-option"
                          [class.selected]="tz.id === selectedTimezoneId()"
                          (click)="selectTimezone(tz); $event.stopPropagation()"
                        >
                          <span class="tz-abbr-badge">{{ tz.abbreviation }}</span>
                          <span>{{ tz.label }}</span>
                          <span class="tz-offset">{{ tz.offset }}</span>
                          @if (tz.id === selectedTimezoneId()) {
                            <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                          }
                        </div>
                      }
                    } @empty {
                      <div class="dropdown-empty">No timezones match your search</div>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          @if (selectedTimezone()) {
            <div class="time-preview-card">
              <div class="time-preview-header">Current Time &amp; Date Preview</div>
              <div class="time-preview-body">
                <div class="live-time">{{ currentFormattedTime() }}</div>
                <div class="live-date">{{ currentFormattedDate() }}</div>
                <div class="live-tz">{{ selectedTimezone()!.label }} ({{ selectedTimezone()!.abbreviation }})</div>
              </div>
            </div>
          }

          @if (timezoneChanged()) {
            <div class="impact-warning">
              <div class="warning-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <div class="warning-content">
                <strong>Timezone Change Impact</strong>
                <p>Changing the timezone will affect how booking times, business hours, and scheduled notifications are displayed. Existing bookings will retain their original times.</p>
                <a href="javascript:void(0)" class="warning-link">Learn more about timezone changes</a>
              </div>
            </div>
          }
        </section>

        <!-- Display Preferences -->
        <section class="settings-section">
          <div class="section-header">
            <div class="section-icon display-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div>
              <h3>Display Preferences</h3>
              <p>Customize how dates, times, and values are displayed</p>
            </div>
          </div>

          <div class="checkbox-list">
            <label class="checkbox-item">
              <input
                type="checkbox"
                [checked]="use24HourFormat()"
                (change)="use24HourFormat.set(!use24HourFormat())"
              />
              <div class="checkbox-content">
                <span class="checkbox-title">24-Hour Time Format</span>
                <span class="checkbox-desc">Display times as 14:00 instead of 2:00 PM</span>
              </div>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                [checked]="showTimezoneAbbreviation()"
                (change)="showTimezoneAbbreviation.set(!showTimezoneAbbreviation())"
              />
              <div class="checkbox-content">
                <span class="checkbox-title">Show Timezone Abbreviation</span>
                <span class="checkbox-desc">Append timezone abbreviation to displayed times (e.g. 2:00 PM ET)</span>
              </div>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                [checked]="showCurrencySymbol()"
                (change)="showCurrencySymbol.set(!showCurrencySymbol())"
              />
              <div class="checkbox-content">
                <span class="checkbox-title">Show Currency Symbol</span>
                <span class="checkbox-desc">Display currency symbol alongside amounts (e.g. $100 instead of 100 USD)</span>
              </div>
            </label>
          </div>
        </section>
      </div>

      <!-- Right Sidebar -->
      <aside class="preferences-sidebar">
        <!-- Quick Tips -->
        <div class="sidebar-card">
          <div class="sidebar-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            <span>Quick Tips</span>
          </div>
          <ul class="tips-list">
            <li>Currency affects how prices are displayed to customers on your packages</li>
            <li>Language settings determine the dashboard interface language</li>
            <li>Timezone impacts booking schedules and business hours display</li>
            <li>Changes take effect immediately after saving</li>
          </ul>
        </div>

        <!-- Regional Settings Summary -->
        <div class="sidebar-card">
          <div class="sidebar-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
            <span>Regional Settings</span>
          </div>
          <div class="summary-list">
            <div class="summary-row">
              <span class="summary-label">Currency</span>
              <span class="summary-value">{{ selectedCurrency()?.code || 'Not set' }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Language</span>
              <span class="summary-value">{{ selectedLanguage()?.name || 'Not set' }}</span>
            </div>
            <div class="summary-row">
              <span class="summary-label">Timezone</span>
              <span class="summary-value">{{ selectedTimezone()?.abbreviation || 'Not set' }}</span>
            </div>
          </div>
        </div>

        <!-- Common Configurations -->
        <div class="sidebar-card">
          <div class="sidebar-card-header">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
            </svg>
            <span>Common Configurations</span>
          </div>
          <div class="presets-list">
            @for (preset of presets; track preset.label) {
              <button class="preset-btn" (click)="applyPreset(preset)">
                <span class="preset-label">{{ preset.label }}</span>
                <span class="preset-details">{{ getPresetSummary(preset) }}</span>
              </button>
            }
          </div>
        </div>
      </aside>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .preferences-layout {
      display: grid;
      grid-template-columns: 1fr 300px;
      gap: var(--spacing-xl);
      align-items: start;

      @media (max-width: 960px) {
        grid-template-columns: 1fr;
      }
    }

    .preferences-main {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    /* Section Styles */
    .settings-section {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: var(--spacing-xl);
      transition: box-shadow var(--transition-normal);

      &:hover {
        box-shadow: var(--shadow-sm);
      }
    }

    .section-header {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
      padding-bottom: var(--spacing-md);
      border-bottom: 1px solid var(--border-light);

      h3 {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs) 0;
      }

      p {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .section-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .currency-icon {
      background: linear-gradient(135deg, rgba(255, 147, 112, 0.15), rgba(255, 78, 120, 0.15));
      color: #ff4e78;
    }

    .language-icon {
      background: linear-gradient(135deg, rgba(33, 150, 243, 0.15), rgba(21, 101, 192, 0.15));
      color: var(--color-primary-600);
    }

    .timezone-icon {
      background: linear-gradient(135deg, rgba(76, 175, 80, 0.15), rgba(46, 125, 50, 0.15));
      color: var(--color-success-dark);
    }

    .display-icon {
      background: linear-gradient(135deg, rgba(156, 39, 176, 0.15), rgba(106, 27, 154, 0.15));
      color: #7b1fa2;
    }

    /* Field Styles */
    .field-group {
      margin-bottom: var(--spacing-lg);
    }

    .field-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: var(--spacing-sm);
    }

    /* Searchable Dropdown */
    .searchable-dropdown {
      position: relative;
    }

    .dropdown-trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px var(--spacing-md);
      background: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);
      min-height: 42px;

      &:hover {
        border-color: var(--border-dark);
      }

      .open & {
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }
    }

    .selected-value {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
    }

    .placeholder {
      font-size: var(--font-size-sm);
      color: var(--text-tertiary);
    }

    .chevron {
      color: var(--text-tertiary);
      transition: transform var(--transition-fast);
      flex-shrink: 0;

      .open & {
        transform: rotate(180deg);
      }
    }

    .dropdown-panel {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-lg);
      z-index: var(--z-dropdown);
      overflow: hidden;
    }

    .dropdown-search {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      border-bottom: 1px solid var(--border-light);
      color: var(--text-tertiary);

      input {
        flex: 1;
        border: none;
        outline: none;
        font-size: var(--font-size-sm);
        color: var(--text-primary);
        background: transparent;

        &::placeholder {
          color: var(--text-tertiary);
        }
      }
    }

    .dropdown-options {
      max-height: 240px;
      overflow-y: auto;
      padding: var(--spacing-xs) 0;
    }

    .dropdown-option {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      cursor: pointer;
      transition: background var(--transition-fast);

      &:hover {
        background: var(--bg-tertiary);
      }

      &.selected {
        background: var(--color-primary-50);
        color: var(--color-primary-700);
        font-weight: var(--font-weight-medium);
      }

      .check-icon {
        margin-left: auto;
        color: var(--color-primary-600);
      }
    }

    .option-group-label {
      padding: var(--spacing-sm) var(--spacing-md) var(--spacing-xs);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-tertiary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .dropdown-empty {
      padding: var(--spacing-lg);
      text-align: center;
      font-size: var(--font-size-sm);
      color: var(--text-tertiary);
    }

    /* Badges */
    .currency-symbol-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: var(--radius-md);
      background: var(--bg-tertiary);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      flex-shrink: 0;
    }

    .flag-emoji {
      font-size: var(--font-size-lg);
      line-height: 1;
    }

    .tz-abbr-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 38px;
      height: 24px;
      padding: 0 var(--spacing-xs);
      border-radius: var(--radius-sm);
      background: var(--bg-tertiary);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .tz-offset {
      margin-left: auto;
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    /* Selected Display Card */
    .selected-display-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .display-card-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);

      .large-symbol {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: var(--radius-lg);
        background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
        color: white;
        font-size: var(--font-size-xl);
        font-weight: var(--font-weight-bold);
      }

      strong {
        display: block;
        font-size: var(--font-size-base);
        color: var(--text-primary);
        margin-bottom: 2px;
      }

      .code-label {
        font-size: var(--font-size-xs);
        color: var(--text-tertiary);
      }
    }

    .language-display {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);

      .large-flag {
        font-size: 2rem;
        line-height: 1;
      }

      strong {
        font-size: var(--font-size-base);
        color: var(--text-primary);
      }
    }

    /* Preview Card */
    .preview-card {
      background: var(--bg-secondary);
      border: 1px dashed var(--border-default);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .preview-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--bg-tertiary);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .preview-rows {
      padding: var(--spacing-md);
    }

    .preview-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;

      &:not(:last-child) {
        border-bottom: 1px solid var(--border-light);
      }
    }

    .preview-label {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .preview-value {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      font-family: var(--font-family-mono);
    }

    /* Radio Group */
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .radio-label {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--border-default);
        background: var(--bg-secondary);
      }

      &.active {
        border-color: var(--color-primary-400);
        background: var(--color-primary-50);
      }

      input[type="radio"] {
        margin-top: 3px;
        cursor: pointer;
        accent-color: var(--color-primary-600);
      }
    }

    .radio-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .radio-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .radio-desc {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    /* Time Preview */
    .time-preview-card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      overflow: hidden;
      margin-bottom: var(--spacing-md);
    }

    .time-preview-header {
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--bg-tertiary);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .time-preview-body {
      padding: var(--spacing-lg);
      text-align: center;
    }

    .live-time {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      font-family: var(--font-family-mono);
      letter-spacing: 0.02em;
    }

    .live-date {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin-top: var(--spacing-xs);
    }

    .live-tz {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      margin-top: var(--spacing-xs);
    }

    /* Impact Warning */
    .impact-warning {
      display: flex;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: var(--color-warning-light);
      border: 1px solid var(--color-warning);
      border-radius: var(--radius-md);

      .warning-icon {
        color: var(--color-warning-dark);
        flex-shrink: 0;
        margin-top: 2px;
      }

      .warning-content {
        strong {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--color-warning-dark);
          margin-bottom: var(--spacing-xs);
        }

        p {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0 0 var(--spacing-sm) 0;
          line-height: var(--line-height-normal);
        }
      }

      .warning-link {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-warning-dark);
        text-decoration: underline;
        cursor: pointer;

        &:hover {
          color: var(--text-primary);
        }
      }
    }

    /* Checkbox List */
    .checkbox-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--border-default);
        background: var(--bg-secondary);
      }

      input[type="checkbox"] {
        margin-top: 3px;
        cursor: pointer;
        accent-color: var(--color-primary-600);
        width: 16px;
        height: 16px;
        flex-shrink: 0;
      }
    }

    .checkbox-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .checkbox-title {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .checkbox-desc {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    /* Sidebar */
    .preferences-sidebar {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      position: sticky;
      top: var(--spacing-lg);
    }

    .sidebar-card {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    .sidebar-card-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background: var(--bg-secondary);
      border-bottom: 1px solid var(--border-light);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);

      svg {
        color: var(--text-tertiary);
      }
    }

    .tips-list {
      list-style: none;
      margin: 0;
      padding: var(--spacing-md);

      li {
        position: relative;
        padding: var(--spacing-sm) 0 var(--spacing-sm) var(--spacing-lg);
        font-size: var(--font-size-xs);
        color: var(--text-secondary);
        line-height: var(--line-height-relaxed);

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          width: 6px;
          height: 6px;
          border-radius: var(--radius-full);
          background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
        }

        &:not(:last-child) {
          border-bottom: 1px solid var(--border-light);
        }
      }
    }

    .summary-list {
      padding: var(--spacing-md);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;

      &:not(:last-child) {
        border-bottom: 1px solid var(--border-light);
      }
    }

    .summary-label {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    .summary-value {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .presets-list {
      padding: var(--spacing-sm);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .preset-btn {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      background: var(--bg-primary);
      cursor: pointer;
      transition: all var(--transition-fast);
      text-align: left;

      &:hover {
        background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
        border-color: transparent;
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);

        .preset-label {
          color: white;
        }

        .preset-details {
          color: rgba(255, 255, 255, 0.85);
        }
      }
    }

    .preset-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      transition: color var(--transition-fast);
    }

    .preset-details {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      transition: color var(--transition-fast);
    }
  `]
})
export class PreferencesComponent implements OnInit, OnDestroy {
  readonly settings = input<AgencySettings>({});
  readonly settingsChange = output<AgencySettings>();

  // Dropdown open states
  readonly currencyDropdownOpen = signal(false);
  readonly languageDropdownOpen = signal(false);
  readonly timezoneDropdownOpen = signal(false);

  // Search states
  readonly currencySearch = signal('');
  readonly languageSearch = signal('');
  readonly timezoneSearch = signal('');

  // Selected codes (internal state)
  readonly selectedCurrencyCode = signal<string>('USD');
  readonly selectedLanguageCode = signal<string>('en');
  readonly selectedTimezoneId = signal<string>('America/New_York');

  // Display preference toggles
  readonly use24HourFormat = signal(false);
  readonly showTimezoneAbbreviation = signal(true);
  readonly showCurrencySymbol = signal(true);

  // Customer communication language mode
  readonly customerLanguageMode = signal<'same' | 'auto'>('same');

  // Timezone change tracking
  readonly initialTimezoneId = signal<string>('');

  // Live clock
  readonly currentTime = signal(new Date());
  private clockInterval: ReturnType<typeof setInterval> | null = null;

  // Data
  readonly currencies: CurrencyOption[] = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '\u20AC', name: 'Euro' },
    { code: 'GBP', symbol: '\u00A3', name: 'British Pound' },
    { code: 'JPY', symbol: '\u00A5', name: 'Japanese Yen' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
    { code: 'CNY', symbol: '\u00A5', name: 'Chinese Yuan' },
  ];

  readonly languages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
    { code: 'es', name: 'Spanish', flag: '\uD83C\uDDEA\uD83C\uDDF8' },
    { code: 'fr', name: 'French', flag: '\uD83C\uDDEB\uD83C\uDDF7' },
    { code: 'de', name: 'German', flag: '\uD83C\uDDE9\uD83C\uDDEA' },
    { code: 'it', name: 'Italian', flag: '\uD83C\uDDEE\uD83C\uDDF9' },
    { code: 'pt', name: 'Portuguese', flag: '\uD83C\uDDE7\uD83C\uDDF7' },
    { code: 'ja', name: 'Japanese', flag: '\uD83C\uDDEF\uD83C\uDDF5' },
  ];

  readonly timezoneGroups: TimezoneGroup[] = [
    {
      region: 'North America',
      zones: [
        { id: 'America/New_York', label: 'Eastern Time', abbreviation: 'ET', offset: 'UTC-5' },
        { id: 'America/Chicago', label: 'Central Time', abbreviation: 'CT', offset: 'UTC-6' },
        { id: 'America/Denver', label: 'Mountain Time', abbreviation: 'MT', offset: 'UTC-7' },
        { id: 'America/Los_Angeles', label: 'Pacific Time', abbreviation: 'PT', offset: 'UTC-8' },
      ],
    },
    {
      region: 'Europe',
      zones: [
        { id: 'Europe/London', label: 'Greenwich Mean Time', abbreviation: 'GMT', offset: 'UTC+0' },
        { id: 'Europe/Berlin', label: 'Central European Time', abbreviation: 'CET', offset: 'UTC+1' },
      ],
    },
    {
      region: 'Asia Pacific',
      zones: [
        { id: 'Asia/Tokyo', label: 'Japan Standard Time', abbreviation: 'JST', offset: 'UTC+9' },
        { id: 'Australia/Sydney', label: 'Australian Eastern Standard Time', abbreviation: 'AEST', offset: 'UTC+10' },
      ],
    },
  ];

  readonly presets: PresetConfig[] = [
    { label: 'US Standard', currency: 'USD', language: 'en', timezone: 'America/New_York' },
    { label: 'UK Standard', currency: 'GBP', language: 'en', timezone: 'Europe/London' },
    { label: 'EU Standard', currency: 'EUR', language: 'fr', timezone: 'Europe/Berlin' },
  ];

  // Computed values
  readonly selectedCurrency = computed(() => {
    return this.currencies.find(c => c.code === this.selectedCurrencyCode()) ?? null;
  });

  readonly selectedLanguage = computed(() => {
    return this.languages.find(l => l.code === this.selectedLanguageCode()) ?? null;
  });

  readonly selectedTimezone = computed(() => {
    for (const group of this.timezoneGroups) {
      const found = group.zones.find(z => z.id === this.selectedTimezoneId());
      if (found) return found;
    }
    return null;
  });

  readonly timezoneChanged = computed(() => {
    const initial = this.initialTimezoneId();
    return initial !== '' && initial !== this.selectedTimezoneId();
  });

  readonly filteredCurrencies = computed(() => {
    const search = this.currencySearch().toLowerCase().trim();
    if (!search) return this.currencies;
    return this.currencies.filter(
      c =>
        c.code.toLowerCase().includes(search) ||
        c.name.toLowerCase().includes(search) ||
        c.symbol.toLowerCase().includes(search)
    );
  });

  readonly filteredLanguages = computed(() => {
    const search = this.languageSearch().toLowerCase().trim();
    if (!search) return this.languages;
    return this.languages.filter(
      l =>
        l.code.toLowerCase().includes(search) ||
        l.name.toLowerCase().includes(search)
    );
  });

  readonly filteredTimezoneGroups = computed(() => {
    const search = this.timezoneSearch().toLowerCase().trim();
    if (!search) return this.timezoneGroups;
    return this.timezoneGroups
      .map(group => ({
        ...group,
        zones: group.zones.filter(
          z =>
            z.label.toLowerCase().includes(search) ||
            z.abbreviation.toLowerCase().includes(search) ||
            z.offset.toLowerCase().includes(search) ||
            group.region.toLowerCase().includes(search)
        ),
      }))
      .filter(group => group.zones.length > 0);
  });

  readonly currentFormattedTime = computed(() => {
    const time = this.currentTime();
    const tz = this.selectedTimezoneId();
    try {
      return time.toLocaleTimeString('en-US', {
        timeZone: tz,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !this.use24HourFormat(),
      });
    } catch {
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: !this.use24HourFormat(),
      });
    }
  });

  readonly currentFormattedDate = computed(() => {
    const time = this.currentTime();
    const tz = this.selectedTimezoneId();
    try {
      return time.toLocaleDateString('en-US', {
        timeZone: tz,
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return time.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
  });

  // Document click handler for closing dropdowns
  private readonly boundCloseDropdowns = this.closeAllDropdowns.bind(this);

  ngOnInit(): void {
    this.initFromSettings();
    this.startClock();
    document.addEventListener('click', this.boundCloseDropdowns);
  }

  ngOnDestroy(): void {
    this.stopClock();
    document.removeEventListener('click', this.boundCloseDropdowns);
  }

  private initFromSettings(): void {
    const s = this.settings();
    if (s?.currency) {
      this.selectedCurrencyCode.set(s.currency);
    }
    if (s?.language) {
      this.selectedLanguageCode.set(s.language);
    }
    if (s?.timezone) {
      this.selectedTimezoneId.set(s.timezone);
    }
    this.initialTimezoneId.set(this.selectedTimezoneId());
  }

  private startClock(): void {
    this.clockInterval = setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);
  }

  private stopClock(): void {
    if (this.clockInterval) {
      clearInterval(this.clockInterval);
      this.clockInterval = null;
    }
  }

  private closeAllDropdowns(): void {
    this.currencyDropdownOpen.set(false);
    this.languageDropdownOpen.set(false);
    this.timezoneDropdownOpen.set(false);
  }

  toggleCurrencyDropdown(): void {
    const wasOpen = this.currencyDropdownOpen();
    this.closeAllDropdowns();
    if (!wasOpen) {
      this.currencyDropdownOpen.set(true);
      this.currencySearch.set('');
    }
  }

  toggleLanguageDropdown(): void {
    const wasOpen = this.languageDropdownOpen();
    this.closeAllDropdowns();
    if (!wasOpen) {
      this.languageDropdownOpen.set(true);
      this.languageSearch.set('');
    }
  }

  toggleTimezoneDropdown(): void {
    const wasOpen = this.timezoneDropdownOpen();
    this.closeAllDropdowns();
    if (!wasOpen) {
      this.timezoneDropdownOpen.set(true);
      this.timezoneSearch.set('');
    }
  }

  selectCurrency(currency: CurrencyOption): void {
    this.selectedCurrencyCode.set(currency.code);
    this.currencyDropdownOpen.set(false);
    this.emitChanges();
  }

  selectLanguage(lang: LanguageOption): void {
    this.selectedLanguageCode.set(lang.code);
    this.languageDropdownOpen.set(false);
    this.emitChanges();
  }

  selectTimezone(tz: TimezoneOption): void {
    this.selectedTimezoneId.set(tz.id);
    this.timezoneDropdownOpen.set(false);
    this.emitChanges();
  }

  applyPreset(preset: PresetConfig): void {
    this.selectedCurrencyCode.set(preset.currency);
    this.selectedLanguageCode.set(preset.language);
    this.selectedTimezoneId.set(preset.timezone);
    this.emitChanges();
  }

  getPresetSummary(preset: PresetConfig): string {
    const currency = this.currencies.find(c => c.code === preset.currency);
    const lang = this.languages.find(l => l.code === preset.language);
    return `${currency?.symbol ?? ''} ${currency?.code ?? ''} / ${lang?.name ?? ''}`;
  }

  private emitChanges(): void {
    this.settingsChange.emit({
      ...this.settings(),
      currency: this.selectedCurrencyCode(),
      language: this.selectedLanguageCode(),
      timezone: this.selectedTimezoneId(),
    });
  }
}
