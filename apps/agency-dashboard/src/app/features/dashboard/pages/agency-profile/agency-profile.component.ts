import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  CardComponent,
  ButtonComponent,
  InputComponent,
  LoadingComponent,
  ToastService,
  BadgeComponent,
  ModalComponent,
  AvatarComponent
} from '@workspace/shared-ui';
import { AgencyService, StatisticsService } from '@workspace/core';
import { Agency, AgencyMember, AgencyStatistics, BusinessHours } from '@workspace/core';

@Component({
  selector: 'app-agency-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    CardComponent,
    ButtonComponent,
    InputComponent,
    LoadingComponent,
    BadgeComponent,
    ModalComponent,
    AvatarComponent
  ],
  template: `
    <div class="profile-page">
      @if (isLoading()) {
        <div class="loading-container">
          <app-loading size="lg" text="Loading agency profile..."></app-loading>
        </div>
      } @else {
        <!-- Profile Header / Hero Section -->
        <div class="profile-hero">
          <div class="hero-background">
            <div class="hero-overlay"></div>
          </div>
          <div class="hero-content">
            <div class="logo-section">
              <div class="logo-wrapper">
                @if (agency()?.logoUrl) {
                  <img [src]="agency()!.logoUrl" alt="Agency logo" class="agency-logo" />
                } @else {
                  <div class="logo-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/>
                      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/>
                      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/>
                      <path d="M10 6h4"/>
                      <path d="M10 10h4"/>
                      <path d="M10 14h4"/>
                      <path d="M10 18h4"/>
                    </svg>
                  </div>
                }
                <button class="edit-logo-btn" (click)="openLogoUpload()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                </button>
                <input type="file" accept="image/*" (change)="onLogoSelected($event)" id="logoInput" hidden />
              </div>
            </div>
            <div class="agency-info">
              <div class="name-row">
                <h1>{{ agency()?.name || 'Your Agency' }}</h1>
                @if (agency()?.verified) {
                  <div class="verified-badge" title="Verified Agency">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  </div>
                }
              </div>
              @if (agency()?.city || agency()?.country) {
                <p class="location">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  {{ getLocation() }}
                </p>
              }
              <div class="quick-actions">
                <button class="action-btn primary" routerLink="/dashboard/settings">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  Edit Settings
                </button>
                <button class="action-btn secondary" (click)="copyProfileLink()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
                  </svg>
                  Share Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon packages">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.operationalStats?.activePackages || 0 }}</span>
              <span class="stat-label">Active Packages</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon bookings">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.bookingStats?.totalBookings || 0 }}</span>
              <span class="stat-label">Total Bookings</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon customers">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ stats()?.customerStats?.totalCustomers || 0 }}</span>
              <span class="stat-label">Customers</span>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon rating">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div class="stat-info">
              <span class="stat-value">{{ (stats()?.feedbackStats?.overallAverageRating || 0) | number:'1.1-1' }}</span>
              <span class="stat-label">Avg. Rating</span>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="content-grid">
          <!-- Left Column -->
          <div class="left-column">
            <!-- About Section -->
            <app-card title="About" [showHeader]="true">
              <div class="about-section">
                @if (isEditingAbout()) {
                  <form [formGroup]="aboutForm" (ngSubmit)="saveAbout()">
                    <div class="form-group">
                      <app-input
                        label="Agency Name"
                        placeholder="Your agency name"
                        formControlName="name"
                        [error]="getAboutError('name')"
                        [required]="true"
                      ></app-input>
                    </div>
                    <div class="form-group">
                      <app-input
                        label="Description"
                        type="textarea"
                        placeholder="Tell customers about your agency, your expertise, and what makes you special..."
                        formControlName="description"
                        [rows]="5"
                      ></app-input>
                    </div>
                    <div class="form-actions">
                      <app-button variant="ghost" (onClick)="cancelEditAbout()">Cancel</app-button>
                      <app-button type="submit" [loading]="isSaving()" [disabled]="aboutForm.invalid">
                        Save Changes
                      </app-button>
                    </div>
                  </form>
                } @else {
                  <div class="about-content">
                    @if (agency()?.description) {
                      <p class="description">{{ agency()?.description }}</p>
                    } @else {
                      <p class="no-description">No description added yet. Tell your customers what makes your agency special!</p>
                    }
                    <button class="edit-btn" (click)="startEditAbout()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                  </div>
                }
              </div>
            </app-card>

            <!-- Contact Information -->
            <app-card title="Contact Information" [showHeader]="true">
              <div class="contact-section">
                @if (isEditingContact()) {
                  <form [formGroup]="contactForm" (ngSubmit)="saveContact()">
                    <div class="form-group">
                      <app-input
                        label="Phone Number"
                        type="tel"
                        placeholder="+1 234 567 8900"
                        formControlName="phoneNumber"
                      ></app-input>
                    </div>
                    <div class="form-group">
                      <app-input
                        label="Street Address"
                        placeholder="123 Main Street"
                        formControlName="addressLine"
                      ></app-input>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <app-input
                          label="City"
                          placeholder="New York"
                          formControlName="city"
                        ></app-input>
                      </div>
                      <div class="form-group">
                        <app-input
                          label="Country"
                          placeholder="United States"
                          formControlName="country"
                        ></app-input>
                      </div>
                    </div>
                    <div class="form-actions">
                      <app-button variant="ghost" (onClick)="cancelEditContact()">Cancel</app-button>
                      <app-button type="submit" [loading]="isSaving()" [disabled]="contactForm.pristine">
                        Save Changes
                      </app-button>
                    </div>
                  </form>
                } @else {
                  <div class="contact-list">
                    <div class="contact-item">
                      <div class="contact-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                      </div>
                      <div class="contact-details">
                        <span class="contact-label">Phone</span>
                        <span class="contact-value">{{ agency()?.phoneNumber || 'Not provided' }}</span>
                      </div>
                    </div>
                    <div class="contact-item">
                      <div class="contact-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      </div>
                      <div class="contact-details">
                        <span class="contact-label">Address</span>
                        <span class="contact-value">
                          @if (agency()?.addressLine || agency()?.city || agency()?.country) {
                            {{ getFullAddress() }}
                          } @else {
                            Not provided
                          }
                        </span>
                      </div>
                    </div>
                    <button class="edit-btn" (click)="startEditContact()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Edit
                    </button>
                  </div>
                }
              </div>
            </app-card>

            <!-- Social Media Links -->
            <app-card title="Social Media" [showHeader]="true">
              <div class="social-section">
                @if (isEditingSocial()) {
                  <form [formGroup]="socialForm" (ngSubmit)="saveSocial()">
                    <div class="form-group">
                      <div class="social-input">
                        <div class="social-icon facebook">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                          </svg>
                        </div>
                        <input type="url" placeholder="Facebook URL" formControlName="facebook" />
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="social-input">
                        <div class="social-icon instagram">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                          </svg>
                        </div>
                        <input type="url" placeholder="Instagram URL" formControlName="instagram" />
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="social-input">
                        <div class="social-icon twitter">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                        </div>
                        <input type="url" placeholder="X (Twitter) URL" formControlName="twitter" />
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="social-input">
                        <div class="social-icon website">
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          </svg>
                        </div>
                        <input type="url" placeholder="Website URL" formControlName="website" />
                      </div>
                    </div>
                    <div class="form-actions">
                      <app-button variant="ghost" (onClick)="cancelEditSocial()">Cancel</app-button>
                      <app-button type="submit" [loading]="isSaving()">
                        Save Links
                      </app-button>
                    </div>
                  </form>
                } @else {
                  <div class="social-links">
                    @if (hasSocialLinks()) {
                      @if (socialLinks().facebook) {
                        <a [href]="socialLinks().facebook" target="_blank" class="social-link facebook">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                          </svg>
                          Facebook
                        </a>
                      }
                      @if (socialLinks().instagram) {
                        <a [href]="socialLinks().instagram" target="_blank" class="social-link instagram">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                          </svg>
                          Instagram
                        </a>
                      }
                      @if (socialLinks().twitter) {
                        <a [href]="socialLinks().twitter" target="_blank" class="social-link twitter">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                          </svg>
                          X
                        </a>
                      }
                      @if (socialLinks().website) {
                        <a [href]="socialLinks().website" target="_blank" class="social-link website">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="2" y1="12" x2="22" y2="12"/>
                            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          </svg>
                          Website
                        </a>
                      }
                    } @else {
                      <p class="no-social">No social media links added yet.</p>
                    }
                    <button class="edit-btn" (click)="startEditSocial()">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      {{ hasSocialLinks() ? 'Edit' : 'Add Links' }}
                    </button>
                  </div>
                }
              </div>
            </app-card>
          </div>

          <!-- Right Column -->
          <div class="right-column">
            <!-- Business Hours -->
            <app-card title="Business Hours" [showHeader]="true">
              <div class="hours-section">
                @for (day of weekDays; track day.key) {
                  <div class="hours-row" [class.today]="isToday(day.key)" [class.closed]="businessHours()[day.key]?.closed">
                    <span class="day-name">
                      {{ day.label }}
                      @if (isToday(day.key)) {
                        <span class="today-badge">Today</span>
                      }
                    </span>
                    <span class="hours-value">
                      @if (businessHours()[day.key]?.closed) {
                        Closed
                      } @else {
                        {{ formatHour(businessHours()[day.key]?.open || 9) }} - {{ formatHour(businessHours()[day.key]?.close || 17) }}
                      }
                    </span>
                  </div>
                }
                <a routerLink="/dashboard/settings" class="edit-hours-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Edit in Settings
                </a>
              </div>
            </app-card>

            <!-- Team Members -->
            <app-card title="Team Members" [showHeader]="true">
              <div class="team-section">
                @if (isLoadingMembers()) {
                  <div class="loading-members">
                    <app-loading size="sm"></app-loading>
                  </div>
                } @else if (members().length === 0) {
                  <p class="no-members">No team members yet.</p>
                } @else {
                  <div class="members-list">
                    @for (member of members(); track $index) {
                      <div class="member-item">
                        <app-avatar
                          [name]="getMemberName(member)"
                          [src]="member.profileImageUrl"
                          size="md"
                        ></app-avatar>
                        <div class="member-info">
                          <span class="member-name">{{ getMemberName(member) }}</span>
                          <span class="member-email">{{ member.email }}</span>
                        </div>
                        <app-badge [variant]="getRoleBadgeVariant(member.role)">
                          {{ member.role }}
                        </app-badge>
                      </div>
                    }
                  </div>
                }
                <button class="add-member-btn" (click)="openAddMemberModal()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="8.5" cy="7" r="4"/>
                    <line x1="20" y1="8" x2="20" y2="14"/>
                    <line x1="23" y1="11" x2="17" y2="11"/>
                  </svg>
                  Add Team Member
                </button>
              </div>
            </app-card>

            <!-- Verification Status -->
            <app-card title="Verification Status" [showHeader]="true">
              <div class="verification-section">
                <div class="verification-items">
                  <div class="verification-item">
                    <div class="verification-icon" [class.verified]="agency()?.verificationStatus?.businessVerified">
                      @if (agency()?.verificationStatus?.businessVerified) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      }
                    </div>
                    <div class="verification-info">
                      <span class="verification-label">Business Verification</span>
                      <span class="verification-status">{{ agency()?.verificationStatus?.businessVerified ? 'Verified' : 'Pending' }}</span>
                    </div>
                  </div>
                  <div class="verification-item">
                    <div class="verification-icon" [class.verified]="agency()?.verificationStatus?.ownerVerified">
                      @if (agency()?.verificationStatus?.ownerVerified) {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="12"/>
                          <line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                      }
                    </div>
                    <div class="verification-info">
                      <span class="verification-label">Owner Verification</span>
                      <span class="verification-status">{{ agency()?.verificationStatus?.ownerVerified ? 'Verified' : 'Pending' }}</span>
                    </div>
                  </div>
                </div>
                @if (!agency()?.verified) {
                  <div class="verification-cta">
                    <p>Complete verification to build trust with customers and unlock premium features.</p>
                    <app-button variant="secondary" size="sm" (onClick)="startVerification()">
                      Start Verification
                    </app-button>
                  </div>
                }
              </div>
            </app-card>
          </div>
        </div>
      }
    </div>

    <!-- Add Member Modal -->
    <app-modal
      [isOpen]="showAddMemberModal()"
      title="Add Team Member"
      size="sm"
      [showFooter]="true"
      (closed)="closeAddMemberModal()"
    >
      <form [formGroup]="memberForm">
        <div class="form-group">
          <app-input
            label="Email Address"
            type="email"
            placeholder="team@example.com"
            formControlName="email"
            [error]="getMemberError('email')"
            [required]="true"
          ></app-input>
        </div>
        <div class="form-group">
          <label class="input-label">Role</label>
          <select formControlName="role" class="select-field">
            <option value="AGENT">Agent</option>
            <option value="MANAGER">Manager</option>
          </select>
        </div>
      </form>

      <div modal-footer>
        <app-button variant="ghost" (onClick)="closeAddMemberModal()">Cancel</app-button>
        <app-button [loading]="isAddingMember()" [disabled]="memberForm.invalid" (onClick)="addMember()">
          Send Invitation
        </app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .profile-page {
      max-width: 1200px;
      margin: 0 auto;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    /* Hero Section */
    .profile-hero {
      position: relative;
      background: white;
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 24px;
      border: 1px solid #e5e7eb;
    }

    .hero-background {
      height: 160px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      position: relative;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }

    .hero-content {
      display: flex;
      align-items: flex-end;
      gap: 24px;
      padding: 0 32px 24px;
      margin-top: -60px;
      position: relative;
      z-index: 1;
    }

    .logo-section {
      flex-shrink: 0;
    }

    .logo-wrapper {
      position: relative;
      width: 120px;
      height: 120px;
    }

    .agency-logo {
      width: 120px;
      height: 120px;
      border-radius: 16px;
      object-fit: cover;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .logo-placeholder {
      width: 120px;
      height: 120px;
      border-radius: 16px;
      background: #f9fafb;
      border: 4px solid white;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .edit-logo-btn {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 32px;
      height: 32px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.15s;

      &:hover {
        background: #f9fafb;
        color: #111827;
      }
    }

    .agency-info {
      flex: 1;
      padding-top: 68px;
    }

    .name-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 4px;

      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #111827;
        margin: 0;
      }
    }

    .verified-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      border-radius: 50%;
      color: white;
    }

    .location {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 16px;

      svg {
        flex-shrink: 0;
      }
    }

    .quick-actions {
      display: flex;
      gap: 12px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s;

      &.primary {
        background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
        border: none;
        color: white;

        &:hover {
          opacity: 0.9;
        }
      }

      &.secondary {
        background: white;
        border: 1px solid #e5e7eb;
        color: #374151;

        &:hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }
      }
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      margin-bottom: 24px;

      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .stat-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.packages {
        background: rgba(99, 102, 241, 0.1);
        color: #6366f1;
      }

      &.bookings {
        background: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }

      &.customers {
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;
      }

      &.rating {
        background: rgba(255, 78, 120, 0.1);
        color: #FF4E78;
      }
    }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
    }

    .stat-label {
      font-size: 13px;
      color: #6b7280;
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 24px;

      @media (max-width: 900px) {
        grid-template-columns: 1fr;
      }
    }

    .left-column, .right-column {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    /* About Section */
    .about-section {
      position: relative;
    }

    .about-content {
      position: relative;

      .description {
        font-size: 14px;
        color: #4b5563;
        line-height: 1.7;
        margin: 0;
        white-space: pre-wrap;
      }

      .no-description {
        font-size: 14px;
        color: #9ca3af;
        font-style: italic;
        margin: 0;
      }
    }

    .edit-btn {
      position: absolute;
      top: 0;
      right: 0;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #f3f4f6;
        color: #111827;
      }
    }

    /* Contact Section */
    .contact-section {
      position: relative;
    }

    .contact-list {
      position: relative;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-of-type {
        border-bottom: none;
      }
    }

    .contact-icon {
      width: 36px;
      height: 36px;
      background: #f9fafb;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      flex-shrink: 0;
    }

    .contact-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .contact-label {
      font-size: 12px;
      color: #9ca3af;
    }

    .contact-value {
      font-size: 14px;
      color: #111827;
    }

    /* Social Section */
    .social-section {
      position: relative;
    }

    .social-links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      position: relative;
    }

    .social-link {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: #f9fafb;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.15s;

      &.facebook {
        color: #1877f2;
        &:hover { background: rgba(24, 119, 242, 0.1); }
      }

      &.instagram {
        color: #e4405f;
        &:hover { background: rgba(228, 64, 95, 0.1); }
      }

      &.twitter {
        color: #000;
        &:hover { background: rgba(0, 0, 0, 0.05); }
      }

      &.website {
        color: #6b7280;
        &:hover { background: #f3f4f6; }
      }
    }

    .no-social {
      font-size: 14px;
      color: #9ca3af;
      font-style: italic;
      margin: 0;
    }

    .social-input {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 12px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;

      &:focus-within {
        border-color: #FF4E78;
        background: white;
      }

      input {
        flex: 1;
        border: none;
        background: none;
        font-size: 14px;
        color: #111827;
        outline: none;

        &::placeholder {
          color: #9ca3af;
        }
      }
    }

    .social-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.facebook { background: rgba(24, 119, 242, 0.1); color: #1877f2; }
      &.instagram { background: rgba(228, 64, 95, 0.1); color: #e4405f; }
      &.twitter { background: rgba(0, 0, 0, 0.05); color: #000; }
      &.website { background: rgba(107, 114, 128, 0.1); color: #6b7280; }
    }

    /* Hours Section */
    .hours-section {
      .hours-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        border-bottom: 1px solid #f3f4f6;

        &:last-of-type {
          border-bottom: none;
        }

        &.today {
          .day-name {
            color: #FF4E78;
            font-weight: 600;
          }
        }

        &.closed .hours-value {
          color: #ef4444;
        }
      }

      .day-name {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #111827;
      }

      .today-badge {
        padding: 2px 8px;
        background: rgba(255, 78, 120, 0.1);
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        color: #FF4E78;
      }

      .hours-value {
        font-size: 14px;
        color: #6b7280;
      }
    }

    .edit-hours-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-top: 16px;
      padding: 10px;
      background: #f9fafb;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      text-decoration: none;
      transition: all 0.15s;

      &:hover {
        background: #f3f4f6;
        color: #111827;
      }
    }

    /* Team Section */
    .team-section {
      .loading-members {
        display: flex;
        justify-content: center;
        padding: 24px;
      }

      .no-members {
        font-size: 14px;
        color: #9ca3af;
        font-style: italic;
        margin: 0;
        text-align: center;
        padding: 16px;
      }
    }

    .members-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .member-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: #f9fafb;
      border-radius: 10px;
    }

    .member-info {
      flex: 1;
      min-width: 0;

      .member-name {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: #111827;
      }

      .member-email {
        display: block;
        font-size: 12px;
        color: #6b7280;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .add-member-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      margin-top: 16px;
      padding: 12px;
      background: white;
      border: 2px dashed #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        border-color: #FF4E78;
        color: #FF4E78;
        background: rgba(255, 78, 120, 0.02);
      }
    }

    /* Verification Section */
    .verification-section {
      .verification-items {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .verification-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: #f9fafb;
        border-radius: 10px;
      }

      .verification-icon {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(245, 158, 11, 0.1);
        color: #f59e0b;

        &.verified {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
      }

      .verification-info {
        flex: 1;

        .verification-label {
          display: block;
          font-size: 14px;
          font-weight: 500;
          color: #111827;
        }

        .verification-status {
          display: block;
          font-size: 12px;
          color: #6b7280;
        }
      }

      .verification-cta {
        margin-top: 16px;
        padding: 16px;
        background: linear-gradient(135deg, rgba(255, 147, 112, 0.1) 0%, rgba(255, 78, 120, 0.1) 100%);
        border-radius: 10px;
        text-align: center;

        p {
          font-size: 13px;
          color: #6b7280;
          margin: 0 0 12px;
          line-height: 1.5;
        }
      }
    }

    /* Forms */
    .form-group {
      margin-bottom: 16px;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;

      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 16px;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;
    }

    .input-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #111827;
      margin-bottom: 6px;
    }

    .select-field {
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      color: #111827;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: #FF4E78;
      }
    }
  `]
})
export class AgencyProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private agencyService = inject(AgencyService);
  private statisticsService = inject(StatisticsService);
  private toast = inject(ToastService);

  // State
  isLoading = signal(true);
  isSaving = signal(false);
  isLoadingMembers = signal(true);
  isAddingMember = signal(false);
  agency = signal<Agency | null>(null);
  stats = signal<AgencyStatistics | null>(null);
  members = signal<AgencyMember[]>([]);
  businessHours = signal<BusinessHours>({});

  // Edit modes
  isEditingAbout = signal(false);
  isEditingContact = signal(false);
  isEditingSocial = signal(false);
  showAddMemberModal = signal(false);

  // Social links (stored locally since API might not support this yet)
  socialLinks = signal<{ facebook?: string; instagram?: string; twitter?: string; website?: string }>({});

  // Forms
  aboutForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['']
  });

  contactForm: FormGroup = this.fb.group({
    phoneNumber: [''],
    addressLine: [''],
    city: [''],
    country: ['']
  });

  socialForm: FormGroup = this.fb.group({
    facebook: [''],
    instagram: [''],
    twitter: [''],
    website: ['']
  });

  memberForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['AGENT', Validators.required]
  });

  weekDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  ngOnInit(): void {
    this.loadAgency();
    this.loadMembers();
    this.loadStatistics();
  }

  loadAgency(): void {
    const currentAgency = this.agencyService.getCurrentAgency();
    if (!currentAgency) {
      this.isLoading.set(false);
      return;
    }

    this.agencyService.getAgencyById(currentAgency.id).subscribe({
      next: (agency) => {
        this.agency.set(agency);
        this.populateForms(agency);
        if (agency.businessHours) {
          this.businessHours.set(agency.businessHours);
        } else {
          this.initDefaultBusinessHours();
        }
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Failed to load agency profile');
      }
    });
  }

  loadMembers(): void {
    const currentAgency = this.agencyService.getCurrentAgency();
    if (!currentAgency) {
      this.isLoadingMembers.set(false);
      return;
    }

    this.agencyService.getAgencyMembers(currentAgency.id).subscribe({
      next: (members) => {
        this.members.set((members || []).filter(m => m != null));
        this.isLoadingMembers.set(false);
      },
      error: () => {
        this.isLoadingMembers.set(false);
      }
    });
  }

  loadStatistics(): void {
    const currentAgency = this.agencyService.getCurrentAgency();
    if (!currentAgency) return;

    this.statisticsService.getComprehensiveStatistics(currentAgency.id).subscribe({
      next: (stats) => {
        this.stats.set(stats);
      },
      error: () => {
        // Silently fail - stats are not critical
      }
    });
  }

  populateForms(agency: Agency): void {
    this.aboutForm.patchValue({
      name: agency.name,
      description: agency.description || ''
    });

    this.contactForm.patchValue({
      phoneNumber: agency.phoneNumber || '',
      addressLine: agency.addressLine || '',
      city: agency.city || '',
      country: agency.country || ''
    });

    // Load social links from localStorage (or API when supported)
    const savedSocial = localStorage.getItem(`agency_social_${agency.id}`);
    if (savedSocial) {
      try {
        const social = JSON.parse(savedSocial);
        this.socialLinks.set(social);
        this.socialForm.patchValue(social);
      } catch (e) {
        // Ignore parse errors
      }
    }
  }

  initDefaultBusinessHours(): void {
    const defaultHours: BusinessHours = {};
    this.weekDays.forEach(day => {
      defaultHours[day.key] = {
        open: 9,
        close: 17,
        closed: day.key === 'saturday' || day.key === 'sunday'
      };
    });
    this.businessHours.set(defaultHours);
  }

  // About editing
  startEditAbout(): void {
    this.isEditingAbout.set(true);
  }

  cancelEditAbout(): void {
    const agency = this.agency();
    if (agency) {
      this.aboutForm.patchValue({
        name: agency.name,
        description: agency.description || ''
      });
    }
    this.isEditingAbout.set(false);
  }

  saveAbout(): void {
    if (this.aboutForm.invalid) return;
    const agency = this.agency();
    if (!agency) return;

    this.isSaving.set(true);

    this.agencyService.updateAgency(agency.id, this.aboutForm.value).subscribe({
      next: (updatedAgency) => {
        this.agency.set(updatedAgency);
        this.isSaving.set(false);
        this.isEditingAbout.set(false);
        this.toast.success('Profile updated successfully');
      },
      error: (error) => {
        this.isSaving.set(false);
        this.toast.error(error.message || 'Failed to update profile');
      }
    });
  }

  getAboutError(field: string): string | undefined {
    const control = this.aboutForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) return 'Name is too short';
    }
    return undefined;
  }

  // Contact editing
  startEditContact(): void {
    this.isEditingContact.set(true);
  }

  cancelEditContact(): void {
    const agency = this.agency();
    if (agency) {
      this.contactForm.patchValue({
        phoneNumber: agency.phoneNumber || '',
        addressLine: agency.addressLine || '',
        city: agency.city || '',
        country: agency.country || ''
      });
    }
    this.isEditingContact.set(false);
  }

  saveContact(): void {
    const agency = this.agency();
    if (!agency) return;

    this.isSaving.set(true);

    this.agencyService.updateAgency(agency.id, this.contactForm.value).subscribe({
      next: (updatedAgency) => {
        this.agency.set(updatedAgency);
        this.isSaving.set(false);
        this.isEditingContact.set(false);
        this.contactForm.markAsPristine();
        this.toast.success('Contact information updated');
      },
      error: (error) => {
        this.isSaving.set(false);
        this.toast.error(error.message || 'Failed to update contact');
      }
    });
  }

  // Social editing
  startEditSocial(): void {
    this.isEditingSocial.set(true);
  }

  cancelEditSocial(): void {
    this.socialForm.patchValue(this.socialLinks());
    this.isEditingSocial.set(false);
  }

  saveSocial(): void {
    const agency = this.agency();
    if (!agency) return;

    this.isSaving.set(true);

    // Save to localStorage (API support to be added later)
    const social = this.socialForm.value;
    localStorage.setItem(`agency_social_${agency.id}`, JSON.stringify(social));
    this.socialLinks.set(social);

    this.isSaving.set(false);
    this.isEditingSocial.set(false);
    this.toast.success('Social links updated');
  }

  hasSocialLinks(): boolean {
    const links = this.socialLinks();
    return !!(links.facebook || links.instagram || links.twitter || links.website);
  }

  // Logo upload
  openLogoUpload(): void {
    document.getElementById('logoInput')?.click();
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const agency = this.agency();
      if (!agency) return;

      this.agencyService.uploadAgencyLogo(agency.id, file).subscribe({
        next: (updatedAgency) => {
          this.agency.set(updatedAgency);
          this.toast.success('Logo updated successfully');
        },
        error: () => {
          this.toast.error('Failed to upload logo');
        }
      });
    }
  }

  // Team members
  openAddMemberModal(): void {
    this.memberForm.reset({ role: 'AGENT' });
    this.showAddMemberModal.set(true);
  }

  closeAddMemberModal(): void {
    this.showAddMemberModal.set(false);
  }

  addMember(): void {
    if (this.memberForm.invalid) return;
    const agency = this.agency();
    if (!agency) return;

    this.isAddingMember.set(true);

    this.agencyService.addAgencyMember(agency.id, this.memberForm.value).subscribe({
      next: (member) => {
        if (member) {
          this.members.update(members => [...members, member]);
        }
        this.isAddingMember.set(false);
        this.closeAddMemberModal();
        this.toast.success('Invitation sent successfully');
      },
      error: (error) => {
        this.isAddingMember.set(false);
        this.toast.error(error.message || 'Failed to add team member');
      }
    });
  }

  getMemberError(field: string): string | undefined {
    const control = this.memberForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Invalid email address';
    }
    return undefined;
  }

  getMemberName(member: AgencyMember): string {
    if (member.firstName || member.lastName) {
      return `${member.firstName || ''} ${member.lastName || ''}`.trim();
    }
    return member.email.split('@')[0];
  }

  getRoleBadgeVariant(role: string): 'default' | 'primary' | 'success' | 'warning' | 'danger' {
    const variants: Record<string, 'default' | 'primary' | 'success' | 'warning' | 'danger'> = {
      'OWNER': 'primary',
      'MANAGER': 'success',
      'AGENT': 'default'
    };
    return variants[role] || 'default';
  }

  // Utilities
  getLocation(): string {
    const agency = this.agency();
    const parts = [agency?.city, agency?.country].filter(part => !!part);
    return parts.join(', ');
  }

  getFullAddress(): string {
    const agency = this.agency();
    const parts = [agency?.addressLine, agency?.city, agency?.country].filter(part => !!part);
    return parts.join(', ');
  }

  formatHour(hour: number): string {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${suffix}`;
  }

  isToday(dayKey: string): boolean {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = new Date().getDay();
    return days[today] === dayKey;
  }

  copyProfileLink(): void {
    const agency = this.agency();
    if (!agency) return;

    // Generate a sharable link (would be the public profile URL in production)
    const link = `${window.location.origin}/agencies/${agency.id}`;
    navigator.clipboard.writeText(link).then(() => {
      this.toast.success('Profile link copied to clipboard');
    }).catch(() => {
      this.toast.error('Failed to copy link');
    });
  }

  startVerification(): void {
    this.toast.info('Verification process will be available soon');
  }
}
