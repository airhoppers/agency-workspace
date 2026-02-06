import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AgencyService, AuthService } from '@workspace/core';
import { ToastService } from '@workspace/shared-ui';
import { CreateAgencyRequest, User } from '@workspace/core';

interface QuickTip {
  icon: string;
  title: string;
  description: string;
}

interface Specialty {
  id: string;
  label: string;
  icon: string;
  selected: boolean;
}

@Component({
  selector: 'app-create-agency',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-container">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
          </div>
          <div class="brand">
            <span class="brand-name">AirHoppers</span>
            <span class="brand-subtitle">Agency Management Portal</span>
          </div>
        </div>
        <div class="header-right">
          <button class="notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
          @if (authService.currentUser$ | async; as user) {
            <div class="user-menu">
              <div class="avatar">
                <img [src]="'https://ui-avatars.com/api/?name=' + user.firstName + '+' + user.lastName + '&background=FF4E78&color=fff'" alt="User avatar" />
              </div>
              <div class="user-info">
                <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                <span class="user-email">{{ user.email }}</span>
              </div>
            </div>
          } @else {
            <div class="user-menu">
              <div class="avatar">
                <div class="avatar-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </div>
            </div>
          }
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Breadcrumb -->
        <nav class="breadcrumb">
          <a routerLink="/select-agency">Agencies</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span>Create New Agency</span>
        </nav>

        <!-- Page Header -->
        <div class="page-header">
          <div class="page-header-content">
            <h1>Create New Travel Agency</h1>
            <p>Fill in the details below to set up your new travel agency</p>
          </div>
        </div>

        <div class="content-grid">
          <!-- Form Column -->
          <div class="form-column">
            <form [formGroup]="agencyForm" (ngSubmit)="onSubmit()">
              <!-- Basic Information Section -->
              <section class="form-section">
                <div class="section-header">
                  <div class="section-title-wrapper">
                    <h2>Basic Information</h2>
                    <p>Essential details about your travel agency</p>
                  </div>
                  <div class="section-icon blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                </div>

                <div class="form-group">
                  <label class="field-label">Agency Name <span class="required">*</span></label>
                  <input
                    type="text"
                    formControlName="name"
                    placeholder="e.g., Paradise Travel Co."
                    class="form-input"
                  />
                  <span class="field-hint">This will be the official name displayed to customers</span>
                  @if (getFieldError('name')) {
                    <span class="field-error">{{ getFieldError('name') }}</span>
                  }
                </div>

                <div class="form-group">
                  <label class="field-label">Agency Description <span class="required">*</span></label>
                  <textarea
                    formControlName="description"
                    placeholder="Describe your agency's specialties, target markets, unique selling points, and what makes your services special..."
                    class="form-input textarea"
                    rows="4"
                  ></textarea>
                  <div class="field-footer">
                    <span class="field-hint">Help customers understand what makes your agency unique</span>
                    <span class="char-count">{{ agencyForm.get('description')?.value?.length || 0 }} / 500</span>
                  </div>
                  @if (getFieldError('description')) {
                    <span class="field-error">{{ getFieldError('description') }}</span>
                  }
                </div>
              </section>

              <!-- Location Details Section -->
              <section class="form-section">
                <div class="section-header">
                  <div class="section-title-wrapper">
                    <h2>Location Details</h2>
                    <p>Where your agency is located</p>
                  </div>
                  <div class="section-icon green">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                      <circle cx="12" cy="10" r="3"/>
                    </svg>
                  </div>
                </div>

                <div class="form-group">
                  <label class="field-label">Address Line <span class="required">*</span></label>
                  <input
                    type="text"
                    formControlName="address"
                    placeholder="Street address, building number, suite"
                    class="form-input"
                  />
                  <span class="field-hint">Include street name, building number, and suite/unit if applicable</span>
                  @if (getFieldError('address')) {
                    <span class="field-error">{{ getFieldError('address') }}</span>
                  }
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="field-label">City <span class="required">*</span></label>
                    <input
                      type="text"
                      formControlName="city"
                      placeholder="e.g., Miami"
                      class="form-input"
                    />
                    @if (getFieldError('city')) {
                      <span class="field-error">{{ getFieldError('city') }}</span>
                    }
                  </div>
                  <div class="form-group">
                    <label class="field-label">State/Province</label>
                    <input
                      type="text"
                      formControlName="state"
                      placeholder="e.g., Florida"
                      class="form-input"
                    />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="field-label">Country <span class="required">*</span></label>
                    <div class="select-wrapper">
                      <select formControlName="country" class="form-input select">
                        <option value="">Select country</option>
                        @for (country of countries; track country.code) {
                          <option [value]="country.code">{{ country.name }}</option>
                        }
                      </select>
                      <svg class="select-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"/>
                      </svg>
                    </div>
                    @if (getFieldError('country')) {
                      <span class="field-error">{{ getFieldError('country') }}</span>
                    }
                  </div>
                  <div class="form-group">
                    <label class="field-label">Postal Code</label>
                    <input
                      type="text"
                      formControlName="postalCode"
                      placeholder="e.g., 33101"
                      class="form-input"
                    />
                  </div>
                </div>
              </section>

              <!-- Contact Information Section -->
              <section class="form-section">
                <div class="section-header">
                  <div class="section-title-wrapper">
                    <h2>Contact Information</h2>
                    <p>How customers can reach your agency</p>
                  </div>
                  <div class="section-icon blue">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                </div>

                <div class="form-group">
                  <label class="field-label">Phone Number <span class="required">*</span></label>
                  <div class="input-with-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                    <input
                      type="tel"
                      formControlName="phone"
                      placeholder="+1 (555) 123-4567"
                      class="form-input with-icon"
                    />
                  </div>
                  <span class="field-hint">Include country code for international customers</span>
                  @if (getFieldError('phone')) {
                    <span class="field-error">{{ getFieldError('phone') }}</span>
                  }
                </div>

                <div class="form-group">
                  <label class="field-label">Email Address <span class="required">*</span></label>
                  <div class="input-with-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    <input
                      type="email"
                      formControlName="email"
                      placeholder="contact@agency.com"
                      class="form-input with-icon"
                    />
                  </div>
                  <span class="field-hint">Primary email for customer inquiries and bookings</span>
                  @if (getFieldError('email')) {
                    <span class="field-error">{{ getFieldError('email') }}</span>
                  }
                </div>

                <div class="form-group">
                  <label class="field-label">Website URL</label>
                  <div class="input-with-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    </svg>
                    <input
                      type="url"
                      formControlName="website"
                      placeholder="https://www.youragency.com"
                      class="form-input with-icon"
                    />
                  </div>
                  <span class="field-hint">Optional: Link to your existing website</span>
                </div>
              </section>

              <!-- Branding & Media Section -->
              <section class="form-section">
                <div class="section-header">
                  <div class="section-title-wrapper">
                    <h2>Branding & Media</h2>
                    <p>Upload your agency logo and brand assets</p>
                  </div>
                  <div class="section-icon pink">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                </div>

                <div class="form-group">
                  <label class="field-label">Agency Logo <span class="required">*</span></label>
                  <div
                    class="upload-area"
                    [class.has-file]="selectedLogo()"
                    [class.dragging]="isDragging()"
                    (dragover)="onDragOver($event)"
                    (dragleave)="onDragLeave($event)"
                    (drop)="onDrop($event)"
                    (click)="fileInput.click()"
                  >
                    @if (selectedLogo()) {
                      <div class="preview-container">
                        <img [src]="logoPreview()" alt="Logo preview" class="logo-preview" />
                        <button type="button" class="remove-btn" (click)="removeLogo($event)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </div>
                    } @else {
                      <div class="upload-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                          <polyline points="17 8 12 3 7 8"/>
                          <line x1="12" y1="3" x2="12" y2="15"/>
                        </svg>
                      </div>
                      <p class="upload-text">Click to upload or drag and drop</p>
                      <p class="upload-hint">PNG, JPG, SVG up to 5MB</p>
                      <p class="upload-hint">Recommended size: 400x400px or larger</p>
                    }
                    <input
                      #fileInput
                      type="file"
                      accept="image/png,image/jpeg,image/svg+xml"
                      (change)="onFileSelected($event)"
                      hidden
                    />
                  </div>
                  <span class="field-hint">This logo will appear on your agency profile and packages</span>
                </div>

                <div class="branding-tip">
                  <div class="tip-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </div>
                  <div class="tip-content">
                    <strong>Branding Tip</strong>
                    <p>Use a high-quality logo with transparent background for best results. Square format works best across all platforms.</p>
                  </div>
                </div>
              </section>

              <!-- Specialties & Services Section -->
              <section class="form-section">
                <div class="section-header">
                  <div class="section-title-wrapper">
                    <h2>Specialties & Services</h2>
                    <p>What types of travel do you specialize in?</p>
                  </div>
                  <div class="section-icon orange">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  </div>
                </div>

                <label class="field-label">Select Your Specialties</label>
                <div class="specialties-grid">
                  @for (specialty of specialties(); track specialty.id) {
                    <label class="specialty-item" [class.selected]="specialty.selected">
                      <input
                        type="checkbox"
                        [checked]="specialty.selected"
                        (change)="toggleSpecialty(specialty.id)"
                      />
                      <span class="specialty-icon" [innerHTML]="specialty.icon"></span>
                      <span class="specialty-label">{{ specialty.label }}</span>
                      <span class="checkmark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </span>
                    </label>
                  }
                </div>
              </section>

              <!-- Terms Section -->
              <section class="terms-section">
                <label class="checkbox-item">
                  <input type="checkbox" formControlName="agreeToTerms" />
                  <span class="custom-checkbox">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  <span class="checkbox-text">
                    I agree to the
                    <a href="#" class="link">Terms of Service</a>
                    and
                    <a href="#" class="link">Privacy Policy</a>
                  </span>
                </label>
                <p class="terms-hint">By creating an agency, you agree to comply with our platform guidelines and policies</p>

                <label class="checkbox-item">
                  <input type="checkbox" formControlName="receiveUpdates" />
                  <span class="custom-checkbox">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                  <span class="checkbox-text">Send me tips, updates, and promotional offers</span>
                </label>
                <p class="terms-hint">Stay informed about new features and best practices for travel agencies</p>
              </section>

              <!-- Form Actions -->
              <div class="form-actions">
                <button type="button" class="btn-cancel" routerLink="/select-agency">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"/>
                    <polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Cancel
                </button>
                <button type="button" class="btn-draft" (click)="saveDraft()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                  </svg>
                  Save Draft
                </button>
                <button type="submit" class="btn-submit" [disabled]="isSubmitting()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ isSubmitting() ? 'Creating...' : 'Create Agency' }}
                </button>
              </div>
            </form>
          </div>

          <!-- Sidebar Column -->
          <aside class="sidebar-column">
            <!-- Need Help Card -->
            <div class="sidebar-card help-card">
              <div class="help-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3>Need Help?</h3>
              <p>Our support team is here to assist you with setting up your travel agency.</p>
              <div class="help-links">
                <a href="#" class="help-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                  </svg>
                  View Setup Guide
                </a>
                <a href="#" class="help-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="23 7 16 12 23 17 23 7"/>
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                  </svg>
                  Watch Tutorial Video
                </a>
                <a href="#" class="help-link">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                  Chat with Support
                </a>
              </div>
            </div>

            <!-- Quick Tips -->
            <div class="sidebar-card tips-card">
              <div class="tips-header">
                <span class="tips-icon">💡</span>
                <h3>Quick Tips</h3>
              </div>
              <div class="tips-list">
                @for (tip of quickTips; track tip.title) {
                  <div class="tip-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    <div class="tip-text">
                      <strong>{{ tip.title }}</strong>
                      <span>{{ tip.description }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Secure & Private -->
            <div class="sidebar-card security-card">
              <div class="security-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h4>Secure & Private</h4>
              <p>Your information is encrypted and protected. We never share your data without permission.</p>
            </div>
          </aside>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="footer-logo">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
              <span>AirHoppers</span>
            </div>
            <p class="footer-tagline">Agency Portal</p>
            <p class="footer-desc">Empowering travel agencies to create unforgettable experiences worldwide.</p>
          </div>
          <div class="footer-links-grid">
            <div class="footer-links-column">
              <h5>Product</h5>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
              <a href="#">Integrations</a>
              <a href="#">API</a>
            </div>
            <div class="footer-links-column">
              <h5>Resources</h5>
              <a href="#">Documentation</a>
              <a href="#">Tutorials</a>
              <a href="#">Blog</a>
              <a href="#">Support</a>
            </div>
            <div class="footer-links-column">
              <h5>Company</h5>
              <a href="#">About Us</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
              <a href="#">Partners</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} AirHoppers. All rights reserved.</p>
          <div class="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
          <div class="social-links">
            <a href="#" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
            </a>
            <a href="#" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/>
              </svg>
            </a>
            <a href="#" class="social-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    /* Page Container */
    .page-container {
      min-height: 100vh;
      background-color: #f8f9fa;
      display: flex;
      flex-direction: column;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 32px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
    }

    .brand-subtitle {
      font-size: 12px;
      color: #6b7280;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .notification-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: #f3f4f6;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: background 0.2s;

      &:hover {
        background: #e5e7eb;
      }
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .avatar img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .user-email {
      font-size: 12px;
      color: #6b7280;
    }

    /* Main Content */
    .main-content {
      flex: 1;
      max-width: 1200px;
      width: 100%;
      margin: 0 auto;
      padding: 24px 32px 48px;
    }

    /* Breadcrumb */
    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      font-size: 14px;

      a {
        color: #6b7280;
        text-decoration: none;

        &:hover {
          color: #111827;
        }
      }

      svg {
        color: #9ca3af;
      }

      span {
        color: #111827;
        font-weight: 500;
      }
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 32px;
    }

    .page-header-content {
      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 15px;
        color: #6b7280;
        margin: 0;
      }
    }

    /* Content Grid */
    .content-grid {
      display: grid;
      grid-template-columns: 1fr 340px;
      gap: 32px;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }

    /* Form Column */
    .form-column {
      display: flex;
      flex-direction: column;

      form {
        display: flex;
        flex-direction: column;
        gap: 24px;
      }
    }

    /* Form Section */
    .form-section {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e5e7eb;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .section-title-wrapper {
      h2 {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }
    }

    .section-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.blue {
        background: #e0f2fe;
        color: #0284c7;
      }

      &.green {
        background: #d1fae5;
        color: #059669;
      }

      &.pink {
        background: #fce7f3;
        color: #db2777;
      }

      &.orange {
        background: #ffedd5;
        color: #ea580c;
      }
    }

    /* Form Groups */
    .form-group {
      margin-bottom: 20px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .field-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;

      .required {
        color: #ef4444;
      }
    }

    .form-input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      font-size: 14px;
      color: #111827;
      background: white;
      transition: border-color 0.2s, box-shadow 0.2s;
      box-sizing: border-box;

      &::placeholder {
        color: #9ca3af;
      }

      &:focus {
        outline: none;
        border-color: #FF4E78;
        box-shadow: 0 0 0 3px rgba(255, 78, 120, 0.1);
      }

      &.textarea {
        resize: vertical;
        min-height: 100px;
        font-family: inherit;
      }

      &.select {
        appearance: none;
        cursor: pointer;
      }

      &.with-icon {
        padding-left: 44px;
      }
    }

    .select-wrapper {
      position: relative;

      .select-arrow {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #6b7280;
        pointer-events: none;
      }
    }

    .input-with-icon {
      position: relative;

      svg {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
      }
    }

    .field-hint {
      display: block;
      font-size: 12px;
      color: #6b7280;
      margin-top: 6px;
    }

    .field-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
    }

    .char-count {
      font-size: 12px;
      color: #9ca3af;
    }

    .field-error {
      display: block;
      font-size: 12px;
      color: #ef4444;
      margin-top: 6px;
    }

    /* Upload Area */
    .upload-area {
      border: 2px dashed #e5e7eb;
      border-radius: 12px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
      background: #fafafa;

      &:hover {
        border-color: #d1d5db;
        background: #f5f5f5;
      }

      &.dragging {
        border-color: #FF4E78;
        background: rgba(255, 78, 120, 0.05);
      }

      &.has-file {
        padding: 20px;
        border-style: solid;
        border-color: #e5e7eb;
      }
    }

    .upload-icon {
      color: #9ca3af;
      margin-bottom: 12px;
    }

    .upload-text {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin: 0 0 4px 0;
    }

    .upload-hint {
      font-size: 12px;
      color: #9ca3af;
      margin: 0;
    }

    .preview-container {
      position: relative;
      display: inline-block;
    }

    .logo-preview {
      max-width: 150px;
      max-height: 150px;
      border-radius: 12px;
      object-fit: contain;
    }

    .remove-btn {
      position: absolute;
      top: -8px;
      right: -8px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #ef4444;
      border: 2px solid white;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;

      &:hover {
        background: #dc2626;
      }
    }

    /* Branding Tip */
    .branding-tip {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #fef3c7;
      border-radius: 10px;
      margin-top: 16px;
    }

    .tip-icon {
      width: 32px;
      height: 32px;
      background: #fbbf24;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      flex-shrink: 0;
    }

    .tip-content {
      strong {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #92400e;
        margin-bottom: 2px;
      }

      p {
        font-size: 13px;
        color: #a16207;
        margin: 0;
        line-height: 1.4;
      }
    }

    /* Specialties Grid */
    .specialties-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;

      @media (max-width: 768px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 480px) {
        grid-template-columns: 1fr;
      }
    }

    .specialty-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;

      input[type="checkbox"] {
        display: none;
      }

      &:hover {
        border-color: #d1d5db;
        background: #f9fafb;
      }

      &.selected {
        border-color: #FF4E78;
        background: rgba(255, 78, 120, 0.05);

        .checkmark {
          opacity: 1;
        }
      }
    }

    .specialty-icon {
      font-size: 18px;
    }

    .specialty-label {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      flex: 1;
    }

    .checkmark {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #FF4E78;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      opacity: 0;
      transition: opacity 0.2s;
    }

    /* Terms Section */
    .terms-section {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e5e7eb;
    }

    .checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      cursor: pointer;

      input[type="checkbox"] {
        display: none;

        &:checked + .custom-checkbox {
          background: #FF4E78;
          border-color: #FF4E78;

          svg {
            opacity: 1;
          }
        }
      }
    }

    .custom-checkbox {
      width: 20px;
      height: 20px;
      border: 2px solid #d1d5db;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
      transition: all 0.2s;

      svg {
        color: white;
        opacity: 0;
        transition: opacity 0.2s;
      }
    }

    .checkbox-text {
      font-size: 14px;
      color: #374151;
      line-height: 1.5;

      .link {
        color: #FF4E78;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .terms-hint {
      font-size: 12px;
      color: #6b7280;
      margin: 4px 0 20px 32px;
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      gap: 12px;
      padding-top: 8px;
    }

    .btn-cancel {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      background: white;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }
    }

    .btn-draft {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: 1px solid #FF4E78;
      border-radius: 10px;
      background: white;
      font-size: 14px;
      font-weight: 500;
      color: #FF4E78;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(255, 78, 120, 0.05);
      }
    }

    .btn-submit {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 10px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      font-size: 14px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        opacity: 0.9;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    /* Sidebar Column */
    .sidebar-column {
      display: flex;
      flex-direction: column;
      gap: 20px;

      @media (max-width: 1024px) {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .sidebar-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      border: 1px solid #e5e7eb;
    }

    /* Help Card */
    .help-card {
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      color: white;
      border: none;

      .help-icon {
        width: 48px;
        height: 48px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 12px;
      }

      h3 {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 8px 0;
      }

      p {
        font-size: 14px;
        opacity: 0.9;
        margin: 0 0 16px 0;
        line-height: 1.5;
      }
    }

    .help-links {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .help-link {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      color: white;
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
    }

    /* Tips Card */
    .tips-card {
      .tips-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 16px;

        .tips-icon {
          font-size: 20px;
        }

        h3 {
          font-size: 16px;
          font-weight: 600;
          color: #111827;
          margin: 0;
        }
      }
    }

    .tips-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .tip-item {
      display: flex;
      gap: 10px;

      svg {
        color: #10b981;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .tip-text {
        display: flex;
        flex-direction: column;
        gap: 2px;

        strong {
          font-size: 14px;
          font-weight: 500;
          color: #111827;
        }

        span {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.4;
        }
      }
    }

    /* Security Card */
    .security-card {
      background: #fef2f2;
      border-color: #fecaca;

      .security-icon {
        width: 40px;
        height: 40px;
        background: #fee2e2;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ef4444;
        margin-bottom: 12px;
      }

      h4 {
        font-size: 15px;
        font-weight: 600;
        color: #991b1b;
        margin: 0 0 6px 0;
      }

      p {
        font-size: 13px;
        color: #b91c1c;
        margin: 0;
        line-height: 1.4;
      }
    }

    /* Footer */
    .footer {
      background: #1e293b;
      color: white;
      padding: 48px 32px 24px;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 48px;
      margin-bottom: 32px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 32px;
      }
    }

    .footer-brand {
      .footer-logo {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 4px;

        svg {
          color: #FF4E78;
        }

        span {
          font-size: 18px;
          font-weight: 700;
        }
      }

      .footer-tagline {
        font-size: 12px;
        color: #94a3b8;
        margin: 0 0 12px 0;
      }

      .footer-desc {
        font-size: 14px;
        color: #94a3b8;
        line-height: 1.6;
        margin: 0;
      }
    }

    .footer-links-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 32px;

      @media (max-width: 640px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .footer-links-column {
      h5 {
        font-size: 14px;
        font-weight: 600;
        color: white;
        margin: 0 0 16px 0;
      }

      a {
        display: block;
        font-size: 14px;
        color: #94a3b8;
        text-decoration: none;
        margin-bottom: 10px;
        transition: color 0.2s;

        &:hover {
          color: white;
        }
      }
    }

    .footer-bottom {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 24px;
      border-top: 1px solid #334155;
      flex-wrap: wrap;
      gap: 16px;

      p {
        font-size: 13px;
        color: #64748b;
        margin: 0;
      }
    }

    .footer-bottom-links {
      display: flex;
      gap: 24px;

      a {
        font-size: 13px;
        color: #64748b;
        text-decoration: none;

        &:hover {
          color: #94a3b8;
        }
      }
    }

    .social-links {
      display: flex;
      gap: 12px;
    }

    .social-link {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      background: #334155;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      transition: all 0.2s;

      &:hover {
        background: #475569;
        color: white;
      }
    }
  `]
})
export class CreateAgencyComponent implements OnInit {
  private fb = inject(FormBuilder);
  private agencyService = inject(AgencyService);
  authService = inject(AuthService);  // public for template
  private router = inject(Router);
  private toast = inject(ToastService);

  isSubmitting = signal(false);
  selectedLogo = signal<File | null>(null);
  logoPreview = signal<string>('');
  isDragging = signal(false);

  
  currentYear = new Date().getFullYear();

  ngOnInit(): void {
    // Ensure user profile is loaded
    this.authService.reloadUserProfile();
  }

  agencyForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: [''],
    country: ['', [Validators.required]],
    postalCode: [''],
    phone: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    website: [''],
    agreeToTerms: [false, [Validators.requiredTrue]],
    receiveUpdates: [false]
  });

  countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
    { code: 'AU', name: 'Australia' },
    { code: 'DE', name: 'Germany' },
    { code: 'FR', name: 'France' },
    { code: 'IT', name: 'Italy' },
    { code: 'ES', name: 'Spain' },
    { code: 'JP', name: 'Japan' },
    { code: 'BR', name: 'Brazil' },
    { code: 'MX', name: 'Mexico' },
    { code: 'IN', name: 'India' },
    { code: 'CN', name: 'China' },
    { code: 'NL', name: 'Netherlands' },
    { code: 'CH', name: 'Switzerland' },
    { code: 'SE', name: 'Sweden' },
    { code: 'NO', name: 'Norway' },
    { code: 'DK', name: 'Denmark' },
    { code: 'NZ', name: 'New Zealand' },
    { code: 'SG', name: 'Singapore' }
  ];

  quickTips: QuickTip[] = [
    {
      icon: 'logo',
      title: 'Use a professional logo',
      description: 'High-quality branding builds trust with customers'
    },
    {
      icon: 'description',
      title: 'Be specific in descriptions',
      description: 'Clear details help attract the right customers'
    },
    {
      icon: 'complete',
      title: 'Complete all fields',
      description: 'More information means better visibility'
    }
  ];

  specialties = signal<Specialty[]>([
    { id: 'adventure', label: 'Adventure', icon: '⛰️', selected: false },
    { id: 'beach', label: 'Beach Resort', icon: '🏖️', selected: false },
    { id: 'cultural', label: 'Cultural', icon: '🏛️', selected: false },
    { id: 'luxury', label: 'Luxury', icon: '💎', selected: false },
    { id: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', selected: false },
    { id: 'honeymoon', label: 'Honeymoon', icon: '💕', selected: false },
    { id: 'cruise', label: 'Cruise', icon: '🚢', selected: false },
    { id: 'backpacking', label: 'Backpacking', icon: '🎒', selected: false },
    { id: 'wellness', label: 'Wellness', icon: '🧘', selected: false }
  ]);

  getFieldError(field: string): string | undefined {
    const control = this.agencyForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        const fieldNames: Record<string, string> = {
          name: 'Agency name',
          description: 'Description',
          address: 'Address',
          city: 'City',
          country: 'Country',
          phone: 'Phone number',
          email: 'Email'
        };
        return `${fieldNames[field] || field} is required`;
      }
      if (control.errors['email']) return 'Please enter a valid email address';
      if (control.errors['minlength']) {
        const minLength = control.errors['minlength'].requiredLength;
        return `Must be at least ${minLength} characters`;
      }
      if (control.errors['maxlength']) {
        const maxLength = control.errors['maxlength'].requiredLength;
        return `Must be no more than ${maxLength} characters`;
      }
    }
    return undefined;
  }

  toggleSpecialty(id: string): void {
    this.specialties.update(specialties =>
      specialties.map(s => s.id === id ? { ...s, selected: !s.selected } : s)
    );
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  handleFile(file: File): void {
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      this.toast.error('Please upload a PNG, JPG, or SVG file');
      return;
    }

    if (file.size > maxSize) {
      this.toast.error('File size must be less than 5MB');
      return;
    }

    this.selectedLogo.set(file);

    const reader = new FileReader();
    reader.onload = () => {
      this.logoPreview.set(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  removeLogo(event: Event): void {
    event.stopPropagation();
    this.selectedLogo.set(null);
    this.logoPreview.set('');
  }

  saveDraft(): void {
    this.toast.info('Draft saved successfully');
  }

  onSubmit(): void {
    if (this.agencyForm.invalid) {
      this.agencyForm.markAllAsTouched();
      this.toast.error('Please fill in all required fields');
      return;
    }

    if (!this.agencyForm.get('agreeToTerms')?.value) {
      this.toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    this.isSubmitting.set(true);

    const formValues = this.agencyForm.value;

    // Map form values to CreateAgencyRequest format
    const createRequest: CreateAgencyRequest = {
      name: formValues.name,
      description: formValues.description,
      addressLine: formValues.address,
      city: formValues.city,
      country: formValues.country,
      phoneNumber: formValues.phone
    };

    const logoFile = this.selectedLogo() || undefined;

    this.agencyService.createAgency(createRequest, logoFile).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.toast.success('Your travel agency has been created successfully!', 'Agency Created');
        this.router.navigate(['/select-agency']);
      },
      error: (error) => {
        this.isSubmitting.set(false);
        this.toast.error(error?.error?.message || 'Failed to create agency. Please try again.');
      }
    });
  }
}
