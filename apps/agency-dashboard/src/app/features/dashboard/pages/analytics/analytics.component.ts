import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent, LoadingComponent, BadgeComponent, ButtonComponent } from '@workspace/shared-ui';
import { AgencyService, StatisticsService } from '@workspace/core';
import {
  AgencyStatistics,
  StatisticsFilter,
  BookingDetail,
  TopCustomer,
  DestinationStats,
  RevenueTrend,
  BookingTrend
} from '@workspace/core';

type DatePreset = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'all' | 'custom';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, LoadingComponent, BadgeComponent, ButtonComponent],
  template: `
    <div class="analytics-page">
      <div class="page-header">
        <div class="header-content">
          <h1>Analytics & Insights</h1>
          <p>Comprehensive statistics and performance metrics for your agency</p>
        </div>
        <button class="refresh-btn" (click)="loadStatistics()" [disabled]="isLoading()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" [class.spinning]="isLoading()">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/>
            <path d="M21 3v5h-5"/>
          </svg>
          {{ isLoading() ? 'Loading...' : 'Refresh' }}
        </button>
      </div>

      <!-- Filters Section -->
      <app-card class="filters-card">
        <div class="filters-section">
          <div class="filter-row">
            <!-- Date Presets -->
            <div class="filter-group date-presets">
              <label>Time Period</label>
              <div class="preset-buttons">
                @for (preset of datePresets; track preset.value) {
                  <button
                    type="button"
                    class="preset-btn"
                    [class.active]="activePreset() === preset.value"
                    (click)="setDatePreset(preset.value)">
                    {{ preset.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Custom Date Range -->
            @if (activePreset() === 'custom') {
              <div class="filter-group date-inputs">
                <label>Custom Range</label>
                <div class="date-range">
                  <input
                    type="date"
                    [ngModel]="filter().startDate"
                    (ngModelChange)="updateFilter('startDate', $event)"
                    class="date-input"
                  />
                  <span class="date-separator">to</span>
                  <input
                    type="date"
                    [ngModel]="filter().endDate"
                    (ngModelChange)="updateFilter('endDate', $event)"
                    class="date-input"
                  />
                </div>
              </div>
            }
          </div>

          <div class="filter-row">
            <!-- Status Filter -->
            <div class="filter-group">
              <label>Booking Status</label>
              <div class="status-filters">
                @for (status of bookingStatuses; track status.value) {
                  <label class="checkbox-label" [class.checked]="isStatusSelected(status.value)">
                    <input
                      type="checkbox"
                      [checked]="isStatusSelected(status.value)"
                      (change)="toggleStatus(status.value)"
                    />
                    <span class="checkbox-custom" [style.--status-color]="status.color"></span>
                    {{ status.label }}
                  </label>
                }
              </div>
            </div>

            <!-- Revenue Range -->
            <div class="filter-group">
              <label>Revenue Range</label>
              <div class="range-inputs">
                <input
                  type="number"
                  placeholder="Min"
                  [ngModel]="filter().minRevenue"
                  (ngModelChange)="updateFilter('minRevenue', $event)"
                  class="range-input"
                />
                <span class="range-separator">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  [ngModel]="filter().maxRevenue"
                  (ngModelChange)="updateFilter('maxRevenue', $event)"
                  class="range-input"
                />
              </div>
            </div>

            <!-- Payment Status -->
            <div class="filter-group">
              <label>Payment Status</label>
              <select
                [ngModel]="filter().paymentStatus"
                (ngModelChange)="updateFilter('paymentStatus', $event)"
                class="select-input">
                <option value="">All Payments</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="REFUNDED">Refunded</option>
              </select>
            </div>

            <!-- Apply/Clear Buttons -->
            <div class="filter-actions">
              <button class="apply-btn" (click)="applyFilters()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
                Apply Filters
              </button>
              <button class="clear-btn" (click)="clearFilters()">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Clear
              </button>
            </div>
          </div>
        </div>
      </app-card>

      @if (isLoading()) {
        <div class="loading-container">
          <app-loading size="lg" text="Loading analytics..."></app-loading>
        </div>
      } @else if (stats()) {
        <!-- Key Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-card blue">
            <div class="metric-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-value">{{ stats()?.bookingStats?.totalBookings || 0 }}</span>
              <span class="metric-label">Total Bookings</span>
            </div>
            <div class="metric-trend" [class.positive]="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="19" x2="12" y2="5"/>
                <polyline points="5 12 12 5 19 12"/>
              </svg>
              {{ stats()?.bookingStats?.bookingMetrics?.pendingBookingsCount || 0 }} pending
            </div>
          </div>

          <div class="metric-card green">
            <div class="metric-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-value">{{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.totalRevenue || 0) }}</span>
              <span class="metric-label">Total Revenue</span>
            </div>
            <div class="metric-sub">
              Avg: {{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.avgRevenuePerBooking || 0) }}/booking
            </div>
          </div>

          <div class="metric-card purple">
            <div class="metric-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-value">{{ stats()?.customerStats?.totalCustomers || 0 }}</span>
              <span class="metric-label">Total Customers</span>
            </div>
            <div class="metric-sub">
              {{ stats()?.customerStats?.repeatCustomers || 0 }} repeat ({{ (stats()?.customerStats?.repeatCustomerRate || 0).toFixed(1) }}%)
            </div>
          </div>

          <div class="metric-card orange">
            <div class="metric-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-value">{{ (stats()?.feedbackStats?.overallAverageRating || 0).toFixed(1) }}</span>
              <span class="metric-label">Avg. Rating</span>
            </div>
            <div class="metric-sub">
              {{ stats()?.performanceStats?.confirmationRate?.toFixed(1) || 0 }}% confirmation rate
            </div>
          </div>

          <div class="metric-card teal">
            <div class="metric-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-value">{{ stats()?.bookingStats?.bookingMetrics?.totalGuests || 0 }}</span>
              <span class="metric-label">Total Guests</span>
            </div>
            <div class="metric-sub">
              Avg. group: {{ (stats()?.bookingStats?.bookingMetrics?.avgGroupSize || 0).toFixed(1) }}
            </div>
          </div>

          <div class="metric-card red">
            <div class="metric-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="15" y1="9" x2="9" y2="15"/>
                <line x1="9" y1="9" x2="15" y2="15"/>
              </svg>
            </div>
            <div class="metric-content">
              <span class="metric-value">{{ (stats()?.bookingStats?.bookingMetrics?.cancellationRate || 0).toFixed(1) }}%</span>
              <span class="metric-label">Cancellation Rate</span>
            </div>
            <div class="metric-sub">
              Lost: {{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.revenueMetrics?.totalLostRevenue || 0) }}
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="charts-row">
          <!-- Booking Status Distribution -->
          <app-card title="Booking Status Distribution" [showHeader]="true" class="chart-card">
            <div class="status-chart">
              @for (status of getStatusDistribution(); track status.name) {
                <div class="status-item">
                  <div class="status-header">
                    <span class="status-name">
                      <span class="status-dot" [style.background-color]="status.color"></span>
                      {{ status.name }}
                    </span>
                    <span class="status-value">{{ status.count }} ({{ status.percentage.toFixed(1) }}%)</span>
                  </div>
                  <div class="status-bar-bg">
                    <div class="status-bar" [style.width.%]="status.percentage" [style.background-color]="status.color"></div>
                  </div>
                </div>
              }
            </div>
          </app-card>

          <!-- Revenue Breakdown -->
          <app-card title="Revenue Breakdown" [showHeader]="true" class="chart-card">
            <div class="revenue-breakdown">
              <div class="revenue-item confirmed">
                <div class="revenue-header">
                  <span class="revenue-label">Confirmed Revenue</span>
                  <span class="revenue-amount">{{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.revenueMetrics?.totalConfirmedRevenue || 0) }}</span>
                </div>
                <div class="revenue-bar-bg">
                  <div class="revenue-bar" [style.width.%]="getRevenuePercentage('confirmed')"></div>
                </div>
              </div>
              <div class="revenue-item pending">
                <div class="revenue-header">
                  <span class="revenue-label">Pending Revenue</span>
                  <span class="revenue-amount">{{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.revenueMetrics?.totalPendingRevenue || 0) }}</span>
                </div>
                <div class="revenue-bar-bg">
                  <div class="revenue-bar" [style.width.%]="getRevenuePercentage('pending')"></div>
                </div>
              </div>
              <div class="revenue-item lost">
                <div class="revenue-header">
                  <span class="revenue-label">Lost Revenue</span>
                  <span class="revenue-amount">{{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.revenueMetrics?.totalLostRevenue || 0) }}</span>
                </div>
                <div class="revenue-bar-bg">
                  <div class="revenue-bar" [style.width.%]="getRevenuePercentage('lost')"></div>
                </div>
              </div>
              <div class="revenue-summary">
                <div class="summary-item">
                  <span>Highest Booking</span>
                  <strong>{{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.revenueMetrics?.highestBookingValue || 0) }}</strong>
                </div>
                <div class="summary-item">
                  <span>Lowest Booking</span>
                  <strong>{{ getCurrencySymbol() }}{{ formatNumber(stats()?.revenueStats?.revenueMetrics?.lowestBookingValue || 0) }}</strong>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Revenue Trends -->
        <app-card title="Revenue & Booking Trends" [showHeader]="true" class="trends-card">
          <div class="trends-chart">
            @if (getRevenueTrends().length > 0) {
              <div class="chart-container">
                <div class="chart-bars">
                  @for (trend of getRevenueTrends(); track trend.date) {
                    <div class="chart-bar-group" [title]="trend.date + ': ' + getCurrencySymbol() + formatNumber(trend.revenue)">
                      <div class="bar" [style.height.%]="getBarHeight(trend.revenue)"></div>
                      <span class="bar-label">{{ formatDateShort(trend.date) }}</span>
                    </div>
                  }
                </div>
                <div class="chart-legend">
                  <span class="legend-item">
                    <span class="legend-dot revenue"></span>
                    Revenue
                  </span>
                </div>
              </div>
            } @else {
              <div class="no-data">No trend data available</div>
            }
          </div>
        </app-card>

        <!-- Two Column Layout -->
        <div class="two-column-row">
          <!-- Top Destinations -->
          <app-card title="Top Destinations" [showHeader]="true">
            <div class="destinations-list">
              @for (dest of getTopDestinations(); track dest.destination; let i = $index) {
                <div class="destination-item">
                  <div class="destination-rank">{{ i + 1 }}</div>
                  <div class="destination-info">
                    <span class="destination-name">{{ dest.destination }}</span>
                    <span class="destination-stats">{{ dest.bookingCount }} bookings</span>
                  </div>
                  <div class="destination-bar">
                    <div class="bar-fill" [style.width.%]="dest.percentage"></div>
                  </div>
                  <span class="destination-percentage">{{ dest.percentage.toFixed(1) }}%</span>
                </div>
              }
              @if (getTopDestinations().length === 0) {
                <div class="no-data">No destination data available</div>
              }
            </div>
          </app-card>

          <!-- Top Customers -->
          <app-card title="Top Customers" [showHeader]="true">
            <div class="customers-list">
              @for (customer of getTopCustomers(); track customer.userId; let i = $index) {
                <div class="customer-item">
                  <div class="customer-avatar" [style.background-color]="getAvatarColor(i)">
                    {{ getInitials(customer.customerName) }}
                  </div>
                  <div class="customer-info">
                    <span class="customer-name">{{ customer.customerName }}</span>
                    <span class="customer-email">{{ customer.customerEmail }}</span>
                  </div>
                  <div class="customer-stats">
                    <span class="customer-spent">{{ getCurrencySymbol() }}{{ formatNumber(customer.totalSpent) }}</span>
                    <span class="customer-bookings">{{ customer.bookingCount }} bookings</span>
                  </div>
                  <app-badge [variant]="getCustomerBadgeVariant(customer.customerType)">
                    {{ customer.customerType }}
                  </app-badge>
                </div>
              }
              @if (getTopCustomers().length === 0) {
                <div class="no-data">No customer data available</div>
              }
            </div>
          </app-card>
        </div>

        <!-- Bookings by Time -->
        <div class="two-column-row">
          <!-- Bookings by Month -->
          <app-card title="Bookings by Month" [showHeader]="true">
            <div class="monthly-chart">
              @for (item of getBookingsByMonth(); track item.month) {
                <div class="month-item">
                  <span class="month-label">{{ item.month }}</span>
                  <div class="month-bar-bg">
                    <div class="month-bar" [style.width.%]="item.percentage"></div>
                  </div>
                  <span class="month-value">{{ item.count }}</span>
                </div>
              }
              @if (getBookingsByMonth().length === 0) {
                <div class="no-data">No monthly data available</div>
              }
            </div>
          </app-card>

          <!-- Bookings by Day of Week -->
          <app-card title="Bookings by Day of Week" [showHeader]="true">
            <div class="weekday-chart">
              @for (item of getBookingsByDayOfWeek(); track item.day) {
                <div class="weekday-item">
                  <span class="weekday-label">{{ item.day }}</span>
                  <div class="weekday-bar-bg">
                    <div class="weekday-bar" [style.width.%]="item.percentage"></div>
                  </div>
                  <span class="weekday-value">{{ item.count }}</span>
                </div>
              }
              @if (getBookingsByDayOfWeek().length === 0) {
                <div class="no-data">No day-of-week data available</div>
              }
            </div>
          </app-card>
        </div>

        <!-- Performance & Operations -->
        <div class="two-column-row">
          <!-- Package Performance -->
          <app-card title="Package Performance" [showHeader]="true">
            <div class="performance-list">
              <div class="performance-section">
                <h4 class="section-title positive">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                  Top Performing
                </h4>
                @for (pkg of stats()?.performanceStats?.topPerformingPackages || []; track pkg) {
                  <div class="performance-item positive">
                    <span>{{ pkg }}</span>
                    <span class="performance-score">{{ (stats()?.performanceStats?.packagePerformance?.[pkg] || 0).toFixed(1) }}%</span>
                  </div>
                }
              </div>
              <div class="performance-section">
                <h4 class="section-title negative">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                    <polyline points="17 18 23 18 23 12"/>
                  </svg>
                  Needs Attention
                </h4>
                @for (pkg of stats()?.performanceStats?.underPerformingPackages || []; track pkg) {
                  <div class="performance-item negative">
                    <span>{{ pkg }}</span>
                    <span class="performance-score">{{ (stats()?.performanceStats?.packagePerformance?.[pkg] || 0).toFixed(1) }}%</span>
                  </div>
                }
              </div>
            </div>
          </app-card>

          <!-- Operational Metrics -->
          <app-card title="Operational Insights" [showHeader]="true">
            <div class="operations-grid">
              <div class="op-stat">
                <div class="op-icon clock">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="op-content">
                  <span class="op-value">{{ stats()?.operationalStats?.avgResponseTime || 24 }}h</span>
                  <span class="op-label">Avg Response Time</span>
                </div>
              </div>
              <div class="op-stat">
                <div class="op-icon calendar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div class="op-content">
                  <span class="op-value">{{ stats()?.operationalStats?.peakBookingDay || 'N/A' }}</span>
                  <span class="op-label">Peak Booking Day</span>
                </div>
              </div>
              <div class="op-stat">
                <div class="op-icon month">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <div class="op-content">
                  <span class="op-value">{{ stats()?.operationalStats?.peakBookingMonth || 'N/A' }}</span>
                  <span class="op-label">Peak Month</span>
                </div>
              </div>
              <div class="op-stat">
                <div class="op-icon package">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div class="op-content">
                  <span class="op-value">{{ stats()?.operationalStats?.activePackages || 0 }} / {{ stats()?.operationalStats?.totalPackagesOffered || 0 }}</span>
                  <span class="op-label">Active Packages</span>
                </div>
              </div>
            </div>
          </app-card>
        </div>

        <!-- Recent Bookings Table -->
        <app-card title="Recent Bookings" [showHeader]="true" class="recent-bookings-card">
          <div class="bookings-table-wrapper">
            <table class="bookings-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Customer</th>
                  <th>Package</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Payment</th>
                </tr>
              </thead>
              <tbody>
                @for (booking of getRecentBookings(); track booking.bookingId) {
                  <tr>
                    <td class="ref-cell">{{ booking.bookingReference }}</td>
                    <td class="customer-cell">
                      <span class="customer-name">{{ booking.customerName }}</span>
                      <span class="customer-email">{{ booking.customerEmail }}</span>
                    </td>
                    <td class="package-cell">{{ truncate(booking.travelPackageTitle, 30) }}</td>
                    <td class="date-cell">{{ formatDate(booking.bookingDate) }}</td>
                    <td class="amount-cell">{{ getCurrencySymbol() }}{{ formatNumber(booking.totalPrice) }}</td>
                    <td>
                      <app-badge [variant]="getStatusVariant(booking.status)">
                        {{ booking.status }}
                      </app-badge>
                    </td>
                    <td>
                      <app-badge [variant]="getPaymentVariant(booking.paymentStatus)">
                        {{ booking.paymentStatus }}
                      </app-badge>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
          @if (getRecentBookings().length === 0) {
            <div class="no-data">No recent bookings</div>
          }
        </app-card>
      } @else {
        <div class="error-state">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h3>Unable to load analytics</h3>
          <p>Please try refreshing the page or check your connection.</p>
          <button class="retry-btn" (click)="loadStatistics()">Try Again</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .analytics-page {
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .header-content h1 {
      font-size: 28px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 4px 0;
    }

    .header-content p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .refresh-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s;
    }

    .refresh-btn:hover:not(:disabled) {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .refresh-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .refresh-btn svg.spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Filters Section */
    .filters-card {
      margin-bottom: 24px;
    }

    .filters-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      align-items: flex-end;
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .filter-group label {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .date-presets {
      flex: 1;
    }

    .preset-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    .preset-btn {
      padding: 8px 14px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 13px;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s;
    }

    .preset-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .preset-btn.active {
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border-color: transparent;
      color: white;
    }

    .date-range {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .date-input {
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 13px;
      color: #374151;
      background: #fff;
    }

    .date-input:focus {
      outline: none;
      border-color: #FF4E78;
      box-shadow: 0 0 0 3px rgba(255, 78, 120, 0.1);
    }

    .date-separator {
      color: #9ca3af;
      font-size: 13px;
    }

    .status-filters {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #6b7280;
      cursor: pointer;
    }

    .checkbox-label input {
      display: none;
    }

    .checkbox-custom {
      width: 18px;
      height: 18px;
      border: 2px solid #d1d5db;
      border-radius: 4px;
      position: relative;
      transition: all 0.15s;
    }

    .checkbox-label.checked .checkbox-custom {
      background-color: var(--status-color, #FF4E78);
      border-color: var(--status-color, #FF4E78);
    }

    .checkbox-label.checked .checkbox-custom::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .checkbox-label:hover .checkbox-custom {
      border-color: var(--status-color, #FF4E78);
    }

    .range-inputs {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .range-input {
      width: 100px;
      padding: 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 13px;
      color: #374151;
      background: #fff;
    }

    .range-input:focus {
      outline: none;
      border-color: #FF4E78;
      box-shadow: 0 0 0 3px rgba(255, 78, 120, 0.1);
    }

    .range-input::placeholder {
      color: #9ca3af;
    }

    .range-separator {
      color: #9ca3af;
    }

    .select-input {
      padding: 8px 32px 8px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 13px;
      color: #374151;
      background: #fff;
      cursor: pointer;
      min-width: 140px;
    }

    .select-input:focus {
      outline: none;
      border-color: #FF4E78;
      box-shadow: 0 0 0 3px rgba(255, 78, 120, 0.1);
    }

    .filter-actions {
      display: flex;
      gap: 8px;
      margin-left: auto;
    }

    .apply-btn, .clear-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;
    }

    .apply-btn {
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border: none;
      color: white;
    }

    .apply-btn:hover {
      opacity: 0.9;
    }

    .clear-btn {
      background: transparent;
      border: 1px solid #e5e7eb;
      color: #6b7280;
    }

    .clear-btn:hover {
      background: #f9fafb;
      color: #374151;
    }

    /* Loading */
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 48px;
    }

    /* Metrics Grid */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 1400px) {
      .metrics-grid { grid-template-columns: repeat(3, 1fr); }
    }

    @media (max-width: 900px) {
      .metrics-grid { grid-template-columns: repeat(2, 1fr); }
    }

    @media (max-width: 600px) {
      .metrics-grid { grid-template-columns: 1fr; }
    }

    .metric-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      transition: all 0.15s;
    }

    .metric-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .metric-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .metric-card.blue .metric-icon { background: #dbeafe; color: #2563eb; }
    .metric-card.green .metric-icon { background: #dcfce7; color: #16a34a; }
    .metric-card.purple .metric-icon { background: #f3e8ff; color: #9333ea; }
    .metric-card.orange .metric-icon { background: #fef3c7; color: #d97706; }
    .metric-card.teal .metric-icon { background: #ccfbf1; color: #0d9488; }
    .metric-card.red .metric-icon { background: #fee2e2; color: #dc2626; }

    .metric-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .metric-value {
      font-size: 26px;
      font-weight: 700;
      color: #111827;
    }

    .metric-label {
      font-size: 13px;
      color: #6b7280;
    }

    .metric-trend, .metric-sub {
      font-size: 12px;
      color: #9ca3af;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .metric-trend.positive {
      color: #16a34a;
    }

    /* Charts Row */
    .charts-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 900px) {
      .charts-row { grid-template-columns: 1fr; }
    }

    .chart-card {
      min-height: 300px;
    }

    .status-chart {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .status-item .status-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .status-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #374151;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .status-value {
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
    }

    .status-bar-bg {
      height: 10px;
      background: #f3f4f6;
      border-radius: 5px;
      overflow: hidden;
    }

    .status-bar {
      height: 100%;
      border-radius: 5px;
      transition: width 0.5s ease;
    }

    .revenue-breakdown {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .revenue-item .revenue-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .revenue-label {
      font-size: 13px;
      color: #374151;
    }

    .revenue-amount {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .revenue-bar-bg {
      height: 10px;
      background: #f3f4f6;
      border-radius: 5px;
      overflow: hidden;
    }

    .revenue-bar {
      height: 100%;
      border-radius: 5px;
      transition: width 0.5s ease;
    }

    .revenue-item.confirmed .revenue-bar { background: linear-gradient(90deg, #22c55e, #16a34a); }
    .revenue-item.pending .revenue-bar { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
    .revenue-item.lost .revenue-bar { background: #9ca3af; }

    .revenue-summary {
      display: flex;
      gap: 24px;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;
      margin-top: 8px;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .summary-item span {
      font-size: 11px;
      color: #9ca3af;
    }

    .summary-item strong {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    /* Trends Chart */
    .trends-card {
      margin-bottom: 24px;
    }

    .trends-chart {
      height: 200px;
    }

    .chart-container {
      height: 100%;
      display: flex;
      flex-direction: column;
    }

    .chart-bars {
      flex: 1;
      display: flex;
      align-items: flex-end;
      gap: 4px;
      padding-bottom: 16px;
    }

    .chart-bar-group {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      min-width: 20px;
    }

    .chart-bar-group .bar {
      width: 100%;
      max-width: 40px;
      background: linear-gradient(180deg, #FF9370, #FF4E78);
      border-radius: 4px 4px 0 0;
      min-height: 4px;
      transition: height 0.3s ease;
    }

    .chart-bar-group .bar-label {
      font-size: 10px;
      color: #9ca3af;
      white-space: nowrap;
      transform: rotate(-45deg);
      transform-origin: top left;
    }

    .chart-legend {
      display: flex;
      justify-content: center;
      gap: 24px;
      padding-top: 8px;
      border-top: 1px solid #f3f4f6;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #6b7280;
    }

    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }

    .legend-dot.revenue {
      background: linear-gradient(135deg, #FF9370, #FF4E78);
    }

    /* Two Column Row */
    .two-column-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }

    @media (max-width: 900px) {
      .two-column-row { grid-template-columns: 1fr; }
    }

    /* Destinations List */
    .destinations-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .destination-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .destination-rank {
      width: 26px;
      height: 26px;
      background: #f3f4f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
    }

    .destination-info {
      flex: 1;
      min-width: 0;
    }

    .destination-name {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .destination-stats {
      font-size: 11px;
      color: #9ca3af;
    }

    .destination-bar {
      width: 60px;
      height: 6px;
      background: #f3f4f6;
      border-radius: 3px;
      overflow: hidden;
    }

    .destination-bar .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #FF9370, #FF4E78);
      border-radius: 3px;
    }

    .destination-percentage {
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      min-width: 45px;
      text-align: right;
    }

    /* Customers List */
    .customers-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .customer-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .customer-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      color: white;
    }

    .customer-info {
      flex: 1;
      min-width: 0;
    }

    .customer-info .customer-name {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #111827;
    }

    .customer-info .customer-email {
      font-size: 11px;
      color: #9ca3af;
    }

    .customer-stats {
      text-align: right;
    }

    .customer-stats .customer-spent {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .customer-stats .customer-bookings {
      font-size: 11px;
      color: #9ca3af;
    }

    /* Monthly Chart */
    .monthly-chart, .weekday-chart {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .month-item, .weekday-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .month-label, .weekday-label {
      width: 70px;
      font-size: 13px;
      color: #6b7280;
    }

    .month-bar-bg, .weekday-bar-bg {
      flex: 1;
      height: 8px;
      background: #f3f4f6;
      border-radius: 4px;
      overflow: hidden;
    }

    .month-bar, .weekday-bar {
      height: 100%;
      background: linear-gradient(90deg, #FF9370, #FF4E78);
      border-radius: 4px;
      transition: width 0.3s ease;
    }

    .month-value, .weekday-value {
      width: 30px;
      font-size: 13px;
      font-weight: 500;
      color: #111827;
      text-align: right;
    }

    /* Performance List */
    .performance-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .section-title.positive { color: #16a34a; }
    .section-title.negative { color: #dc2626; }

    .performance-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: #f9fafb;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 6px;
    }

    .performance-item span {
      color: #374151;
    }

    .performance-score {
      font-weight: 600;
    }

    .performance-item.positive .performance-score { color: #16a34a; }
    .performance-item.negative .performance-score { color: #dc2626; }

    /* Operations Grid */
    .operations-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .op-stat {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      background: #f9fafb;
      border-radius: 10px;
    }

    .op-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .op-icon.clock { background: #fef3c7; color: #d97706; }
    .op-icon.calendar { background: #dbeafe; color: #2563eb; }
    .op-icon.month { background: #dcfce7; color: #16a34a; }
    .op-icon.package { background: #f3e8ff; color: #9333ea; }

    .op-content {
      display: flex;
      flex-direction: column;
    }

    .op-value {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .op-label {
      font-size: 11px;
      color: #9ca3af;
    }

    /* Recent Bookings Table */
    .recent-bookings-card {
      margin-bottom: 24px;
    }

    .bookings-table-wrapper {
      overflow-x: auto;
    }

    .bookings-table {
      width: 100%;
      border-collapse: collapse;
    }

    .bookings-table th, .bookings-table td {
      padding: 12px 14px;
      text-align: left;
      font-size: 13px;
    }

    .bookings-table th {
      background: #f9fafb;
      color: #6b7280;
      font-weight: 500;
      border-bottom: 1px solid #e5e7eb;
    }

    .bookings-table td {
      border-bottom: 1px solid #f3f4f6;
      color: #374151;
    }

    .bookings-table tr:hover td {
      background: #f9fafb;
    }

    .bookings-table .ref-cell {
      font-family: monospace;
      font-size: 12px;
      color: #FF4E78;
    }

    .bookings-table .customer-cell .customer-name {
      display: block;
      font-weight: 500;
      color: #111827;
    }

    .bookings-table .customer-cell .customer-email {
      font-size: 11px;
      color: #9ca3af;
    }

    .bookings-table .package-cell {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .bookings-table .date-cell {
      white-space: nowrap;
    }

    .bookings-table .amount-cell {
      font-weight: 600;
      color: #111827;
    }

    /* No Data */
    .no-data {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 32px;
      color: #9ca3af;
      font-size: 13px;
    }

    /* Error State */
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 48px;
      text-align: center;
    }

    .error-state svg {
      color: #9ca3af;
      margin-bottom: 16px;
    }

    .error-state h3 {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .error-state p {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 20px 0;
    }

    .retry-btn {
      padding: 10px 20px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
    }

    .retry-btn:hover {
      opacity: 0.9;
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private statisticsService = inject(StatisticsService);

  isLoading = signal(true);
  stats = signal<AgencyStatistics | null>(null);
  filter = signal<StatisticsFilter>({});
  activePreset = signal<DatePreset>('all');

  datePresets = [
    { value: 'today' as DatePreset, label: 'Today' },
    { value: 'week' as DatePreset, label: 'This Week' },
    { value: 'month' as DatePreset, label: 'This Month' },
    { value: 'quarter' as DatePreset, label: 'This Quarter' },
    { value: 'year' as DatePreset, label: 'This Year' },
    { value: 'all' as DatePreset, label: 'All Time' },
    { value: 'custom' as DatePreset, label: 'Custom' }
  ];

  bookingStatuses = [
    { value: 'PENDING', label: 'Pending', color: '#ff9800' },
    { value: 'ACCEPTED', label: 'Accepted', color: '#2196f3' },
    { value: 'FINISHED', label: 'Finished', color: '#4caf50' },
    { value: 'CANCELLED', label: 'Cancelled', color: '#f44336' }
  ];

  private statusColors: Record<string, string> = {
    'PENDING': '#ff9800',
    'ACCEPTED': '#2196f3',
    'FINISHED': '#4caf50',
    'COMPLETED': '#4caf50',
    'CANCELLED': '#f44336'
  };

  private avatarColors = ['#2196f3', '#9333ea', '#16a34a', '#d97706', '#dc2626', '#0891b2'];

  ngOnInit(): void {
    this.loadStatistics();
  }

  loadStatistics(): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) return;

    this.isLoading.set(true);

    const currentFilter = this.filter();
    const hasFilters = currentFilter.startDate || currentFilter.endDate ||
      (currentFilter.status && currentFilter.status.length > 0) ||
      currentFilter.minRevenue !== undefined || currentFilter.maxRevenue !== undefined ||
      currentFilter.paymentStatus;

    this.statisticsService.getAgencyStatistics(agency.id, hasFilters ? currentFilter : undefined).subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.isLoading.set(false);
      },
      error: () => {
        this.stats.set(null);
        this.isLoading.set(false);
      }
    });
  }

  setDatePreset(preset: DatePreset): void {
    this.activePreset.set(preset);

    const today = new Date();
    let startDate: string | undefined;
    let endDate: string | undefined = this.formatDateForInput(today);

    switch (preset) {
      case 'today':
        startDate = endDate;
        break;
      case 'week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - 7);
        startDate = this.formatDateForInput(weekStart);
        break;
      case 'month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        startDate = this.formatDateForInput(monthStart);
        break;
      case 'quarter':
        const quarterStart = new Date(today);
        quarterStart.setMonth(today.getMonth() - 3);
        startDate = this.formatDateForInput(quarterStart);
        break;
      case 'year':
        const yearStart = new Date(today.getFullYear(), 0, 1);
        startDate = this.formatDateForInput(yearStart);
        break;
      case 'all':
        startDate = undefined;
        endDate = undefined;
        break;
      case 'custom':
        return;
    }

    this.filter.update(f => ({ ...f, startDate, endDate }));
  }

  updateFilter(key: keyof StatisticsFilter, value: any): void {
    this.filter.update(f => ({ ...f, [key]: value || undefined }));
  }

  isStatusSelected(status: string): boolean {
    return this.filter().status?.includes(status) || false;
  }

  toggleStatus(status: string): void {
    this.filter.update(f => {
      const currentStatus = f.status || [];
      const newStatus = currentStatus.includes(status)
        ? currentStatus.filter(s => s !== status)
        : [...currentStatus, status];
      return { ...f, status: newStatus.length > 0 ? newStatus : undefined };
    });
  }

  applyFilters(): void {
    this.loadStatistics();
  }

  clearFilters(): void {
    this.filter.set({});
    this.activePreset.set('all');
    this.loadStatistics();
  }

  getStatusDistribution(): { name: string; count: number; percentage: number; color: string }[] {
    const distribution = this.stats()?.bookingStats?.statusDistribution || {};
    const total = this.stats()?.bookingStats?.totalBookings || 1;

    return Object.entries(distribution).map(([name, count]) => ({
      name,
      count,
      percentage: (count / total) * 100,
      color: this.statusColors[name] || '#9e9e9e'
    }));
  }

  getRevenuePercentage(type: 'confirmed' | 'pending' | 'lost'): number {
    const metrics = this.stats()?.revenueStats?.revenueMetrics;
    const total = this.stats()?.revenueStats?.totalRevenue || 1;

    switch (type) {
      case 'confirmed':
        return ((metrics?.totalConfirmedRevenue || 0) / total) * 100;
      case 'pending':
        return ((metrics?.totalPendingRevenue || 0) / total) * 100;
      case 'lost':
        return ((metrics?.totalLostRevenue || 0) / total) * 100;
    }
  }

  getRevenueTrends(): RevenueTrend[] {
    return this.stats()?.revenueStats?.revenueTrends || [];
  }

  getBarHeight(value: number): number {
    const trends = this.getRevenueTrends();
    const maxValue = Math.max(...trends.map(t => t.revenue), 1);
    return (value / maxValue) * 100;
  }

  getTopDestinations(): DestinationStats[] {
    return (this.stats()?.bookingStats?.topDestinations || []).slice(0, 5);
  }

  getTopCustomers(): TopCustomer[] {
    return (this.stats()?.revenueStats?.topCustomers || []).slice(0, 5);
  }

  getBookingsByMonth(): { month: string; count: number; percentage: number }[] {
    const byMonth = this.stats()?.bookingStats?.bookingMetrics?.bookingsByMonth || {};
    const entries = Object.entries(byMonth);
    const maxCount = Math.max(...entries.map(([, c]) => c), 1);

    return entries.map(([month, count]) => ({
      month: this.formatMonth(month),
      count,
      percentage: (count / maxCount) * 100
    })).slice(-6);
  }

  getBookingsByDayOfWeek(): { day: string; count: number; percentage: number }[] {
    const byDay = this.stats()?.bookingStats?.bookingMetrics?.bookingsByDayOfWeek || {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const maxCount = Math.max(...Object.values(byDay), 1);

    return days.map(day => ({
      day: day.slice(0, 3),
      count: byDay[day] || 0,
      percentage: ((byDay[day] || 0) / maxCount) * 100
    }));
  }

  getRecentBookings(): BookingDetail[] {
    return (this.stats()?.bookingStats?.recentBookings || []).slice(0, 10);
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
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatDateShort(dateStr: string): string {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  formatMonth(monthStr: string): string {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'short' });
  }

  formatDateForInput(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatarColor(index: number): string {
    return this.avatarColors[index % this.avatarColors.length];
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

  getPaymentVariant(status: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' {
    const variants: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
      'PAID': 'success',
      'PENDING': 'warning',
      'REFUNDED': 'danger'
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
