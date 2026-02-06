import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonComponent, ModalComponent, ToastService } from '@workspace/shared-ui';
import { BookingService, AgencyService, TravelPackageService } from '@workspace/core';
import { Booking, TravelPackage } from '@workspace/core';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, ModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="booking-detail-page">
      @if (isLoading()) {
        <div class="loading-state">
          <div class="spinner"></div>
          <span>Loading booking details...</span>
        </div>
      } @else if (booking()) {
        <!-- Header -->
        <header class="page-header">
          <div class="header-left">
            <button class="back-btn" (click)="goBack()">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div class="header-title">
              <h1>Booking Details</h1>
              <p>Review and manage booking information</p>
            </div>
          </div>
          <div class="header-actions">
            <button class="btn-icon" title="Print">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 6 2 18 2 18 9"/>
                <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                <rect x="6" y="14" width="12" height="8"/>
              </svg>
            </button>
            @if (isPending()) {
              <button class="btn-reject" (click)="openRejectModal()" [disabled]="isProcessing()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
                Reject Booking
              </button>
              <button class="btn-approve" (click)="approveBooking()" [disabled]="isProcessing()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Approve Booking
              </button>
            }
          </div>
        </header>

        <!-- Pending Approval Banner -->
        @if (isPending()) {
          <div class="approval-banner">
            <div class="banner-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="banner-content">
              <strong>Pending Approval Required</strong>
              <p>This booking is awaiting your decision. Please review the details and take action.</p>
            </div>
          </div>
        }

        <div class="content-grid">
          <!-- Main Content -->
          <main class="main-content">
            <!-- Customer Information -->
            <section class="detail-card">
              <div class="card-header">
                <h2>Customer Information</h2>
                <button class="btn-contact">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Contact Customer
                </button>
              </div>
              <div class="customer-grid">
                <div class="info-group">
                  <label>FULL NAME</label>
                  <div class="info-value with-avatar">
                    <div class="avatar" [style.background]="getAvatarGradient(booking()!.contactName)">
                      {{ getInitials(booking()!.contactName) }}
                    </div>
                    <span>{{ booking()!.contactName }}</span>
                  </div>
                </div>
                <div class="info-group">
                  <label>EMAIL ADDRESS</label>
                  <span class="info-value">{{ booking()!.contactEmail }}</span>
                </div>
                <div class="info-group">
                  <label>PHONE NUMBER</label>
                  <span class="info-value">{{ booking()!.contactPhone || 'N/A' }}</span>
                </div>
                <div class="info-group">
                  <label>COUNTRY</label>
                  <span class="info-value">United States</span>
                </div>
                <div class="info-group">
                  <label>CONFIRMED EMAIL</label>
                  <span class="info-value verified">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    1 trip completed
                  </span>
                </div>
                <div class="info-group">
                  <label>MEMBER SINCE</label>
                  <span class="info-value">March 2023</span>
                </div>
              </div>
              @if (booking()!.notes) {
                <div class="special-requests">
                  <label>SPECIAL REQUESTS</label>
                  <p>{{ booking()!.notes }}</p>
                </div>
              }
            </section>

            <!-- Travel Package Details -->
            <section class="detail-card">
              <div class="card-header">
                <h2>Travel Package Details</h2>
                @if (travelPackage()) {
                  <a [routerLink]="['/dashboard/packages', travelPackage()!.id, 'edit']" class="btn-view-package">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                      <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                    </svg>
                    View Package
                  </a>
                }
              </div>
              @if (travelPackage()) {
                <div class="package-hero">
                  <div class="package-image" [style.background-image]="'url(' + getPackageImage() + ')'"></div>
                  <div class="package-info">
                    <h3>{{ travelPackage()!.title }}</h3>
                    <p>{{ travelPackage()!.description || 'Experience the magic of this amazing travel package.' }}</p>
                    <div class="package-meta">
                      <span class="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {{ getDuration() }} Days / {{ getDuration() - 1 }} Nights
                      </span>
                      <span class="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                        </svg>
                        {{ getDestinationCount() }} Countries
                      </span>
                      <span class="meta-item">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        {{ travelPackage()!.rating || 4.5 }} ({{ travelPackage()!.reviewCount || 287 }} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Route Visualization -->
                <div class="route-section">
                  <div class="route-cities">
                    @for (city of getRouteCities(); track city.name; let i = $index; let last = $last) {
                      <div class="route-city">
                        <div class="city-icon" [class.destination]="last">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="10" r="3"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z"/>
                          </svg>
                        </div>
                        <span class="city-name">{{ city.name }}</span>
                        <span class="city-days">{{ city.days }}</span>
                      </div>
                      @if (!last) {
                        <div class="route-connector">
                          <div class="connector-line"></div>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                          </svg>
                        </div>
                      }
                    }
                  </div>
                </div>

                <!-- What's Included -->
                <div class="whats-included">
                  <h4>What's Included</h4>
                  <div class="included-grid">
                    <div class="included-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                      </svg>
                      <span>Round-trip flights</span>
                    </div>
                    <div class="included-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      </svg>
                      <span>4-star hotels</span>
                    </div>
                    <div class="included-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                      </svg>
                      <span>Airport transfers</span>
                    </div>
                    <div class="included-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/>
                      </svg>
                      <span>Daily breakfast</span>
                    </div>
                    <div class="included-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <span>Travel insurance</span>
                    </div>
                    <div class="included-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72"/>
                      </svg>
                      <span>24/7 support</span>
                    </div>
                  </div>
                </div>
              }
            </section>

            <!-- Detailed Itinerary -->
            <section class="detail-card">
              <h2>Detailed Itinerary</h2>
              <div class="itinerary-timeline">
                @for (day of getItinerary(); track day.day) {
                  <div class="itinerary-day">
                    <div class="day-marker" [class]="day.color">
                      <span class="day-number">{{ day.day }}</span>
                    </div>
                    <div class="day-content">
                      <h4>{{ day.title }}</h4>
                      <p class="day-subtitle">{{ day.subtitle }}</p>
                      <ul class="day-activities">
                        @for (activity of day.activities; track activity) {
                          <li>{{ activity }}</li>
                        }
                      </ul>
                    </div>
                  </div>
                }
              </div>
            </section>

            <!-- Travel Dates & Participants -->
            <section class="detail-card">
              <h2>Travel Dates & Participants</h2>
              <div class="dates-grid">
                <div class="date-box">
                  <label>DEPARTURE DATE</label>
                  <div class="date-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </div>
                  <span class="date-value">{{ formatFullDate(travelPackage()?.startDate) }}</span>
                  <span class="date-time">{{ formatTime(travelPackage()?.startDate) }}</span>
                </div>
                <div class="date-box">
                  <label>RETURN DATE</label>
                  <div class="date-icon return">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4 20-7z"/>
                    </svg>
                  </div>
                  <span class="date-value">{{ formatFullDate(travelPackage()?.endDate) }}</span>
                  <span class="date-time">{{ formatTime(travelPackage()?.endDate) }}</span>
                </div>
              </div>
              <div class="participants-section">
                <h4>Travelers</h4>
                <div class="travelers-list">
                  @for (traveler of getTravelers(); track traveler.name; let i = $index) {
                    <div class="traveler-card">
                      <div class="traveler-avatar" [style.background]="getAvatarGradient(traveler.name)">
                        {{ getInitials(traveler.name) }}
                      </div>
                      <div class="traveler-info">
                        <span class="traveler-name">{{ traveler.name }}</span>
                        <span class="traveler-type">{{ traveler.type }}</span>
                      </div>
                      @if (i === 0) {
                        <span class="lead-badge">Lead Traveler</span>
                      }
                    </div>
                  }
                </div>
              </div>
            </section>

            <!-- Accommodation Details -->
            <section class="detail-card">
              <h2>Accommodation Details</h2>
              <div class="hotels-list">
                @for (hotel of getHotels(); track hotel.name) {
                  <div class="hotel-card">
                    <div class="hotel-image" [style.background-image]="'url(' + hotel.image + ')'"></div>
                    <div class="hotel-info">
                      <div class="hotel-header">
                        <h4>{{ hotel.name }}</h4>
                        <div class="hotel-stars">
                          @for (star of [1,2,3,4,5]; track star) {
                            <svg width="12" height="12" viewBox="0 0 24 24" [attr.fill]="star <= hotel.stars ? '#f59e0b' : 'none'" [attr.stroke]="star <= hotel.stars ? '#f59e0b' : '#d1d5db'" stroke-width="2">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                            </svg>
                          }
                        </div>
                      </div>
                      <p class="hotel-location">{{ hotel.location }}</p>
                      <div class="hotel-meta">
                        <span>{{ hotel.roomType }}</span>
                        <span class="dot"></span>
                        <span>{{ hotel.nights }} Nights</span>
                        <span class="dot"></span>
                        <span>{{ hotel.dates }}</span>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </section>

            <!-- Payment Information -->
            <section class="detail-card">
              <h2>Payment Information</h2>
              <div class="payment-status" [class]="getPaymentStatusClass()">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  @if (booking()!.paymentStatus === 'PAID') {
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  } @else {
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  }
                </svg>
                <div>
                  <strong>{{ getPaymentStatusLabel() }}</strong>
                  <span>{{ getPaymentDate() }}</span>
                </div>
              </div>
              <div class="price-breakdown">
                <div class="price-row">
                  <span>Package Base Price ({{ booking()!.numberOfAdults }} Adults)</span>
                  <span>{{ formatCurrency(getBasePrice()) }}</span>
                </div>
                @if (booking()!.numberOfChildren > 0) {
                  <div class="price-row">
                    <span>Child Supplement ({{ booking()!.numberOfChildren }} Child)</span>
                    <span>{{ formatCurrency(getChildPrice()) }}</span>
                  </div>
                }
                <div class="price-row">
                  <span>Travel Insurance</span>
                  <span>{{ formatCurrency(190) }}</span>
                </div>
                @if (getDiscount() > 0) {
                  <div class="price-row discount">
                    <span>Early Bird Discount</span>
                    <span>-{{ formatCurrency(getDiscount()) }}</span>
                  </div>
                }
                <div class="price-row total">
                  <span>Total Amount</span>
                  <span>{{ formatCurrency(booking()!.totalPrice || 0) }}</span>
                </div>
              </div>
              <div class="payment-method">
                <label>Payment Method</label>
                <div class="method-value">
                  <svg width="24" height="16" viewBox="0 0 24 16" fill="none">
                    <rect width="24" height="16" rx="2" fill="#1a1f71"/>
                    <text x="12" y="11" font-size="6" fill="white" text-anchor="middle" font-weight="bold">VISA</text>
                  </svg>
                  <span>**** 4532</span>
                </div>
              </div>
            </section>

            <!-- Documents & Attachments -->
            <section class="detail-card">
              <h2>Documents & Attachments</h2>
              <div class="documents-grid">
                @for (doc of getDocuments(); track doc.name) {
                  <div class="document-card">
                    <div class="doc-icon" [class]="doc.type">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                      </svg>
                    </div>
                    <div class="doc-info">
                      <span class="doc-name">{{ doc.name }}</span>
                      <span class="doc-size">{{ doc.size }}</span>
                    </div>
                    <button class="doc-download">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    </button>
                  </div>
                }
              </div>
            </section>

            <!-- Customer's Previous Bookings -->
            <section class="detail-card">
              <h2>Customer's Previous Bookings</h2>
              <div class="previous-bookings">
                @for (prev of getPreviousBookings(); track prev.id) {
                  <div class="prev-booking-card">
                    <div class="prev-image" [style.background-image]="'url(' + prev.image + ')'"></div>
                    <div class="prev-info">
                      <h4>{{ prev.title }}</h4>
                      <div class="prev-meta">
                        <span>{{ prev.date }}</span>
                        <span class="dot"></span>
                        <span>{{ prev.travelers }} Travelers</span>
                      </div>
                      <span class="prev-price">{{ formatCurrency(prev.price) }}</span>
                    </div>
                  </div>
                }
                @if (getPreviousBookings().length === 0) {
                  <p class="no-previous">No previous bookings from this customer.</p>
                }
              </div>
            </section>
          </main>

          <!-- Sidebar -->
          <aside class="sidebar">
            <!-- Booking Summary -->
            <div class="sidebar-card summary-card">
              <h3>Booking Summary</h3>
              <div class="summary-rows">
                <div class="summary-row">
                  <span class="label">Booking ID</span>
                  <span class="value mono">BK-2024-{{ booking()!.id.slice(-4).toUpperCase() }}</span>
                </div>
                <div class="summary-row">
                  <span class="label">Date</span>
                  <span class="value">{{ formatDate(booking()!.createdAt) }}</span>
                </div>
                <div class="summary-row">
                  <span class="label">Status</span>
                  <span class="status-badge" [class]="getStatusClass()">{{ getStatusLabel() }}</span>
                </div>
                <div class="summary-row">
                  <span class="label">Package</span>
                  <span class="value">{{ travelPackage()?.title || 'Travel Package' }}</span>
                </div>
                <div class="summary-row">
                  <span class="label">Duration</span>
                  <span class="value">{{ getDuration() }} Days</span>
                </div>
                <div class="summary-row">
                  <span class="label">Travelers</span>
                  <span class="value">{{ getTotalTravelers() }} People</span>
                </div>
              </div>
              <div class="summary-total">
                <span>Total Price</span>
                <span class="total-amount">{{ formatCurrency(booking()!.totalPrice || 0) }}</span>
              </div>
              @if (isPending()) {
                <div class="summary-actions">
                  <button class="btn-approve-full" (click)="approveBooking()" [disabled]="isProcessing()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Approve Booking
                  </button>
                  <button class="btn-reject-full" (click)="openRejectModal()" [disabled]="isProcessing()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Reject Booking
                  </button>
                </div>
              }
              <button class="btn-contact-full">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                Contact Customer
              </button>
            </div>

            <!-- Admin Notes -->
            <div class="sidebar-card">
              <h3>Admin Notes</h3>
              <textarea
                class="notes-textarea"
                [(ngModel)]="adminNotes"
                placeholder="Add private notes about this booking..."
                rows="4"
              ></textarea>
              <button class="btn-save-note" (click)="saveNotes()">Save Note</button>
              @if (getPreviousNotes().length > 0) {
                <div class="previous-notes">
                  <h4>Previous Notes</h4>
                  @for (note of getPreviousNotes(); track note.date) {
                    <div class="note-item">
                      <p>{{ note.text }}</p>
                      <span class="note-meta">{{ note.author }} - {{ note.date }}</span>
                    </div>
                  }
                </div>
              }
            </div>

            <!-- Quick Actions -->
            <div class="sidebar-card">
              <h3>Quick Actions</h3>
              <div class="quick-actions">
                <button class="action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  Send Confirmation Email
                </button>
                <button class="action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 6 2 18 2 18 9"/>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                    <rect x="6" y="14" width="12" height="8"/>
                  </svg>
                  Print Booking Details
                </button>
                <button class="action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download All Documents
                </button>
                <button class="action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Modify Booking
                </button>
                <button class="action-btn">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Add to Calendar
                </button>
              </div>
            </div>

            <!-- Activity Timeline -->
            <div class="sidebar-card">
              <h3>Activity Timeline</h3>
              <div class="timeline">
                @for (event of getTimeline(); track event.date) {
                  <div class="timeline-item">
                    <div class="timeline-dot" [class]="event.type"></div>
                    <div class="timeline-content">
                      <span class="timeline-title">{{ event.title }}</span>
                      <span class="timeline-desc">{{ event.description }}</span>
                      <span class="timeline-date">{{ event.date }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>
          </aside>
        </div>
      } @else {
        <div class="error-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <h2>Booking Not Found</h2>
          <p>The booking you're looking for doesn't exist or has been removed.</p>
          <button class="btn-back" (click)="goBack()">Back to Bookings</button>
        </div>
      }
    </div>

    <!-- Reject Modal -->
    <app-modal [isOpen]="showRejectModal()" title="Reject Booking" size="sm" [showFooter]="true" (closed)="closeRejectModal()">
      <p>Are you sure you want to reject this booking for <strong>{{ booking()?.contactName }}</strong>?</p>
      <p class="modal-sub">The customer will be notified about this decision.</p>
      <div modal-footer>
        <app-button variant="ghost" (onClick)="closeRejectModal()">Cancel</app-button>
        <app-button variant="danger" [loading]="isProcessing()" (onClick)="rejectBooking()">Reject Booking</app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .booking-detail-page {
      display: flex;
      flex-direction: column;
      gap: 20px;
      max-width: 1400px;
      margin: 0 auto;
    }

    /* Loading & Error States */
    .loading-state, .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      background: #fff;
      border-radius: 12px;
      text-align: center;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f4f6;
      border-top-color: #FF4E78;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    .error-state svg { color: #9ca3af; margin-bottom: 16px; }
    .error-state h2 { font-size: 20px; color: #111827; margin: 0 0 8px; }
    .error-state p { color: #6b7280; margin: 0 0 20px; }
    .btn-back {
      padding: 10px 20px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      color: #fff;
      border: none;
      border-radius: 8px;
      font-weight: 500;
      cursor: pointer;
    }

    /* Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 20px;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .back-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      color: #374151;
    }
    .back-btn:hover { background: #e5e7eb; }
    .header-title h1 {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
      margin: 0;
    }
    .header-title p {
      font-size: 13px;
      color: #6b7280;
      margin: 2px 0 0;
    }
    .header-actions {
      display: flex;
      gap: 10px;
    }
    .btn-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f3f4f6;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      color: #374151;
    }
    .btn-reject, .btn-approve {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-reject {
      background: #fff;
      border: 1px solid #e5e7eb;
      color: #FF4E78;
    }
    .btn-reject:hover { background: #fef2f2; }
    .btn-approve {
      background: #16a34a;
      color: #fff;
    }
    .btn-approve:hover { background: #15803d; }

    /* Approval Banner */
    .approval-banner {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px 20px;
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 12px;
    }
    .banner-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fbbf24;
      border-radius: 8px;
      color: #78350f;
      flex-shrink: 0;
    }
    .banner-content strong {
      display: block;
      font-size: 14px;
      color: #78350f;
      margin-bottom: 4px;
    }
    .banner-content p {
      font-size: 13px;
      color: #92400e;
      margin: 0;
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 20px;
    }
    @media (max-width: 1100px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    /* Main Content */
    .main-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    /* Detail Cards */
    .detail-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
    }
    .detail-card h2 {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 16px;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    .card-header h2 { margin: 0; }
    .btn-contact, .btn-view-package {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: #FF4E78;
      cursor: pointer;
      text-decoration: none;
    }
    .btn-contact:hover, .btn-view-package:hover { background: #fef2f2; }

    /* Customer Grid */
    .customer-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    @media (max-width: 700px) {
      .customer-grid { grid-template-columns: 1fr 1fr; }
    }
    .info-group label {
      display: block;
      font-size: 10px;
      font-weight: 600;
      color: #9ca3af;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
    }
    .info-value {
      font-size: 14px;
      color: #111827;
      font-weight: 500;
    }
    .info-value.with-avatar {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
      color: #fff;
      flex-shrink: 0;
    }
    .info-value.verified {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #16a34a;
    }
    .special-requests {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;
    }
    .special-requests p {
      font-size: 13px;
      color: #374151;
      margin: 0;
      line-height: 1.6;
    }

    /* Package Hero */
    .package-hero {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }
    .package-image {
      width: 200px;
      height: 140px;
      border-radius: 10px;
      background-size: cover;
      background-position: center;
      background-color: #f3f4f6;
      flex-shrink: 0;
    }
    .package-info { flex: 1; }
    .package-info h3 {
      font-size: 18px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px;
    }
    .package-info p {
      font-size: 13px;
      color: #6b7280;
      margin: 0 0 12px;
      line-height: 1.5;
    }
    .package-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: #6b7280;
    }
    .meta-item svg { color: #9ca3af; }

    /* Route Section */
    .route-section {
      padding: 20px;
      background: #f9fafb;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .route-cities {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 8px;
    }
    .route-city {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
    }
    .city-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 2px solid #FF4E78;
      border-radius: 50%;
      color: #FF4E78;
    }
    .city-icon.destination {
      background: #FF4E78;
      color: #fff;
    }
    .city-name {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }
    .city-days {
      font-size: 11px;
      color: #6b7280;
    }
    .route-connector {
      display: flex;
      align-items: center;
      gap: 4px;
      flex: 1;
      max-width: 80px;
    }
    .connector-line {
      flex: 1;
      height: 2px;
      background: linear-gradient(90deg, #FF9370, #FF4E78);
    }
    .route-connector svg { color: #FF4E78; }

    /* What's Included */
    .whats-included h4 {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 12px;
    }
    .included-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    @media (max-width: 600px) {
      .included-grid { grid-template-columns: repeat(2, 1fr); }
    }
    .included-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #374151;
    }
    .included-item svg { color: #16a34a; }

    /* Itinerary Timeline */
    .itinerary-timeline {
      display: flex;
      flex-direction: column;
      gap: 0;
    }
    .itinerary-day {
      display: flex;
      gap: 16px;
      padding: 16px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .itinerary-day:last-child { border-bottom: none; }
    .day-marker {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .day-marker.blue { background: #dbeafe; }
    .day-marker.green { background: #dcfce7; }
    .day-marker.orange { background: #ffedd5; }
    .day-marker.red { background: #fee2e2; }
    .day-number {
      font-size: 12px;
      font-weight: 700;
      color: #374151;
    }
    .day-content { flex: 1; }
    .day-content h4 {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 4px;
    }
    .day-subtitle {
      font-size: 12px;
      color: #6b7280;
      margin: 0 0 10px;
    }
    .day-activities {
      margin: 0;
      padding-left: 16px;
    }
    .day-activities li {
      font-size: 13px;
      color: #374151;
      margin-bottom: 4px;
    }

    /* Dates Grid */
    .dates-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 24px;
    }
    .date-box {
      padding: 16px;
      background: #f9fafb;
      border-radius: 10px;
    }
    .date-box label {
      display: block;
      font-size: 10px;
      font-weight: 600;
      color: #9ca3af;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }
    .date-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #FF4E78;
      border-radius: 8px;
      color: #fff;
      margin-bottom: 10px;
    }
    .date-icon.return {
      background: #16a34a;
      transform: scaleX(-1);
    }
    .date-value {
      display: block;
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 4px;
    }
    .date-time {
      font-size: 12px;
      color: #6b7280;
    }

    /* Participants */
    .participants-section h4 {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 12px;
    }
    .travelers-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .traveler-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .traveler-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      color: #fff;
    }
    .traveler-info {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .traveler-name {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }
    .traveler-type {
      font-size: 12px;
      color: #6b7280;
    }
    .lead-badge {
      padding: 4px 10px;
      background: #FF4E78;
      color: #fff;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
    }

    /* Hotels */
    .hotels-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .hotel-card {
      display: flex;
      gap: 16px;
      padding: 14px;
      background: #f9fafb;
      border-radius: 10px;
    }
    .hotel-image {
      width: 80px;
      height: 60px;
      border-radius: 8px;
      background-size: cover;
      background-position: center;
      background-color: #e5e7eb;
      flex-shrink: 0;
    }
    .hotel-info { flex: 1; }
    .hotel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .hotel-header h4 {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }
    .hotel-stars { display: flex; gap: 2px; }
    .hotel-location {
      font-size: 12px;
      color: #6b7280;
      margin: 0 0 6px;
    }
    .hotel-meta {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11px;
      color: #9ca3af;
    }
    .hotel-meta .dot {
      width: 3px;
      height: 3px;
      background: #d1d5db;
      border-radius: 50%;
    }

    /* Payment */
    .payment-status {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .payment-status.paid {
      background: #dcfce7;
    }
    .payment-status.paid svg { color: #16a34a; }
    .payment-status.pending {
      background: #fef3c7;
    }
    .payment-status.pending svg { color: #f59e0b; }
    .payment-status strong {
      display: block;
      font-size: 14px;
      color: #111827;
    }
    .payment-status span {
      font-size: 12px;
      color: #6b7280;
    }
    .price-breakdown {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 20px;
    }
    .price-row {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #374151;
    }
    .price-row.discount {
      color: #16a34a;
    }
    .price-row.total {
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-weight: 700;
      font-size: 16px;
      color: #111827;
    }
    .price-row.total span:last-child {
      color: #FF4E78;
    }
    .payment-method label {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-bottom: 8px;
    }
    .method-value {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 14px;
      color: #111827;
    }

    /* Documents */
    .documents-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    @media (max-width: 600px) {
      .documents-grid { grid-template-columns: 1fr; }
    }
    .document-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 8px;
    }
    .doc-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
    }
    .doc-icon.pdf { background: #fee2e2; color: #FF4E78; }
    .doc-icon.doc { background: #dbeafe; color: #2563eb; }
    .doc-info { flex: 1; }
    .doc-name {
      display: block;
      font-size: 13px;
      font-weight: 500;
      color: #111827;
    }
    .doc-size {
      font-size: 11px;
      color: #9ca3af;
    }
    .doc-download {
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      cursor: pointer;
      color: #6b7280;
    }
    .doc-download:hover { background: #f3f4f6; }

    /* Previous Bookings */
    .previous-bookings {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }
    @media (max-width: 800px) {
      .previous-bookings { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 500px) {
      .previous-bookings { grid-template-columns: 1fr; }
    }
    .prev-booking-card {
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
    }
    .prev-image {
      height: 100px;
      background-size: cover;
      background-position: center;
      background-color: #f3f4f6;
    }
    .prev-info {
      padding: 12px;
    }
    .prev-info h4 {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 6px;
    }
    .prev-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 11px;
      color: #6b7280;
      margin-bottom: 6px;
    }
    .prev-meta .dot {
      width: 3px;
      height: 3px;
      background: #d1d5db;
      border-radius: 50%;
    }
    .prev-price {
      font-size: 14px;
      font-weight: 700;
      color: #FF4E78;
    }
    .no-previous {
      grid-column: 1 / -1;
      text-align: center;
      color: #9ca3af;
      font-size: 13px;
      padding: 20px;
    }

    /* Sidebar */
    .sidebar {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .sidebar-card {
      background: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 18px;
    }
    .sidebar-card h3 {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 14px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f3f4f6;
    }

    /* Summary Card */
    .summary-rows {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .summary-row .label {
      font-size: 13px;
      color: #6b7280;
    }
    .summary-row .value {
      font-size: 13px;
      font-weight: 500;
      color: #111827;
    }
    .summary-row .value.mono {
      font-family: monospace;
      font-size: 12px;
    }
    .status-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 500;
    }
    .status-badge.pending { background: #fef3c7; color: #b45309; }
    .status-badge.confirmed { background: #dcfce7; color: #16a34a; }
    .status-badge.cancelled { background: #fee2e2; color: #FF4E78; }
    .summary-total {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 14px;
      padding-top: 14px;
      border-top: 1px solid #f3f4f6;
    }
    .summary-total span:first-child {
      font-size: 13px;
      color: #6b7280;
    }
    .total-amount {
      font-size: 22px;
      font-weight: 700;
      color: #FF4E78;
    }
    .summary-actions {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 16px;
    }
    .btn-approve-full, .btn-reject-full, .btn-contact-full {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: none;
    }
    .btn-approve-full {
      background: #16a34a;
      color: #fff;
    }
    .btn-approve-full:hover { background: #15803d; }
    .btn-reject-full {
      background: #fff;
      border: 1px solid #FF4E78;
      color: #FF4E78;
    }
    .btn-reject-full:hover { background: #fef2f2; }
    .btn-contact-full {
      background: #f3f4f6;
      color: #374151;
      margin-top: 8px;
    }
    .btn-contact-full:hover { background: #e5e7eb; }

    /* Notes */
    .notes-textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 13px;
      resize: vertical;
      font-family: inherit;
    }
    .notes-textarea:focus {
      outline: none;
      border-color: #FF4E78;
    }
    .btn-save-note {
      width: 100%;
      padding: 10px;
      background: #FF4E78;
      color: #fff;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      margin-top: 10px;
    }
    .btn-save-note:hover { background: #e6335a; }
    .previous-notes {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;
    }
    .previous-notes h4 {
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      margin: 0 0 10px;
    }
    .note-item {
      padding: 10px;
      background: #f9fafb;
      border-radius: 6px;
      margin-bottom: 8px;
    }
    .note-item p {
      font-size: 12px;
      color: #374151;
      margin: 0 0 4px;
    }
    .note-meta {
      font-size: 10px;
      color: #9ca3af;
    }

    /* Quick Actions */
    .quick-actions {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: #f9fafb;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      color: #374151;
      cursor: pointer;
      text-align: left;
    }
    .action-btn:hover { background: #f3f4f6; }
    .action-btn svg { color: #6b7280; }

    /* Timeline */
    .timeline {
      display: flex;
      flex-direction: column;
    }
    .timeline-item {
      display: flex;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
    }
    .timeline-item:last-child { border-bottom: none; }
    .timeline-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-top: 4px;
      flex-shrink: 0;
    }
    .timeline-dot.success { background: #16a34a; }
    .timeline-dot.pending { background: #f59e0b; }
    .timeline-dot.info { background: #3b82f6; }
    .timeline-content {
      display: flex;
      flex-direction: column;
    }
    .timeline-title {
      font-size: 13px;
      font-weight: 500;
      color: #111827;
    }
    .timeline-desc {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
    }
    .timeline-date {
      font-size: 10px;
      color: #9ca3af;
      margin-top: 4px;
    }

    /* Modal */
    .modal-sub {
      font-size: 13px;
      color: #6b7280;
    }
  `]
})
export class BookingDetailComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);
  private agencyService = inject(AgencyService);
  private travelPackageService = inject(TravelPackageService);
  private toast = inject(ToastService);

  isLoading = signal(true);
  isProcessing = signal(false);
  booking = signal<Booking | null>(null);
  travelPackage = signal<TravelPackage | null>(null);
  showRejectModal = signal(false);

  adminNotes = '';

  private avatarGradients = [
    'linear-gradient(135deg, #667eea, #764ba2)',
    'linear-gradient(135deg, #f093fb, #f5576c)',
    'linear-gradient(135deg, #4facfe, #00f2fe)',
    'linear-gradient(135deg, #43e97b, #38f9d7)',
    'linear-gradient(135deg, #fa709a, #fee140)'
  ];

  ngOnInit(): void {
    const bookingId = this.route.snapshot.paramMap.get('id');
    if (bookingId) {
      this.loadBooking(bookingId);
    } else {
      this.isLoading.set(false);
    }
  }

  loadBooking(bookingId: string): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) {
      this.isLoading.set(false);
      return;
    }

    this.bookingService.getAgencyBookings(agency.id, { offset: 0, limit: 100 }).subscribe({
      next: (response) => {
        const found = response.data?.find(b => b.id === bookingId);
        if (found) {
          this.booking.set(found);
          if (found.travelPackageId) {
            this.loadPackage(found.travelPackageId);
          }
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Failed to load booking');
      }
    });
  }

  loadPackage(packageId: string): void {
    this.travelPackageService.getTravelPackageById(packageId).subscribe({
      next: (pkg) => this.travelPackage.set(pkg),
      error: () => {}
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard/bookings']);
  }

  isPending(): boolean {
    const b = this.booking();
    return b ? (b.bookingStatus || b.status) === 'PENDING' : false;
  }

  getStatusClass(): string {
    const b = this.booking();
    if (!b) return 'pending';
    const status = b.bookingStatus || b.status;
    if (status === 'PENDING') return 'pending';
    if (status === 'ACCEPTED') return 'confirmed';
    if (status === 'CANCELLED') return 'cancelled';
    return 'confirmed';
  }

  getStatusLabel(): string {
    const b = this.booking();
    if (!b) return 'Pending';
    const status = b.bookingStatus || b.status;
    if (status === 'PENDING') return 'Pending';
    if (status === 'ACCEPTED') return 'Confirmed';
    if (status === 'CANCELLED') return 'Cancelled';
    return 'Confirmed';
  }

  getTotalTravelers(): number {
    const b = this.booking();
    return b ? (b.numberOfAdults || 1) + (b.numberOfChildren || 0) : 0;
  }

  getDuration(): number {
    const pkg = this.travelPackage();
    if (!pkg?.startDate || !pkg?.endDate) return 14;
    const start = new Date(pkg.startDate);
    const end = new Date(pkg.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 14;
  }

  getDestinationCount(): number {
    return 3;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  }

  getAvatarGradient(name: string): string {
    return this.avatarGradients[name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % this.avatarGradients.length];
  }

  getPackageImage(): string {
    const pkg = this.travelPackage();
    if (pkg?.images?.[0]) return pkg.images[0];
    if (pkg?.files?.[0]) return pkg.files[0];
    return 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=300&fit=crop';
  }

  getRouteCities(): { name: string; days: string }[] {
    return [
      { name: 'Paris, France', days: '4 Days' },
      { name: 'Rome, Italy', days: '5 Days' },
      { name: 'Barcelona, Spain', days: '5 Days' }
    ];
  }

  getItinerary(): { day: number; title: string; subtitle: string; activities: string[]; color: string }[] {
    return [
      {
        day: 1,
        title: 'Day 1-4: Paris, France',
        subtitle: 'Arrival and city exploration',
        activities: ['Eiffel Tower visit', 'Louvre Museum tour', 'Seine River cruise', 'Montmartre walking tour'],
        color: 'blue'
      },
      {
        day: 2,
        title: 'Day 5-9: Rome, Italy',
        subtitle: 'Ancient history and culture',
        activities: ['Colosseum guided tour', 'Vatican Museums', 'Sistine Chapel visit', 'Roman Forum exploration'],
        color: 'green'
      },
      {
        day: 3,
        title: 'Day 10-14: Barcelona, Spain',
        subtitle: 'Mediterranean vibes and beaches',
        activities: ['Sagrada Familia tour', 'Park Guell visit', 'Gothic Quarter walk', 'Beach relaxation', 'Farewell dinner'],
        color: 'orange'
      }
    ];
  }

  getTravelers(): { name: string; type: string }[] {
    const b = this.booking();
    if (!b) return [];
    const travelers: { name: string; type: string }[] = [];
    travelers.push({ name: b.contactName, type: 'Adult' });
    for (let i = 1; i < (b.numberOfAdults || 1); i++) {
      travelers.push({ name: `Traveler ${i + 1}`, type: 'Adult' });
    }
    for (let i = 0; i < (b.numberOfChildren || 0); i++) {
      travelers.push({ name: `Child ${i + 1}`, type: 'Child (2-11 yrs)' });
    }
    return travelers;
  }

  getHotels(): { name: string; location: string; roomType: string; nights: number; dates: string; stars: number; image: string }[] {
    return [
      {
        name: 'Le Grand Hotel Paris',
        location: 'Paris, France',
        roomType: 'Deluxe Room',
        nights: 4,
        dates: 'Jan 15-19',
        stars: 5,
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=80&fit=crop'
      },
      {
        name: 'Hotel Romano Imperial',
        location: 'Rome, Italy',
        roomType: 'Suite',
        nights: 5,
        dates: 'Jan 19-24',
        stars: 4,
        image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=100&h=80&fit=crop'
      },
      {
        name: 'Barcelona Beachfront Resort',
        location: 'Barcelona, Spain',
        roomType: 'Ocean View Suite',
        nights: 5,
        dates: 'Jan 24-29',
        stars: 4,
        image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=100&h=80&fit=crop'
      }
    ];
  }

  getBasePrice(): number {
    const b = this.booking();
    const pkg = this.travelPackage();
    if (!b || !pkg) return 3500;
    return (pkg.price || 3500) * (b.numberOfAdults || 1);
  }

  getChildPrice(): number {
    const b = this.booking();
    const pkg = this.travelPackage();
    if (!b || !pkg) return 0;
    return ((pkg.price || 3500) * 0.5) * (b.numberOfChildren || 0);
  }

  getDiscount(): number {
    return 350;
  }

  getPaymentStatusClass(): string {
    const b = this.booking();
    return b?.paymentStatus === 'PAID' ? 'paid' : 'pending';
  }

  getPaymentStatusLabel(): string {
    const b = this.booking();
    return b?.paymentStatus === 'PAID' ? 'Payment Received' : 'Payment Pending';
  }

  getPaymentDate(): string {
    const b = this.booking();
    if (b?.paymentDate) {
      return 'Paid on ' + this.formatDate(b.paymentDate);
    }
    return 'Awaiting payment';
  }

  getDocuments(): { name: string; size: string; type: string }[] {
    return [
      { name: 'Booking Confirmation.pdf', size: '245 KB', type: 'pdf' },
      { name: 'Travel Insurance.pdf', size: '180 KB', type: 'pdf' },
      { name: 'Payment Receipt.pdf', size: '125 KB', type: 'pdf' },
      { name: 'Travel Itinerary.pdf', size: '890 KB', type: 'pdf' }
    ];
  }

  getPreviousBookings(): { id: string; title: string; date: string; travelers: number; price: number; image: string }[] {
    return [
      {
        id: '1',
        title: 'Asian Explorer',
        date: 'May 2024',
        travelers: 2,
        price: 4200,
        image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=200&h=150&fit=crop'
      },
      {
        id: '2',
        title: 'Caribbean Paradise',
        date: 'Dec 2023',
        travelers: 4,
        price: 5800,
        image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=150&fit=crop'
      },
      {
        id: '3',
        title: 'Mediterranean Cruise',
        date: 'Aug 2023',
        travelers: 2,
        price: 3500,
        image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=200&h=150&fit=crop'
      }
    ];
  }

  getPreviousNotes(): { text: string; author: string; date: string }[] {
    return [
      {
        text: 'Customer requested vegetarian meals - noted.',
        author: 'Alex Johnson',
        date: 'Dec 26, 2024'
      }
    ];
  }

  getTimeline(): { title: string; description: string; date: string; type: string }[] {
    const b = this.booking();
    return [
      {
        title: 'Payment Received',
        description: 'Full payment processed successfully',
        date: this.formatDate(b?.paymentDate || b?.createdAt),
        type: 'success'
      },
      {
        title: 'Booking Created',
        description: 'Customer submitted booking request',
        date: this.formatDate(b?.createdAt),
        type: 'info'
      },
      {
        title: 'Package Viewed',
        description: 'Customer browsed package details',
        date: this.formatDate(b?.createdAt),
        type: 'info'
      }
    ];
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatFullDate(dateStr?: string): string {
    if (!dateStr) return 'January 15, 2025';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  formatTime(dateStr?: string): string {
    if (!dateStr) return 'Wednesday, 10:30 AM';
    const date = new Date(dateStr);
    const day = date.toLocaleDateString('en-US', { weekday: 'long' });
    const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return `${day}, ${time}`;
  }

  formatCurrency(amount: number): string {
    const b = this.booking();
    const currency = b?.totalPriceCurrency || b?.priceCurrency || 'USD';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
  }

  saveNotes(): void {
    this.toast.success('Notes saved successfully');
  }

  openRejectModal(): void {
    this.showRejectModal.set(true);
  }

  closeRejectModal(): void {
    this.showRejectModal.set(false);
  }

  approveBooking(): void {
    const b = this.booking();
    const agency = this.agencyService.getCurrentAgency();
    if (!b || !agency) return;

    this.isProcessing.set(true);
    this.bookingService.acceptBooking(agency.id, b.id).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.toast.success('Booking approved successfully');
        this.loadBooking(b.id);
      },
      error: (e) => {
        this.isProcessing.set(false);
        this.toast.error(e.message || 'Failed to approve booking');
      }
    });
  }

  rejectBooking(): void {
    const b = this.booking();
    const agency = this.agencyService.getCurrentAgency();
    if (!b || !agency) return;

    this.isProcessing.set(true);
    this.bookingService.cancelBookingByAgency(agency.id, b.id).subscribe({
      next: () => {
        this.isProcessing.set(false);
        this.closeRejectModal();
        this.toast.success('Booking rejected');
        this.router.navigate(['/dashboard/bookings']);
      },
      error: (e) => {
        this.isProcessing.set(false);
        this.toast.error(e.message || 'Failed to reject booking');
      }
    });
  }
}
