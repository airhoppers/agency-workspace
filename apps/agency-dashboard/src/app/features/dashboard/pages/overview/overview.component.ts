import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardComponent, LoadingComponent, BadgeComponent } from '@workspace/shared-ui';
import { AgencyService, StatisticsService, BookingService } from '@workspace/core';
import { AgencyStatistics, Booking, BookingDetail } from '@workspace/core';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink, CardComponent, LoadingComponent, BadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="overview-page">
      <!-- Header with greeting -->
      <div class="page-header">
        <div class="greeting">
          <h1>{{ getGreeting() }}, {{ getAgencyName() }}</h1>
          <p class="date">{{ getCurrentDate() }}</p>
        </div>
        <a routerLink="/dashboard/analytics" class="view-analytics-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
          View Analytics
        </a>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <app-loading size="lg" text="Loading dashboard..."></app-loading>
        </div>
      } @else {
        <!-- Alerts Section -->
        @if (getAlerts().length > 0) {
          <div class="alerts-section">
            @for (alert of getAlerts(); track alert.id) {
              <div class="alert-card" [class]="'alert-' + alert.type">
                <div class="alert-icon">
                  <span [innerHTML]="alert.icon"></span>
                </div>
                <div class="alert-content">
                  <span class="alert-title">{{ alert.title }}</span>
                  <span class="alert-message">{{ alert.message }}</span>
                </div>
                <a [routerLink]="alert.link" class="alert-action">{{ alert.action }}</a>
              </div>
            }
          </div>
        }

        <!-- Key Metrics Row -->
        <div class="metrics-row">
          <div class="metric-card primary">
            <div class="metric-header">
              <span class="metric-label">Total Revenue</span>
              <div class="metric-badge positive">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="19" x2="12" y2="5"/>
                  <polyline points="5 12 12 5 19 12"/>
                </svg>
                Active
              </div>
            </div>
            <div class="metric-value-large">{{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.totalRevenue || 0) }}</div>
            <div class="metric-sparkline">
              @for (point of getRevenueSparkline(); track $index) {
                <div class="spark-bar" [style.height.%]="point"></div>
              }
            </div>
            <div class="metric-footer">
              <span>Avg per booking: {{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.avgRevenuePerBooking || 0) }}</span>
            </div>
          </div>

          <div class="metric-card secondary">
            <div class="metric-header">
              <span class="metric-label">Total Bookings</span>
              <span class="metric-count">{{ stats()?.bookingStats?.totalBookings || 0 }}</span>
            </div>
            <div class="status-breakdown">
              @for (status of getStatusBreakdown(); track status.name) {
                <div class="status-row">
                  <div class="status-info">
                    <span class="status-dot" [style.background-color]="status.color"></span>
                    <span class="status-name">{{ status.name }}</span>
                  </div>
                  <div class="status-bar-container">
                    <div class="status-bar" [style.width.%]="status.percentage" [style.background-color]="status.color"></div>
                  </div>
                  <span class="status-count">{{ status.count }}</span>
                </div>
              }
            </div>
          </div>

          <div class="metric-card tertiary">
            <div class="metric-header">
              <span class="metric-label">Customers</span>
              <span class="metric-count">{{ stats()?.customerStats?.totalCustomers || 0 }}</span>
            </div>
            <div class="customer-breakdown">
              <div class="customer-stat">
                <div class="customer-icon new">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                </div>
                <div class="customer-info">
                  <span class="customer-value">{{ stats()?.customerStats?.newCustomers || 0 }}</span>
                  <span class="customer-label">New</span>
                </div>
              </div>
              <div class="customer-stat">
                <div class="customer-icon returning">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div class="customer-info">
                  <span class="customer-value">{{ stats()?.customerStats?.repeatCustomers || 0 }}</span>
                  <span class="customer-label">Returning</span>
                </div>
              </div>
            </div>
            <div class="retention-rate">
              <span>Retention Rate</span>
              <div class="rate-bar-bg">
                <div class="rate-bar" [style.width.%]="stats()?.customerStats?.repeatCustomerRate || 0"></div>
              </div>
              <span class="rate-value">{{ (stats()?.customerStats?.repeatCustomerRate || 0).toFixed(0) }}%</span>
            </div>
          </div>
        </div>

        <!-- Performance Cards Row -->
        <div class="performance-row">
          <div class="performance-card">
            <div class="perf-icon star">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div class="perf-content">
              <span class="perf-value">{{ (stats()?.feedbackStats?.overallAverageRating || 0).toFixed(1) }}</span>
              <span class="perf-label">Avg Rating</span>
            </div>
          </div>

          <div class="performance-card">
            <div class="perf-icon confirm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="perf-content">
              <span class="perf-value">{{ (stats()?.performanceStats?.confirmationRate || 0).toFixed(0) }}%</span>
              <span class="perf-label">Confirmation Rate</span>
            </div>
          </div>

          <div class="performance-card">
            <div class="perf-icon guests">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="perf-content">
              <span class="perf-value">{{ stats()?.bookingStats?.bookingMetrics?.totalGuests || 0 }}</span>
              <span class="perf-label">Total Guests</span>
            </div>
          </div>

          <div class="performance-card">
            <div class="perf-icon cancel">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div class="perf-content">
              <span class="perf-value">{{ (stats()?.bookingStats?.bookingMetrics?.cancellationRate || 0).toFixed(1) }}%</span>
              <span class="perf-label">Cancellation Rate</span>
            </div>
          </div>

          <div class="performance-card">
            <div class="perf-icon packages">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <div class="perf-content">
              <span class="perf-value">{{ stats()?.operationalStats?.activePackages || 0 }}</span>
              <span class="perf-label">Active Packages</span>
            </div>
          </div>
        </div>

        <!-- Two Column Section -->
        <div class="two-col-section">
          <!-- Top Destinations -->
          <div class="section-card">
            <div class="section-header">
              <h3>Top Destinations</h3>
              <a routerLink="/dashboard/analytics" class="see-all">See all</a>
            </div>
            <div class="destinations-grid">
              @for (dest of getTopDestinations(); track dest.destination; let i = $index) {
                <div class="destination-card" [class]="'rank-' + (i + 1)">
                  <div class="dest-rank">#{{ i + 1 }}</div>
                  <div class="dest-content">
                    <span class="dest-name">{{ dest.destination }}</span>
                    <div class="dest-stats">
                      <span class="dest-bookings">{{ dest.bookingCount }} bookings</span>
                      <span class="dest-percentage">{{ dest.percentage.toFixed(0) }}%</span>
                    </div>
                  </div>
                  <div class="dest-progress">
                    <div class="dest-bar" [style.width.%]="dest.percentage"></div>
                  </div>
                </div>
              }
              @if (getTopDestinations().length === 0) {
                <div class="empty-state">
                  <span>No destination data yet</span>
                </div>
              }
            </div>
          </div>

          <!-- Top Customers -->
          <div class="section-card">
            <div class="section-header">
              <h3>Top Customers</h3>
              <a routerLink="/dashboard/customers" class="see-all">See all</a>
            </div>
            <div class="customers-grid">
              @for (customer of getTopCustomers(); track customer.userId; let i = $index) {
                <div class="customer-card">
                  <div class="customer-avatar" [style.background]="getGradient(i)">
                    {{ getInitials(customer.customerName) }}
                  </div>
                  <div class="customer-details">
                    <span class="customer-name">{{ customer.customerName }}</span>
                    <span class="customer-email">{{ customer.customerEmail }}</span>
                  </div>
                  <div class="customer-spend">
                    <span class="spend-amount">{{ getCurrencySymbol() }}{{ formatNumber(customer.totalSpent) }}</span>
                    <span class="spend-bookings">{{ customer.bookingCount }} bookings</span>
                  </div>
                  <app-badge [variant]="getCustomerBadgeVariant(customer.customerType)" size="sm">
                    {{ customer.customerType }}
                  </app-badge>
                </div>
              }
              @if (getTopCustomers().length === 0) {
                <div class="empty-state">
                  <span>No customer data yet</span>
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Recent Bookings Section -->
        <div class="section-card full-width">
          <div class="section-header">
            <h3>Recent Bookings</h3>
            <a routerLink="/dashboard/bookings" class="see-all">View all bookings</a>
          </div>
          <div class="bookings-list">
            @for (booking of getRecentBookings(); track booking.bookingId) {
              <div class="booking-row">
                <div class="booking-main">
                  <div class="booking-avatar" [style.background]="getBookingGradient(booking.status)">
                    {{ getInitials(booking.customerName) }}
                  </div>
                  <div class="booking-info">
                    <span class="booking-customer">{{ booking.customerName }}</span>
                    <span class="booking-package">{{ booking.travelPackageTitle }}</span>
                  </div>
                </div>
                <div class="booking-ref">
                  <span class="ref-label">Ref</span>
                  <span class="ref-value">{{ booking.bookingReference }}</span>
                </div>
                <div class="booking-date">
                  <span class="date-label">Travel Date</span>
                  <span class="date-value">{{ formatDate(booking.bookingDate) }}</span>
                </div>
                <div class="booking-amount">
                  <span class="amount-value">{{ getCurrencySymbol() }}{{ formatNumber(booking.totalPrice) }}</span>
                  <span class="amount-guests">{{ booking.numberOfAdults + booking.numberOfChildren }} guests</span>
                </div>
                <app-badge [variant]="getStatusVariant(booking.status)">
                  {{ booking.status }}
                </app-badge>
              </div>
            }
            @if (getRecentBookings().length === 0) {
              <div class="empty-state">
                <span>No bookings yet</span>
              </div>
            }
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions-section">
          <h3>Quick Actions</h3>
          <div class="actions-grid">
            <a routerLink="/dashboard/packages/create" class="action-card">
              <div class="action-icon create">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <span class="action-label">Create Package</span>
            </a>
            <a routerLink="/dashboard/bookings" class="action-card">
              <div class="action-icon bookings">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                </svg>
              </div>
              <span class="action-label">Manage Bookings</span>
            </a>
            <a routerLink="/dashboard/members" class="action-card">
              <div class="action-icon members">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <span class="action-label">Team Members</span>
            </a>
            <a routerLink="/dashboard/messages" class="action-card">
              <div class="action-icon messages">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <span class="action-label">Messages</span>
            </a>
            <a routerLink="/dashboard/analytics" class="action-card">
              <div class="action-icon analytics">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <span class="action-label">Analytics</span>
            </a>
            <a routerLink="/dashboard/settings" class="action-card">
              <div class="action-icon settings">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
              </div>
              <span class="action-label">Settings</span>
            </a>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .overview-page {
      max-width: var(--content-max-width);
      margin: 0 auto;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);

      .greeting {
        h1 {
          font-size: var(--font-size-3xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xs) 0;
        }

        .date {
          font-size: var(--font-size-base);
          color: var(--text-secondary);
          margin: 0;
        }
      }

      .view-analytics-btn {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-lg);
        background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
        color: white;
        border-radius: var(--radius-lg);
        text-decoration: none;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        transition: all var(--transition-fast);
        box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);

        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.4);
        }
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: var(--spacing-2xl);
    }

    /* Alerts Section */
    .alerts-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-xl);
    }

    .alert-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      border-radius: var(--radius-lg);
      background: white;
      border: 1px solid var(--border-light);

      &.alert-warning {
        background: linear-gradient(90deg, #fff7ed, white);
        border-left: 4px solid var(--color-warning);

        .alert-icon { color: var(--color-warning); }
      }

      &.alert-info {
        background: linear-gradient(90deg, #eff6ff, white);
        border-left: 4px solid var(--color-primary-500);

        .alert-icon { color: var(--color-primary-500); }
      }

      &.alert-success {
        background: linear-gradient(90deg, #f0fdf4, white);
        border-left: 4px solid var(--color-success);

        .alert-icon { color: var(--color-success); }
      }

      .alert-icon {
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .alert-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .alert-title {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .alert-message {
          font-size: var(--font-size-xs);
          color: var(--text-secondary);
        }
      }

      .alert-action {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--color-primary-600);
        text-decoration: none;
        white-space: nowrap;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    /* Metrics Row */
    .metrics-row {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1fr;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);

      @media (max-width: 1100px) {
        grid-template-columns: 1fr;
      }
    }

    .metric-card {
      background: white;
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      border: 1px solid var(--border-light);
      box-shadow: var(--shadow-sm);

      &.primary {
        background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
        color: white;
        border: none;

        .metric-label { color: rgba(255,255,255,0.7); }
        .metric-footer { color: rgba(255,255,255,0.6); }
        .metric-badge {
          background: rgba(255,255,255,0.2);
          color: white;
        }
      }

      .metric-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-sm);

        .metric-label {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          font-weight: var(--font-weight-medium);
        }

        .metric-count {
          font-size: var(--font-size-2xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
        }

        .metric-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 10px;
          background: var(--color-success-light);
          color: var(--color-success);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: var(--font-weight-medium);

          &.positive svg { stroke: currentColor; }
        }
      }

      .metric-value-large {
        font-size: 36px;
        font-weight: var(--font-weight-bold);
        margin-bottom: var(--spacing-md);
        line-height: 1;
      }

      .metric-sparkline {
        display: flex;
        align-items: flex-end;
        gap: 3px;
        height: 40px;
        margin-bottom: var(--spacing-md);

        .spark-bar {
          flex: 1;
          background: rgba(255,255,255,0.3);
          border-radius: 2px;
          min-height: 4px;
        }
      }

      .metric-footer {
        font-size: var(--font-size-xs);
      }
    }

    .status-breakdown {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .status-row {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      .status-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        width: 90px;

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .status-name {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
        }
      }

      .status-bar-container {
        flex: 1;
        height: 6px;
        background: var(--bg-tertiary);
        border-radius: var(--radius-full);
        overflow: hidden;
      }

      .status-bar {
        height: 100%;
        border-radius: var(--radius-full);
        transition: width 0.5s ease;
      }

      .status-count {
        width: 24px;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        text-align: right;
      }
    }

    .customer-breakdown {
      display: flex;
      gap: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
    }

    .customer-stat {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);

      .customer-icon {
        width: 36px;
        height: 36px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;

        &.new {
          background: #dbeafe;
          color: #2563eb;
        }

        &.returning {
          background: #dcfce7;
          color: #16a34a;
        }
      }

      .customer-info {
        display: flex;
        flex-direction: column;

        .customer-value {
          font-size: var(--font-size-lg);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          line-height: 1.2;
        }

        .customer-label {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }
      }
    }

    .retention-rate {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-light);

      span:first-child {
        font-size: var(--font-size-xs);
        color: var(--text-tertiary);
      }

      .rate-bar-bg {
        flex: 1;
        height: 6px;
        background: var(--bg-tertiary);
        border-radius: var(--radius-full);
        overflow: hidden;
      }

      .rate-bar {
        height: 100%;
        background: linear-gradient(90deg, #10b981, #34d399);
        border-radius: var(--radius-full);
      }

      .rate-value {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: var(--color-success);
      }
    }

    /* Performance Row */
    .performance-row {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);

      @media (max-width: 1100px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 700px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .performance-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      padding: var(--spacing-md);
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      transition: all var(--transition-fast);

      &:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }

      .perf-icon {
        width: 44px;
        height: 44px;
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;

        &.star { background: #fef3c7; color: #d97706; }
        &.confirm { background: #dcfce7; color: #16a34a; }
        &.guests { background: #dbeafe; color: #2563eb; }
        &.cancel { background: #fee2e2; color: #dc2626; }
        &.packages { background: #f3e8ff; color: #9333ea; }
      }

      .perf-content {
        display: flex;
        flex-direction: column;

        .perf-value {
          font-size: var(--font-size-xl);
          font-weight: var(--font-weight-bold);
          color: var(--text-primary);
          line-height: 1.2;
        }

        .perf-label {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }
      }
    }

    /* Two Column Section */
    .two-col-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .section-card {
      background: white;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      box-shadow: var(--shadow-sm);

      &.full-width {
        grid-column: 1 / -1;
      }
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: var(--spacing-lg);

      h3 {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        margin: 0;
      }

      .see-all {
        font-size: var(--font-size-sm);
        color: var(--color-primary-600);
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    /* Destinations */
    .destinations-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .destination-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);

      &:hover {
        background: var(--bg-tertiary);
      }

      &.rank-1 { border-left: 3px solid #f59e0b; }
      &.rank-2 { border-left: 3px solid #6b7280; }
      &.rank-3 { border-left: 3px solid #b45309; }

      .dest-rank {
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-bold);
        color: var(--text-tertiary);
        width: 24px;
      }

      .dest-content {
        flex: 1;
        min-width: 0;

        .dest-name {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .dest-stats {
          display: flex;
          gap: var(--spacing-sm);
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }
      }

      .dest-progress {
        width: 60px;
        height: 4px;
        background: var(--border-light);
        border-radius: var(--radius-full);
        overflow: hidden;

        .dest-bar {
          height: 100%;
          background: var(--color-primary-500);
          border-radius: var(--radius-full);
        }
      }
    }

    /* Customers */
    .customers-grid {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .customer-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--border-light);

      &:last-child {
        border-bottom: none;
      }

      .customer-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-semibold);
        color: white;
      }

      .customer-details {
        flex: 1;
        min-width: 0;

        .customer-name {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
        }

        .customer-email {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .customer-spend {
        text-align: right;

        .spend-amount {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .spend-bookings {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }
      }
    }

    /* Bookings List */
    .bookings-list {
      display: flex;
      flex-direction: column;
    }

    .booking-row {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      padding: var(--spacing-md) 0;
      border-bottom: 1px solid var(--border-light);

      &:last-child {
        border-bottom: none;
      }

      @media (max-width: 900px) {
        flex-wrap: wrap;
        gap: var(--spacing-md);
      }

      .booking-main {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        flex: 1.5;
        min-width: 200px;

        .booking-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: white;
          flex-shrink: 0;
        }

        .booking-info {
          min-width: 0;

          .booking-customer {
            display: block;
            font-size: var(--font-size-sm);
            font-weight: var(--font-weight-medium);
            color: var(--text-primary);
          }

          .booking-package {
            font-size: var(--font-size-xs);
            color: var(--text-tertiary);
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }

      .booking-ref, .booking-date {
        flex: 0.5;
        min-width: 80px;

        span {
          display: block;
        }

        .ref-label, .date-label {
          font-size: 10px;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ref-value {
          font-size: var(--font-size-xs);
          font-family: var(--font-family-mono);
          color: var(--color-primary-600);
        }

        .date-value {
          font-size: var(--font-size-sm);
          color: var(--text-primary);
        }
      }

      .booking-amount {
        flex: 0.5;
        min-width: 80px;
        text-align: right;

        .amount-value {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
        }

        .amount-guests {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }
      }
    }

    /* Quick Actions */
    .quick-actions-section {
      margin-bottom: var(--spacing-xl);

      h3 {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-md) 0;
      }
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: var(--spacing-md);

      @media (max-width: 1100px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @media (max-width: 600px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .action-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-lg);
      background: white;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-lg);
      text-decoration: none;
      transition: all var(--transition-fast);

      &:hover {
        border-color: var(--color-primary-300);
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);

        .action-icon {
          transform: scale(1.1);
        }
      }

      .action-icon {
        width: 48px;
        height: 48px;
        border-radius: var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform var(--transition-fast);

        &.create { background: linear-gradient(135deg, #10b981, #059669); color: white; }
        &.bookings { background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; }
        &.members { background: linear-gradient(135deg, #8b5cf6, #7c3aed); color: white; }
        &.messages { background: linear-gradient(135deg, #f59e0b, #d97706); color: white; }
        &.analytics { background: linear-gradient(135deg, #06b6d4, #0891b2); color: white; }
        &.settings { background: linear-gradient(135deg, #6b7280, #4b5563); color: white; }
      }

      .action-label {
        font-size: var(--font-size-sm);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
        text-align: center;
      }
    }

    .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-xl);
      color: var(--text-tertiary);
      font-size: var(--font-size-sm);
    }
  `]
})
export class OverviewComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private statisticsService = inject(StatisticsService);
  private bookingService = inject(BookingService);

  isLoading = signal(true);
  stats = signal<AgencyStatistics | null>(null);
  recentBookings = signal<Booking[]>([]);

  private statusColors: Record<string, string> = {
    'PENDING': '#f59e0b',
    'ACCEPTED': '#3b82f6',
    'FINISHED': '#10b981',
    'COMPLETED': '#10b981',
    'CANCELLED': '#ef4444'
  };

  private gradients = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)',
    'linear-gradient(135deg, #a8edea, #fed6e3)'
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) return;

    this.statisticsService.getAgencyStatistics(agency.id).subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });

    this.bookingService.getAgencyBookings(agency.id, { offset: 0, limit: 5 }).subscribe({
      next: (response) => {
        this.recentBookings.set(response.data || []);
      }
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }

  getAgencyName(): string {
    return this.agencyService.getCurrentAgency()?.name || 'there';
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getAlerts(): { id: string; type: string; title: string; message: string; icon: string; link: string; action: string }[] {
    const alerts: any[] = [];
    const stats = this.stats();

    const pendingCount = stats?.bookingStats?.bookingMetrics?.pendingBookingsCount || 0;
    if (pendingCount > 0) {
      alerts.push({
        id: 'pending',
        type: 'warning',
        title: `${pendingCount} Pending Booking${pendingCount > 1 ? 's' : ''}`,
        message: 'These bookings are waiting for your confirmation',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
        link: '/dashboard/bookings',
        action: 'Review now'
      });
    }

    const overdueCount = stats?.bookingStats?.bookingMetrics?.overdueBookingsCount || 0;
    if (overdueCount > 0) {
      alerts.push({
        id: 'overdue',
        type: 'warning',
        title: `${overdueCount} Overdue Booking${overdueCount > 1 ? 's' : ''}`,
        message: 'These bookings need immediate attention',
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        link: '/dashboard/bookings',
        action: 'View now'
      });
    }

    return alerts;
  }

  getStatusBreakdown(): { name: string; count: number; percentage: number; color: string }[] {
    const distribution = this.stats()?.bookingStats?.statusDistribution || {};
    const total = this.stats()?.bookingStats?.totalBookings || 1;
    const order = ['PENDING', 'ACCEPTED', 'FINISHED', 'CANCELLED'];

    return order
      .filter(status => distribution[status] !== undefined)
      .map(status => ({
        name: status.charAt(0) + status.slice(1).toLowerCase(),
        count: distribution[status],
        percentage: (distribution[status] / total) * 100,
        color: this.statusColors[status]
      }));
  }

  getRevenueSparkline(): number[] {
    const trends = this.stats()?.revenueStats?.revenueTrends || [];
    if (trends.length === 0) return [20, 40, 30, 60, 45, 80, 55, 70];

    const values = trends.slice(-8).map(t => t.revenue);
    const max = Math.max(...values, 1);
    return values.map(v => (v / max) * 100);
  }

  getTopDestinations() {
    return (this.stats()?.bookingStats?.topDestinations || []).slice(0, 5);
  }

  getTopCustomers() {
    return (this.stats()?.revenueStats?.topCustomers || []).slice(0, 4);
  }

  getRecentBookings(): BookingDetail[] {
    return (this.stats()?.bookingStats?.recentBookings || []).slice(0, 5);
  }

  getCurrencySymbol(): string {
    const currency = this.stats()?.revenueStats?.currency;
    const symbols: Record<string, string> = {
      'USD': '$', 'EUR': '€', 'GBP': '£', 'CHF': 'CHF ', 'ALL': 'L', 'CAD': 'C$'
    };
    return symbols[currency || ''] || '$';
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getGradient(index: number): string {
    return this.gradients[index % this.gradients.length];
  }

  getBookingGradient(status: string): string {
    const gradients: Record<string, string> = {
      'PENDING': 'linear-gradient(135deg, #f59e0b, #d97706)',
      'ACCEPTED': 'linear-gradient(135deg, #3b82f6, #2563eb)',
      'FINISHED': 'linear-gradient(135deg, #10b981, #059669)',
      'COMPLETED': 'linear-gradient(135deg, #10b981, #059669)',
      'CANCELLED': 'linear-gradient(135deg, #ef4444, #dc2626)'
    };
    return gradients[status] || this.gradients[0];
  }

  getStatusVariant(status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' {
    const variants: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
      'PENDING': 'warning',
      'ACCEPTED': 'primary',
      'FINISHED': 'success',
      'COMPLETED': 'success',
      'CANCELLED': 'danger'
    };
    return variants[status] || 'default';
  }

  getCustomerBadgeVariant(type: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' {
    const variants: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
      'VIP': 'success',
      'Returning': 'primary',
      'New': 'default'
    };
    return variants[type] || 'default';
  }
}
