import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CardComponent, ButtonComponent, BadgeComponent, PaginationComponent, LoadingComponent, EmptyStateComponent, ModalComponent, AvatarComponent, ToastService } from '@workspace/shared-ui';
import { BookingService, AgencyService, StatisticsService, TravelPackageService } from '@workspace/core';
import { Booking, BookingStatus, AgencyStatistics, BookingDetail } from '@workspace/core';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    BadgeComponent,
    PaginationComponent,
    LoadingComponent,
    EmptyStateComponent,
    ModalComponent,
    AvatarComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bookings-page">
      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card">
          <div class="stat-icon blue">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ getPendingCount() }}</span>
            <span class="stat-label">Pending Bookings</span>
          </div>
          <span class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            </svg>
            +12%
          </span>
        </div>

        <div class="stat-card">
          <div class="stat-icon orange">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ getTotalCount() }}</span>
            <span class="stat-label">Total Bookings</span>
          </div>
          <span class="stat-trend negative">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
            </svg>
            -3%
          </span>
        </div>

        <div class="stat-card">
          <div class="stat-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ getApprovedCount() }}</span>
            <span class="stat-label">Confirmed</span>
          </div>
          <span class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            </svg>
            +8%
          </span>
        </div>

        <div class="stat-card">
          <div class="stat-icon green-solid">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="stat-content">
            <span class="stat-value">{{ formatCurrencyShort(getTotalRevenue()) }}</span>
            <span class="stat-label">Total Revenue</span>
          </div>
          <span class="stat-trend positive">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
            </svg>
            +15%
          </span>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-left">
          <div class="filter-select">
            <select [(ngModel)]="statusFilter">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="filter-select">
            <select [(ngModel)]="packageFilter">
              <option value="all">All Packages</option>
            </select>
          </div>
          <div class="filter-select">
            <select [(ngModel)]="dateFilter">
              <option value="30">Last 30 Days</option>
              <option value="7">Last 7 Days</option>
              <option value="90">Last 90 Days</option>
            </select>
          </div>
          <div class="filter-select">
            <select [(ngModel)]="sortOrder">
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        <button class="btn-export">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          Export
        </button>
      </div>

      @if (isLoading()) {
        <div class="loading-state">
          <app-loading size="lg" text="Loading bookings..."></app-loading>
        </div>
      } @else {
        <!-- Bookings Table -->
        <div class="table-container">
          <table class="bookings-table">
            <thead>
              <tr>
                <th class="th-id">#</th>
                <th class="th-guest">Guest</th>
                <th class="th-package">Package</th>
                <th class="th-date">Date</th>
                <th class="th-travelers">Travelers</th>
                <th class="th-price">Price</th>
                <th class="th-status">Status</th>
                <th class="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (booking of paginatedBookings(); track booking.id; let i = $index) {
                <tr class="clickable-row" (click)="viewBooking(booking)">
                  <td class="td-id">BK-{{ getRowNumber(i) }}</td>
                  <td class="td-guest">
                    <div class="guest-cell">
                      <div class="avatar" [style.background]="getAvatarGradient(booking.contactName)">
                        {{ getInitials(booking.contactName) }}
                      </div>
                      <div class="guest-info">
                        <span class="guest-name">{{ booking.contactName }}</span>
                        <span class="guest-email">{{ booking.contactEmail }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="td-package">
                    <div class="package-cell">
                      <div class="package-image" [style.background-image]="'url(' + getPackageImage(booking) + ')'"></div>
                      <div class="package-info">
                        <span class="package-name">{{ booking.travelPackage?.title || 'Travel Package' }}</span>
                        <span class="package-dest">{{ getDestinations(booking) }}</span>
                      </div>
                    </div>
                  </td>
                  <td class="td-date">{{ formatDate(booking.travelPackage?.startDate) }}</td>
                  <td class="td-travelers">
                    <div class="travelers-cell">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                      </svg>
                      {{ getTotalTravelers(booking) }}
                    </div>
                  </td>
                  <td class="td-price">{{ formatCurrency(booking.totalPrice || 0, booking.totalPriceCurrency) }}</td>
                  <td class="td-status">
                    <span class="status-badge" [class]="getStatusClass(booking)">{{ getStatusLabel(booking) }}</span>
                  </td>
                  <td class="td-actions" (click)="$event.stopPropagation()">
                    <div class="actions-wrapper">
                      <button class="btn-action view" (click)="viewBooking(booking)">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                        View
                      </button>
                      @if (isPending(booking)) {
                        <div class="actions-stack">
                          <button class="btn-action approve" (click)="acceptBooking(booking)" [disabled]="isProcessing()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Approve
                          </button>
                          <button class="btn-action reject" (click)="openCancelModal(booking)" [disabled]="isProcessing()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                            Reject
                          </button>
                        </div>
                      }
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-row">
          <span class="pagination-info">Showing {{ getShowingStart() }}-{{ getShowingEnd() }} of {{ filteredBookings().length }} Bookings</span>
          <div class="pagination-controls">
            <button class="page-btn" [disabled]="currentPage() === 1" (click)="prevPage()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            @for (page of getPageNumbers(); track page) {
              <button class="page-btn" [class.active]="currentPage() === page" (click)="goToPage(page)">{{ page }}</button>
            }
            <button class="page-btn" [disabled]="currentPage() === getTotalPages()" (click)="nextPage()">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Bottom Section -->
        <div class="bottom-section">
          <!-- Recent Activity -->
          <div class="bottom-card">
            <div class="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div class="activity-list">
              @for (activity of getRecentActivity(); track activity.id) {
                <div class="activity-item">
                  <span class="activity-dot" [class]="activity.type"></span>
                  <div class="activity-content">
                    <span class="activity-text">{{ activity.text }}</span>
                    <span class="activity-time">{{ activity.time }}</span>
                  </div>
                </div>
              }
              @if (getRecentActivity().length === 0) {
                <div class="empty-message">No recent activity</div>
              }
            </div>
          </div>

          <!-- Top Packages -->
          <div class="bottom-card">
            <div class="card-header">
              <h3>Top Packages</h3>
            </div>
            <div class="packages-list">
              @for (pkg of getTopPackages(); track pkg.name) {
                <div class="package-item">
                  <div class="package-thumb" [style.background-image]="'url(' + pkg.image + ')'"></div>
                  <div class="package-details">
                    <span class="pkg-name">{{ pkg.name }}</span>
                    <span class="pkg-bookings">{{ pkg.bookings }} Bookings</span>
                  </div>
                </div>
              }
              @if (getTopPackages().length === 0) {
                <div class="empty-message">No packages yet</div>
              }
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bottom-card">
            <div class="card-header">
              <h3>Quick Stats</h3>
            </div>
            <div class="quick-stats">
              <div class="quick-stat-item">
                <div class="stat-row">
                  <span class="stat-name">Total Bookings</span>
                  <span class="stat-num">{{ getTotalCount() }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill blue" style="width: 100%"></div>
                </div>
              </div>
              <div class="quick-stat-item">
                <div class="stat-row">
                  <span class="stat-name">Confirmed</span>
                  <span class="stat-num green">{{ getApprovedCount() }}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill green" [style.width.%]="getApprovedPercentage()"></div>
                </div>
              </div>
              <div class="quick-stat-item">
                <div class="stat-row">
                  <span class="stat-name">Total Revenue</span>
                  <span class="stat-num">{{ formatCurrencyShort(getTotalRevenue()) }}</span>
                </div>
              </div>
              <div class="quick-stat-item">
                <div class="stat-row">
                  <span class="stat-name">Avg. Booking</span>
                  <span class="stat-num red">{{ formatCurrencyShort(getAverageBooking()) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        @if (filteredBookings().length === 0) {
          <div class="empty-state">
            <app-empty-state
              title="No bookings found"
              [description]="searchQuery ? 'Try adjusting your search or filters' : 'You haven\\'t received any bookings yet'"
            ></app-empty-state>
          </div>
        }
      }
    </div>

    <!-- Reject Modal -->
    <app-modal [isOpen]="showCancelModal()" title="Reject Booking" size="sm" [showFooter]="true" (closed)="closeCancelModal()">
      <p>Are you sure you want to reject this booking for <strong>{{ bookingToCancel()?.contactName }}</strong>?</p>
      <p class="modal-sub">The customer will be notified about this decision.</p>
      <div modal-footer>
        <app-button variant="ghost" (onClick)="closeCancelModal()">Cancel</app-button>
        <app-button variant="danger" [loading]="isProcessing()" (onClick)="cancelBooking()">Reject Booking</app-button>
      </div>
    </app-modal>

    <!-- View Modal -->
    <app-modal [isOpen]="showViewModal()" title="Booking Details" size="md" [showFooter]="false" (closed)="closeViewModal()">
      @if (selectedBooking()) {
        <div class="modal-content">
          <div class="modal-section">
            <h4>Customer Information</h4>
            <div class="info-row"><span>Name</span><span>{{ selectedBooking()!.contactName }}</span></div>
            <div class="info-row"><span>Email</span><span>{{ selectedBooking()!.contactEmail }}</span></div>
            <div class="info-row"><span>Phone</span><span>{{ selectedBooking()!.contactPhone }}</span></div>
          </div>
          <div class="modal-section">
            <h4>Booking Information</h4>
            <div class="info-row"><span>Reference</span><span># {{ selectedBooking()!.bookingReference || getBookingRef(selectedBooking()!) }}</span></div>
            <div class="info-row"><span>Package</span><span>{{ selectedBooking()!.travelPackage?.title || 'N/A' }}</span></div>
            <div class="info-row"><span>Travelers</span><span>{{ getTravelersText(selectedBooking()!) }}</span></div>
            <div class="info-row"><span>Total Price</span><span class="green">{{ formatCurrency(selectedBooking()!.totalPrice || 0, selectedBooking()!.totalPriceCurrency) }}</span></div>
          </div>
        </div>
      }
    </app-modal>
  `,
  styles: [`
    .bookings-page { display: flex; flex-direction: column; gap: 20px; }

    /* Stats Row */
    .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    @media (max-width: 1000px) { .stats-row { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 500px) { .stats-row { grid-template-columns: 1fr; } }

    .stat-card {
      display: flex; align-items: center; gap: 14px;
      padding: 18px 20px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; position: relative;
    }
    .stat-icon {
      width: 44px; height: 44px; border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      &.blue { background: #dbeafe; color: #2563eb; }
      &.orange { background: #ffedd5; color: #ea580c; }
      &.green { background: #dcfce7; color: #16a34a; }
      &.green-solid { background: #16a34a; color: #fff; }
    }
    .stat-content { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .stat-value { font-size: 24px; font-weight: 700; color: #111827; }
    .stat-label { font-size: 13px; color: #6b7280; }
    .stat-trend {
      display: flex; align-items: center; gap: 3px;
      font-size: 12px; font-weight: 500;
      &.positive { color: #16a34a; }
      &.negative { color: #dc2626; }
    }

    /* Filter Bar */
    .filter-bar {
      display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;
      padding: 14px 18px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
    }
    .filter-left { display: flex; gap: 10px; flex-wrap: wrap; }
    .filter-select select {
      padding: 8px 32px 8px 12px; background: #fff; border: 1px solid #e5e7eb; border-radius: 8px;
      font-size: 13px; color: #374151; cursor: pointer; appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 10px center;
      &:hover { border-color: #d1d5db; }
    }
    .btn-export {
      display: flex; align-items: center; gap: 6px;
      padding: 9px 16px; background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%); border: none; border-radius: 8px;
      font-size: 13px; font-weight: 500; color: #fff; cursor: pointer;
      &:hover { opacity: 0.9; }
    }

    .loading-state { display: flex; justify-content: center; padding: 60px; background: #fff; border-radius: 12px; }

    /* Table */
    .table-container {
      background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;
    }
    .bookings-table { width: 100%; border-collapse: collapse; }
    .bookings-table th {
      padding: 14px 16px; text-align: left; font-size: 12px; font-weight: 600; color: #6b7280;
      background: #f9fafb; border-bottom: 1px solid #e5e7eb; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .bookings-table td {
      padding: 14px 16px; border-bottom: 1px solid #f3f4f6; font-size: 13px; color: #374151;
    }
    .bookings-table tr:last-child td { border-bottom: none; }
    .bookings-table tr:hover { background: #f9fafb; }
    .bookings-table tr.clickable-row { cursor: pointer; }

    .th-id { width: 80px; }
    .th-guest { width: 200px; }
    .th-package { width: 220px; }
    .th-date { width: 120px; }
    .th-travelers { width: 90px; }
    .th-price { width: 100px; }
    .th-status { width: 100px; }
    .th-actions { width: 200px; }

    .td-id { font-family: monospace; font-size: 12px; color: #9ca3af; }

    .guest-cell { display: flex; align-items: center; gap: 10px; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 12px; font-weight: 600; color: #fff; flex-shrink: 0;
    }
    .guest-info { display: flex; flex-direction: column; }
    .guest-name { font-weight: 600; color: #111827; font-size: 13px; }
    .guest-email { font-size: 11px; color: #9ca3af; }

    .package-cell { display: flex; align-items: center; gap: 10px; }
    .package-image {
      width: 44px; height: 44px; border-radius: 8px; flex-shrink: 0;
      background-size: cover; background-position: center; background-color: #f3f4f6;
    }
    .package-info { display: flex; flex-direction: column; }
    .package-name { font-weight: 600; color: #111827; font-size: 13px; }
    .package-dest { font-size: 11px; color: #9ca3af; }

    .travelers-cell { display: flex; align-items: center; gap: 6px; color: #6b7280; }

    .td-price { font-weight: 600; color: #111827; }

    .status-badge {
      display: inline-block; padding: 4px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 500;
      &.pending { background: #fef3c7; color: #b45309; }
      &.confirmed { background: #dcfce7; color: #16a34a; }
      &.cancelled { background: #fee2e2; color: #dc2626; }
    }

    .td-actions { vertical-align: middle; }
    .actions-wrapper { display: flex; gap: 16px; align-items: center; }
    .actions-stack { display: flex; flex-direction: column; gap: 6px; }
    .actions-stack .btn-action { min-width: 90px; justify-content: center; }
    .btn-action {
      padding: 6px 12px; border-radius: 6px; border: none;
      display: flex; align-items: center; gap: 4px; cursor: pointer;
      font-size: 12px; font-weight: 500; white-space: nowrap;
      &.approve { background: #16a34a; color: #fff; &:hover { background: #15803d; } }
      &.reject { background: #dc2626; color: #fff; &:hover { background: #b91c1c; } }
      &.view { background: #f3f4f6; color: #6b7280; &:hover { background: #e5e7eb; } }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    /* Pagination */
    .pagination-row {
      display: flex; justify-content: space-between; align-items: center;
      padding: 14px 18px; background: #fff; border: 1px solid #e5e7eb; border-radius: 12px;
    }
    .pagination-info { font-size: 13px; color: #6b7280; }
    .pagination-controls { display: flex; gap: 4px; }
    .page-btn {
      min-width: 32px; height: 32px; padding: 0 8px;
      border: 1px solid #e5e7eb; border-radius: 6px; background: #fff;
      font-size: 13px; color: #374151; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      &:hover:not(:disabled) { background: #f9fafb; }
      &.active { background: #FF4E78; border-color: #FF4E78; color: #fff; }
      &:disabled { opacity: 0.4; cursor: not-allowed; }
    }

    /* Bottom Section */
    .bottom-section { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
    @media (max-width: 1000px) { .bottom-section { grid-template-columns: 1fr; } }

    .bottom-card {
      background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 18px;
    }
    .card-header { margin-bottom: 16px; }
    .card-header h3 { font-size: 15px; font-weight: 600; color: #111827; margin: 0; }

    /* Activity List */
    .activity-list { display: flex; flex-direction: column; gap: 14px; }
    .activity-item { display: flex; gap: 10px; }
    .activity-dot {
      width: 8px; height: 8px; border-radius: 50%; margin-top: 5px; flex-shrink: 0;
      &.approved { background: #16a34a; }
      &.pending { background: #f59e0b; }
      &.cancelled { background: #dc2626; }
      &.completed { background: #3b82f6; }
    }
    .activity-content { display: flex; flex-direction: column; gap: 2px; }
    .activity-text { font-size: 13px; color: #374151; }
    .activity-time { font-size: 11px; color: #9ca3af; }

    /* Packages List */
    .packages-list { display: flex; flex-direction: column; gap: 12px; }
    .package-item { display: flex; align-items: center; gap: 12px; }
    .package-thumb {
      width: 48px; height: 48px; border-radius: 8px; flex-shrink: 0;
      background-size: cover; background-position: center; background-color: #f3f4f6;
    }
    .package-details { display: flex; flex-direction: column; gap: 2px; }
    .pkg-name { font-size: 13px; font-weight: 600; color: #111827; }
    .pkg-bookings { font-size: 11px; color: #9ca3af; }

    /* Quick Stats */
    .quick-stats { display: flex; flex-direction: column; gap: 16px; }
    .quick-stat-item { display: flex; flex-direction: column; gap: 6px; }
    .stat-row { display: flex; justify-content: space-between; align-items: center; }
    .stat-name { font-size: 13px; color: #6b7280; }
    .stat-num { font-size: 15px; font-weight: 700; color: #111827; }
    .stat-num.green { color: #16a34a; }
    .stat-num.red { color: #FF4E78; }
    .progress-bar {
      height: 6px; background: #f3f4f6; border-radius: 3px; overflow: hidden;
    }
    .progress-fill {
      height: 100%; border-radius: 3px;
      &.blue { background: #3b82f6; }
      &.green { background: #16a34a; }
    }

    .empty-state { background: #fff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 50px; }
    .empty-message { font-size: 13px; color: #9ca3af; text-align: center; padding: 20px 0; }

    /* Modal */
    .modal-sub { color: #6b7280; font-size: 13px; }
    .modal-content { display: flex; flex-direction: column; gap: 16px; }
    .modal-section h4 { font-size: 13px; font-weight: 600; color: #111827; margin: 0 0 10px; padding-bottom: 6px; border-bottom: 1px solid #e5e7eb; }
    .info-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
    .info-row span:first-child { color: #6b7280; }
    .info-row span:last-child { color: #111827; font-weight: 500; }
    .info-row .green { color: #059669; font-weight: 600; }
  `]
})
export class BookingsComponent implements OnInit {
  private router = inject(Router);
  private bookingService = inject(BookingService);
  private agencyService = inject(AgencyService);
  private statisticsService = inject(StatisticsService);
  private travelPackageService = inject(TravelPackageService);
  private toast = inject(ToastService);

  isLoading = signal(true);
  isProcessing = signal(false);
  bookings = signal<Booking[]>([]);
  stats = signal<AgencyStatistics | null>(null);
  showCancelModal = signal(false);
  showViewModal = signal(false);
  bookingToCancel = signal<Booking | null>(null);
  selectedBooking = signal<Booking | null>(null);
  currentPage = signal(1);
  pageSize = 8;

  searchQuery = '';
  statusFilter = 'all';
  packageFilter = 'all';
  dateFilter = '30';
  sortOrder = 'newest';

  private avatarGradients = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)'
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) return;

    this.bookingService.getAgencyBookings(agency.id, { offset: 0, limit: 100 }).subscribe({
      next: (response) => {
        this.bookings.set(response.data || []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Failed to load bookings');
      }
    });
  }

  filteredBookings(): Booking[] {
    let filtered = [...this.bookings()];
    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(b => b.contactName.toLowerCase().includes(q) || b.contactEmail.toLowerCase().includes(q));
    }
    if (this.statusFilter !== 'all') {
      const map: Record<string, string> = { pending: 'PENDING', approved: 'ACCEPTED', cancelled: 'CANCELLED' };
      filtered = filtered.filter(b => (b.bookingStatus || b.status) === map[this.statusFilter]);
    }
    if (this.sortOrder === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime());
    } else {
      filtered.sort((a, b) => new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime());
    }
    return filtered;
  }

  paginatedBookings(): Booking[] {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredBookings().slice(start, start + this.pageSize);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredBookings().length / this.pageSize) || 1;
  }

  getPageNumbers(): number[] {
    const total = this.getTotalPages();
    const current = this.currentPage();
    const pages: number[] = [];
    for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number): void { this.currentPage.set(page); }
  prevPage(): void { if (this.currentPage() > 1) this.currentPage.update(p => p - 1); }
  nextPage(): void { if (this.currentPage() < this.getTotalPages()) this.currentPage.update(p => p + 1); }

  getShowingStart(): number { return (this.currentPage() - 1) * this.pageSize + 1; }
  getShowingEnd(): number { return Math.min(this.currentPage() * this.pageSize, this.filteredBookings().length); }
  getRowNumber(index: number): string { return String((this.currentPage() - 1) * this.pageSize + index + 1).padStart(4, '0'); }

  getTotalCount(): number { return this.bookings().length; }
  getPendingCount(): number { return this.bookings().filter(b => (b.bookingStatus || b.status) === 'PENDING').length; }
  getApprovedCount(): number { return this.bookings().filter(b => (b.bookingStatus || b.status) === 'ACCEPTED').length; }
  getCancelledCount(): number { return this.bookings().filter(b => (b.bookingStatus || b.status) === 'CANCELLED').length; }
  getTotalRevenue(): number { return this.bookings().filter(b => (b.bookingStatus || b.status) !== 'CANCELLED').reduce((s, b) => s + (b.totalPrice || 0), 0); }
  getAverageBooking(): number { const count = this.getApprovedCount(); return count > 0 ? this.getTotalRevenue() / count : 0; }
  getApprovedPercentage(): number { const t = this.getTotalCount(); return t > 0 ? Math.round((this.getApprovedCount() / t) * 100) : 0; }

  isPending(booking: Booking): boolean { return (booking.bookingStatus || booking.status) === 'PENDING'; }

  getStatusClass(booking: Booking): string {
    const status = booking.bookingStatus || booking.status;
    if (status === 'PENDING') return 'pending';
    if (status === 'ACCEPTED') return 'confirmed';
    if (status === 'CANCELLED') return 'cancelled';
    return 'confirmed';
  }

  getStatusLabel(booking: Booking): string {
    const status = booking.bookingStatus || booking.status;
    if (status === 'PENDING') return 'Pending';
    if (status === 'ACCEPTED') return 'Confirmed';
    if (status === 'CANCELLED') return 'Cancelled';
    return 'Confirmed';
  }

  getTotalTravelers(booking: Booking): number {
    return (booking.numberOfAdults || 1) + (booking.numberOfChildren || 0);
  }

  getInitials(name: string): string { return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2); }
  getAvatarGradient(name: string): string { return this.avatarGradients[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % this.avatarGradients.length]; }
  getBookingRef(booking: Booking): string { return booking.bookingReference || ('BK-2024-' + booking.id.slice(-4).toUpperCase()); }
  getDestinations(booking: Booking): string { return booking.travelPackage?.title?.split(' ').slice(-1)[0] || 'Multiple Destinations'; }

  getPackageImage(booking: Booking): string {
    if (booking.travelPackage?.imageUrl) return booking.travelPackage.imageUrl;
    const images = [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=100&h=100&fit=crop',
      'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=100&h=100&fit=crop'
    ];
    return images[booking.id.charCodeAt(0) % images.length];
  }

  getTravelersText(booking: Booking): string {
    const parts = [];
    if (booking.numberOfAdults > 0) parts.push(`${booking.numberOfAdults} Adult${booking.numberOfAdults > 1 ? 's' : ''}`);
    if (booking.numberOfChildren > 0) parts.push(`${booking.numberOfChildren} Child${booking.numberOfChildren > 1 ? 'ren' : ''}`);
    return parts.join(', ') || '1 Adult';
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatCurrency(amount: number, currency?: string): string {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD', maximumFractionDigits: 0 }).format(amount);
  }

  formatCurrencyShort(amount: number): string {
    if (amount >= 1000000) return '$' + (amount / 1000000).toFixed(1) + 'M';
    if (amount >= 1000) return '$' + (amount / 1000).toFixed(1) + 'K';
    return '$' + amount.toFixed(0);
  }

  acceptBooking(booking: Booking): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) return;
    this.isProcessing.set(true);
    this.bookingService.acceptBooking(agency.id, booking.id).subscribe({
      next: () => { this.isProcessing.set(false); this.toast.success('Booking approved'); this.loadData(); },
      error: (e) => { this.isProcessing.set(false); this.toast.error(e.message || 'Failed to approve'); }
    });
  }

  openCancelModal(booking: Booking): void { this.bookingToCancel.set(booking); this.showCancelModal.set(true); }
  closeCancelModal(): void { this.showCancelModal.set(false); this.bookingToCancel.set(null); }

  cancelBooking(): void {
    const booking = this.bookingToCancel();
    const agency = this.agencyService.getCurrentAgency();
    if (!booking || !agency) return;
    this.isProcessing.set(true);
    this.bookingService.cancelBookingByAgency(agency.id, booking.id).subscribe({
      next: () => { this.isProcessing.set(false); this.closeCancelModal(); this.toast.success('Booking rejected'); this.loadData(); },
      error: (e) => { this.isProcessing.set(false); this.toast.error(e.message || 'Failed to reject'); }
    });
  }

  viewBooking(booking: Booking): void {
    this.router.navigate(['/dashboard/bookings', booking.id]);
  }
  closeViewModal(): void { this.showViewModal.set(false); this.selectedBooking.set(null); }

  getRecentActivity(): { id: string; type: string; text: string; time: string }[] {
    const bookingsList = this.bookings();
    if (bookingsList.length === 0) return [];

    return bookingsList
      .sort((a, b) => new Date(b.updatedAt || b.createdAt || '').getTime() - new Date(a.updatedAt || a.createdAt || '').getTime())
      .slice(0, 5)
      .map(booking => {
        const status = booking.bookingStatus || booking.status;
        let type = 'pending';
        let text = '';

        if (status === 'PENDING') {
          type = 'pending';
          text = `New booking from ${booking.contactName}`;
        } else if (status === 'ACCEPTED') {
          type = 'approved';
          text = `Booking ${this.getBookingRef(booking)} confirmed`;
        } else if (status === 'CANCELLED') {
          type = 'cancelled';
          text = `Booking ${this.getBookingRef(booking)} cancelled`;
        } else if (status === 'COMPLETED') {
          type = 'completed';
          text = `Trip completed for ${booking.contactName}`;
        }

        return {
          id: booking.id,
          type,
          text,
          time: this.getTimeAgo(booking.updatedAt || booking.createdAt)
        };
      });
  }

  getTopPackages(): { name: string; bookings: number; image: string }[] {
    const bookingsList = this.bookings();
    if (bookingsList.length === 0) return [];

    const packageCounts = new Map<string, { name: string; count: number; image: string }>();

    bookingsList.forEach(booking => {
      const pkgTitle = booking.travelPackage?.title || 'Unknown Package';
      const pkgImage = booking.travelPackage?.imageUrl || 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=100&h=100&fit=crop';

      if (packageCounts.has(pkgTitle)) {
        packageCounts.get(pkgTitle)!.count++;
      } else {
        packageCounts.set(pkgTitle, { name: pkgTitle, count: 1, image: pkgImage });
      }
    });

    return Array.from(packageCounts.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map(pkg => ({ name: pkg.name, bookings: pkg.count, image: pkg.image }));
  }

  getTimeAgo(dateStr?: string): string {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const d = Math.floor(diff / 86400000);
    if (d > 0) return `${d}d ago`;
    const h = Math.floor(diff / 3600000);
    if (h > 0) return `${h}h ago`;
    const m = Math.floor(diff / 60000);
    return m > 0 ? `${m}m ago` : 'Just now';
  }
}
