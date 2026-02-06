import { Component, inject, signal, OnInit, computed, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastService, ModalComponent, ButtonComponent } from '@workspace/shared-ui';
import { TravelPackageService, AgencyService } from '@workspace/core';
import { TravelPackage, Category, TravelPackageStatus } from '@workspace/core';

interface UploadedImage {
  file?: File;
  preview: string;
  name: string;
  isExisting?: boolean;
  url?: string;
}

type JourneyType = 'OUTBOUND' | 'RETURN' | 'MULTI_CITY';
type TransportMode = 'FLIGHT' | 'NAVAL' | 'BUS';

interface TransportSegment {
  mode: TransportMode;
  flightType?: string;
  flightNumber?: string;
  departure: {
    dateTime: string;
    terminal?: string;
    gate?: string;
    city: string;
    country: string;
  };
  arrival: {
    dateTime: string;
    terminal?: string;
    gate?: string;
    city: string;
    country: string;
  };
  carrier?: string;
  status?: string;
  baggage?: string;
}

interface Journey {
  journeyType: JourneyType;
  segments: TransportSegment[];
  totalDuration?: number;
}

// Custom validator to ensure end date is after start date
function dateRangeValidator(control: AbstractControl): ValidationErrors | null {
  const startDate = control.get('startDate')?.value;
  const endDate = control.get('endDate')?.value;

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (end <= start) {
      return { dateRange: true };
    }
  }
  return null;
}

@Component({
  selector: 'app-package-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ModalComponent, ButtonComponent],
  template: `
    <div class="package-form-page">
      <!-- Breadcrumb & Header -->
      <div class="page-header">
        <div class="breadcrumb">
          <a routerLink="/dashboard/packages">Travel Packages</a>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
          <span>{{ isEditMode() ? 'Edit Package' : 'Create New Package' }}</span>
        </div>
        <div class="header-content">
          <div class="header-text">
            <h1>{{ isEditMode() ? 'Edit Travel Package' : 'Create Travel Package' }}</h1>
            <p>{{ isEditMode() ? 'Update the details of your travel package' : 'Fill in the details below to create a new travel package for your customers' }}</p>
          </div>
          <div class="header-actions">
            @if (isEditMode()) {
              <button type="button" class="btn-delete" (click)="confirmDelete()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
                Delete
              </button>
            }
            <button type="button" class="btn-secondary" (click)="previewPackage()">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
              Preview
            </button>
            @if (isEditMode() && isPublished()) {
              <button type="button" class="btn-secondary" (click)="saveAsDraft()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>
                Unpublish
              </button>
            } @else {
              <button type="button" class="btn-secondary" (click)="saveAsDraft()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                  <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                </svg>
                Save as Draft
              </button>
            }
          </div>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoadingPackage()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading package details...</p>
        </div>
      } @else {
        <div class="content-layout">
          <!-- Main Form -->
          <div class="form-container">
            <form [formGroup]="packageForm" (ngSubmit)="onSubmit()">
              <!-- Basic Information Section -->
              <section class="form-section">
                <div class="section-header">
                  <div class="section-title">
                    <h2>Basic Information</h2>
                    <p>Essential details about your travel package</p>
                  </div>
                  <div class="section-icon info">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="16" x2="12" y2="12"/>
                      <line x1="12" y1="8" x2="12.01" y2="8"/>
                    </svg>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Package Title <span class="required">*</span></label>
                  <input
                    type="text"
                    class="form-input"
                    formControlName="title"
                    placeholder="e.g., 7-Day Bali Adventure Package"
                  />
                  @if (packageForm.get('title')?.invalid && packageForm.get('title')?.touched) {
                    <span class="form-error">Package title is required (min 3 characters)</span>
                  } @else {
                    <span class="form-hint">Give your package a catchy and descriptive title</span>
                  }
                </div>

                <div class="form-group">
                  <label class="form-label">Description <span class="required">*</span></label>
                  <textarea
                    class="form-textarea"
                    formControlName="description"
                    rows="5"
                    placeholder="Describe your travel package in detail. Include highlights, what makes it special, and what travelers can expect..."
                  ></textarea>
                  <div class="textarea-footer">
                    @if (packageForm.get('description')?.invalid && packageForm.get('description')?.touched) {
                      <span class="form-error">Description is required (min 50 characters)</span>
                    } @else {
                      <span class="form-hint">Minimum 50 characters recommended</span>
                    }
                    <span class="char-count">{{ packageForm.get('description')?.value?.length || 0 }} / 1000</span>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Primary Category</label>
                    <select class="form-select" formControlName="primaryCategory" (change)="onPrimaryCategoryChange()">
                      <option value="">Select category</option>
                      @for (cat of categories(); track cat.id) {
                        <option [value]="cat.id">{{ cat.name }}</option>
                      }
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Additional Category</label>
                    <select class="form-select" formControlName="additionalCategory" (change)="onAdditionalCategoryChange()">
                      <option value="">Select category</option>
                      @for (cat of availableAdditionalCategories(); track cat.id) {
                        <option [value]="cat.id">{{ cat.name }}</option>
                      }
                    </select>
                  </div>
                </div>

                <!-- Selected Categories Tags -->
                @if (selectedCategories().length > 0) {
                  <div class="selected-tags">
                    @for (cat of selectedCategories(); track cat.id) {
                      <span class="tag">
                        {{ cat.name }}
                        <button type="button" (click)="removeCategory(cat.id)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                          </svg>
                        </button>
                      </span>
                    }
                  </div>
                }

                @if (isEditMode()) {
                  <div class="form-group">
                    <label class="form-label">Status</label>
                    <select class="form-select" formControlName="status">
                      <option value="CREATED">Draft</option>
                      <option value="AVAILABLE">Available</option>
                      <option value="FULLY_BOOKED">Fully Booked</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                    <span class="form-hint">Change the visibility status of this package</span>
                  </div>
                }
              </section>

              <!-- Pricing & Availability Section -->
              <section class="form-section">
                <div class="section-header">
                  <div class="section-title">
                    <h2>Pricing & Availability</h2>
                    <p>Set pricing and booking limits</p>
                  </div>
                  <div class="section-icon pricing">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Price <span class="required">*</span></label>
                    <div class="input-with-prefix">
                      <span class="input-prefix">{{ packageForm.get('currency')?.value || 'USD' }}</span>
                      <input
                        type="number"
                        class="form-input"
                        formControlName="price"
                        placeholder="0.00"
                      />
                    </div>
                    @if (packageForm.get('price')?.invalid && packageForm.get('price')?.touched) {
                      <span class="form-error">Price is required</span>
                    }
                  </div>
                  <div class="form-group">
                    <label class="form-label">Currency <span class="required">*</span></label>
                    <select class="form-select" formControlName="currency">
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CHF">CHF - Swiss Franc</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                      <option value="ALL">ALL - Albanian Lek</option>
                    </select>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Maximum Bookings <span class="required">*</span></label>
                  <input
                    type="number"
                    class="form-input"
                    formControlName="maxBookings"
                    placeholder="Enter max number of bookings"
                  />
                  @if (packageForm.get('maxBookings')?.invalid && packageForm.get('maxBookings')?.touched) {
                    <span class="form-error">Maximum bookings is required (min 1)</span>
                  } @else {
                    <span class="form-hint">Set the maximum number of bookings available for this package</span>
                  }
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Start Date <span class="required">*</span></label>
                    <div class="input-with-icon">
                      <input
                        type="date"
                        class="form-input"
                        formControlName="startDate"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    @if (packageForm.get('startDate')?.invalid && packageForm.get('startDate')?.touched) {
                      <span class="form-error">Start date is required</span>
                    }
                  </div>
                  <div class="form-group">
                    <label class="form-label">End Date <span class="required">*</span></label>
                    <div class="input-with-icon">
                      <input
                        type="date"
                        class="form-input"
                        formControlName="endDate"
                        [min]="packageForm.get('startDate')?.value"
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                    </div>
                    @if (packageForm.get('endDate')?.invalid && packageForm.get('endDate')?.touched) {
                      <span class="form-error">End date is required</span>
                    } @else if (packageForm.hasError('dateRange') && packageForm.get('endDate')?.touched) {
                      <span class="form-error">End date must be after start date</span>
                    }
                  </div>
                </div>

                <!-- Pricing Tip -->
                <div class="tip-box">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  <div>
                    <strong>Pricing Tip</strong>
                    <p>Consider seasonal demand and competitor pricing. Early bird discounts can help boost initial bookings.</p>
                  </div>
                </div>
              </section>

              <!-- Media & Files Section -->
              <section class="form-section">
                <div class="section-header">
                  <div class="section-title">
                    <h2>Media & Files</h2>
                    <p>Upload images for your package</p>
                  </div>
                  <div class="section-icon media">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Package Images</label>
                  <div class="upload-area" (click)="triggerFileUpload()" (dragover)="onDragOver($event)" (drop)="onDrop($event)">
                    <input type="file" #fileInput accept="image/*" multiple (change)="onFilesSelected($event)" hidden />
                    <div class="upload-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                    <span class="upload-text">Click to upload or drag and drop</span>
                    <span class="upload-hint">PNG, JPG, WEBP up to 10MB (Max 10 images)</span>
                  </div>

                  <!-- Image Previews -->
                  @if (uploadedImages().length > 0) {
                    <div class="image-previews">
                      @for (img of uploadedImages(); track img.name; let i = $index) {
                        <div class="image-preview" [class.cover]="i === 0">
                          @if (i === 0) {
                            <span class="cover-badge">Cover</span>
                          }
                          @if (img.isExisting) {
                            <span class="existing-badge">Saved</span>
                          }
                          <img [src]="img.preview" [alt]="img.name" />
                          <button type="button" class="remove-btn" (click)="removeImage(i)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                          </button>
                        </div>
                      }
                      @if (uploadedImages().length < 10) {
                        <div class="add-more" (click)="triggerFileUpload()">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                        </div>
                      }
                    </div>
                  }
                </div>
              </section>

              <!-- Hotel Information Section -->
              <section class="form-section" formGroupName="hotelInfo">
                <div class="section-header">
                  <div class="section-title">
                    <h2>Hotel Information</h2>
                    <p>Add accommodation details for the package</p>
                  </div>
                  <div class="section-icon hotel">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Hotel Name</label>
                  <input type="text" class="form-input" formControlName="hotelName" placeholder="e.g., Grand Hyatt Bali" />
                </div>

                <div class="form-group">
                  <label class="form-label">Hotel Address</label>
                  <textarea class="form-textarea" rows="2" formControlName="hotelAddress" placeholder="Enter complete hotel address including street, city, postal code"></textarea>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Room Type</label>
                    <select class="form-select" formControlName="roomType">
                      <option value="">Select room type</option>
                      <option value="standard">Standard Room</option>
                      <option value="deluxe">Deluxe Room</option>
                      <option value="suite">Suite</option>
                      <option value="villa">Villa</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Check-in Time</label>
                    <input type="time" class="form-input" formControlName="checkInTime" />
                  </div>
                </div>

                <div class="form-row">
                  <div class="form-group">
                    <label class="form-label">Check-out Time</label>
                    <input type="time" class="form-input" formControlName="checkOutTime" />
                  </div>
                  <div class="form-group">
                    <label class="form-label">Amenities</label>
                    <input type="text" class="form-input" formControlName="amenities" placeholder="e.g., WiFi, Pool, Spa (comma separated)" />
                  </div>
                </div>
              </section>

              <!-- Journey Details Section -->
              <section class="form-section journey-section">
                <div class="section-header">
                  <div class="section-title">
                    <h2>Journey Details</h2>
                    <p>Configure transportation segments and travel routes</p>
                  </div>
                  <div class="section-icon journey">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                    </svg>
                  </div>
                </div>

                <!-- Journeys List -->
                @for (journey of journeysArray.controls; track $index; let journeyIndex = $index) {
                  <div class="journey-card" [formGroupName]="'journeys'">
                    <div [formGroupName]="journeyIndex">
                      <div class="journey-header">
                        <div class="journey-number">
                          <span class="number-badge">{{ journeyIndex + 1 }}</span>
                          <span class="journey-title">Journey {{ journeyIndex + 1 }}</span>
                        </div>
                        <div class="journey-actions">
                          <button type="button" class="icon-btn" title="Copy Journey" (click)="copyJourney(journeyIndex)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                            </svg>
                          </button>
                          <button type="button" class="icon-btn delete" title="Delete Journey" (click)="removeJourney(journeyIndex)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </div>

                      <!-- Journey Type Selector -->
                      <div class="form-group">
                        <label class="form-label">Journey Type <span class="required">*</span></label>
                        <div class="type-selector">
                          <button type="button" class="type-btn" [class.active]="journey.get('journeyType')?.value === 'OUTBOUND'" (click)="setJourneyType(journeyIndex, 'OUTBOUND')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                            </svg>
                            Outbound
                          </button>
                          <button type="button" class="type-btn" [class.active]="journey.get('journeyType')?.value === 'RETURN'" (click)="setJourneyType(journeyIndex, 'RETURN')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" transform="scale(-1,1) translate(-24,0)"/>
                            </svg>
                            Return
                          </button>
                          <button type="button" class="type-btn" [class.active]="journey.get('journeyType')?.value === 'MULTI_CITY'" (click)="setJourneyType(journeyIndex, 'MULTI_CITY')">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4L8.12 15.88M14.47 14.48L20 20M8.12 8.12L12 12"/>
                            </svg>
                            Multi-City
                          </button>
                        </div>
                      </div>

                      <!-- Transportation Segments -->
                      <div formArrayName="segments">
                        @for (segment of getSegments(journeyIndex).controls; track $index; let segmentIndex = $index) {
                          <div class="segment-card" [formGroupName]="segmentIndex">
                            <div class="segment-header">
                              <span class="segment-number">{{ segmentIndex + 1 }}</span>
                              <span class="segment-title">Transportation Segment</span>
                              @if (getSegments(journeyIndex).length > 1) {
                                <button type="button" class="remove-segment-btn" (click)="removeSegment(journeyIndex, segmentIndex)">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                  </svg>
                                  Remove
                                </button>
                              }
                            </div>

                            <!-- Transportation Mode -->
                            <div class="form-group">
                              <label class="form-label">Transportation Mode <span class="required">*</span></label>
                              <div class="mode-selector">
                                <button type="button" class="mode-btn" [class.active]="segment.get('mode')?.value === 'FLIGHT'" (click)="setSegmentMode(journeyIndex, segmentIndex, 'FLIGHT')">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                                  </svg>
                                  Flight
                                </button>
                                <button type="button" class="mode-btn" [class.active]="segment.get('mode')?.value === 'NAVAL'" (click)="setSegmentMode(journeyIndex, segmentIndex, 'NAVAL')">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
                                    <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
                                    <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
                                    <path d="M12 10v4"/>
                                    <path d="M12 2v3"/>
                                  </svg>
                                  Naval
                                </button>
                                <button type="button" class="mode-btn" [class.active]="segment.get('mode')?.value === 'BUS'" (click)="setSegmentMode(journeyIndex, segmentIndex, 'BUS')">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M8 6v6"/><path d="M16 6v6"/><path d="M2 12h20"/>
                                    <path d="M4 18V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12"/>
                                    <circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/>
                                  </svg>
                                  Bus
                                </button>
                              </div>
                            </div>

                            <!-- Flight specific fields -->
                            @if (segment.get('mode')?.value === 'FLIGHT') {
                              <div class="form-row">
                                <div class="form-group">
                                  <label class="form-label">Flight Type</label>
                                  <input type="text" class="form-input" formControlName="flightType" placeholder="e.g., Commercial, Charter" />
                                </div>
                                <div class="form-group">
                                  <label class="form-label">Flight Number</label>
                                  <input type="text" class="form-input" formControlName="flightNumber" placeholder="e.g., AA123" />
                                </div>
                              </div>
                            }

                            <!-- Departure & Arrival -->
                            <div class="transport-details">
                              <!-- Departure -->
                              <div class="location-section departure" formGroupName="departure">
                                <div class="location-header">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
                                  </svg>
                                  <span>DEPARTURE</span>
                                </div>
                                <div class="form-group">
                                  <label class="form-label">Date & Time</label>
                                  <input type="datetime-local" class="form-input" formControlName="dateTime" />
                                </div>
                                <div class="form-row">
                                  <div class="form-group">
                                    <label class="form-label">Terminal</label>
                                    <input type="text" class="form-input" formControlName="terminal" placeholder="T1" />
                                  </div>
                                  <div class="form-group">
                                    <label class="form-label">Gate</label>
                                    <input type="text" class="form-input" formControlName="gate" placeholder="A12" />
                                  </div>
                                </div>
                                <div class="form-group">
                                  <label class="form-label">City</label>
                                  <input type="text" class="form-input" formControlName="city" placeholder="New York" />
                                </div>
                                <div class="form-group">
                                  <label class="form-label">Country</label>
                                  <input type="text" class="form-input" formControlName="country" placeholder="USA" />
                                </div>
                              </div>

                              <!-- Arrival -->
                              <div class="location-section arrival" formGroupName="arrival">
                                <div class="location-header">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" transform="rotate(90 12 12)"/>
                                  </svg>
                                  <span>ARRIVAL</span>
                                </div>
                                <div class="form-group">
                                  <label class="form-label">Date & Time</label>
                                  <input type="datetime-local" class="form-input" formControlName="dateTime" />
                                </div>
                                <div class="form-row">
                                  <div class="form-group">
                                    <label class="form-label">Terminal</label>
                                    <input type="text" class="form-input" formControlName="terminal" placeholder="T2" />
                                  </div>
                                  <div class="form-group">
                                    <label class="form-label">Gate</label>
                                    <input type="text" class="form-input" formControlName="gate" placeholder="B24" />
                                  </div>
                                </div>
                                <div class="form-group">
                                  <label class="form-label">City</label>
                                  <input type="text" class="form-input" formControlName="city" placeholder="London" />
                                </div>
                                <div class="form-group">
                                  <label class="form-label">Country</label>
                                  <input type="text" class="form-input" formControlName="country" placeholder="UK" />
                                </div>
                              </div>
                            </div>

                            <!-- Carrier, Status, Baggage -->
                            <div class="form-row three-cols">
                              <div class="form-group">
                                <label class="form-label">Carrier</label>
                                <input type="text" class="form-input" formControlName="carrier" placeholder="American Airlines" />
                              </div>
                              <div class="form-group">
                                <label class="form-label">Status</label>
                                <input type="text" class="form-input" formControlName="status" placeholder="Confirmed" />
                              </div>
                              <div class="form-group">
                                <label class="form-label">Baggage</label>
                                <input type="text" class="form-input" formControlName="baggage" placeholder="2x23kg" />
                              </div>
                            </div>
                          </div>
                        }

                        <!-- Add Segment Button -->
                        <button type="button" class="add-segment-btn" (click)="addSegment(journeyIndex)">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                          </svg>
                          Add Transportation Segment
                        </button>
                      </div>

                      <!-- Total Duration -->
                      <div class="form-group duration-group">
                        <label class="form-label">Total Duration (minutes)</label>
                        <input type="number" class="form-input" formControlName="totalDuration" placeholder="e.g., 480" />
                      </div>
                    </div>
                  </div>
                }

                <!-- Add Journey Button -->
                <button type="button" class="add-journey-btn" (click)="addJourney()">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Another Journey
                </button>
              </section>

              <!-- Form Actions -->
              <div class="form-actions">
                <button type="button" class="btn-cancel" routerLink="/dashboard/packages">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
                  </svg>
                  Cancel
                </button>
                <div class="action-buttons">
                  @if (!isEditMode()) {
                    <!-- CREATE MODE -->
                    <button type="button" class="btn-draft" [disabled]="isSaving()" (click)="saveAsDraft()">
                      @if (isSaving() && savingAs() === 'draft') {
                        <div class="btn-spinner dark"></div>
                        Creating Draft...
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Save as Draft
                      }
                    </button>
                    <button type="button" class="btn-publish" [disabled]="isSaving()" (click)="publishPackage()">
                      @if (isSaving() && savingAs() === 'publish') {
                        <div class="btn-spinner"></div>
                        Publishing...
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Create & Publish
                      }
                    </button>
                  } @else if (isPublished()) {
                    <!-- EDIT MODE - PUBLISHED PACKAGE -->
                    <button type="button" class="btn-draft" [disabled]="isSaving()" (click)="saveAsDraft()">
                      @if (isSaving() && savingAs() === 'draft') {
                        <div class="btn-spinner dark"></div>
                        Unpublishing...
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                        </svg>
                        Unpublish
                      }
                    </button>
                    <button type="button" class="btn-publish" [disabled]="isSaving()" (click)="publishPackage()">
                      @if (isSaving() && savingAs() === 'publish') {
                        <div class="btn-spinner"></div>
                        Saving...
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Save Changes
                      }
                    </button>
                  } @else {
                    <!-- EDIT MODE - DRAFT PACKAGE -->
                    <button type="button" class="btn-draft" [disabled]="isSaving()" (click)="saveAsDraft()">
                      @if (isSaving() && savingAs() === 'draft') {
                        <div class="btn-spinner dark"></div>
                        Saving...
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                          <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
                        </svg>
                        Update Draft
                      }
                    </button>
                    <button type="button" class="btn-publish" [disabled]="isSaving()" (click)="publishPackage()">
                      @if (isSaving() && savingAs() === 'publish') {
                        <div class="btn-spinner"></div>
                        Publishing...
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Update & Publish
                      }
                    </button>
                  }
                </div>
              </div>
            </form>
          </div>

          <!-- Package Preview Sidebar -->
          <aside class="preview-sidebar">
            <div class="preview-card">
              <h3>Package Preview</h3>
              <div class="preview-image-section">
                @if (uploadedImages().length > 0) {
                  <div class="preview-main-image">
                    <div class="preview-images-container">
                      @for (img of uploadedImages(); track img.name; let i = $index) {
                        <img [src]="img.preview" [alt]="'Package preview ' + (i + 1)" [class.active]="i === previewImageIndex()" />
                      }
                    </div>
                    @if (uploadedImages().length > 1) {
                      <button class="preview-nav prev" (click)="prevPreviewImage()" [disabled]="previewImageIndex() === 0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="15 18 9 12 15 6"/>
                        </svg>
                      </button>
                      <button class="preview-nav next" (click)="nextPreviewImage()" [disabled]="previewImageIndex() === uploadedImages().length - 1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </button>
                      <div class="preview-image-counter">{{ previewImageIndex() + 1 }} / {{ uploadedImages().length }}</div>
                    }
                  </div>
                  @if (uploadedImages().length > 1) {
                    <div class="preview-thumbnails">
                      @for (img of uploadedImages(); track img.name; let i = $index) {
                        <button class="thumbnail" [class.active]="i === previewImageIndex()" (click)="setPreviewImage(i)">
                          <img [src]="img.preview" [alt]="'Thumbnail ' + (i + 1)" />
                        </button>
                      }
                    </div>
                  }
                } @else {
                  <div class="preview-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>No images uploaded</span>
                  </div>
                }
              </div>
              <div class="preview-tags">
                @for (cat of selectedCategories(); track cat.id) {
                  <span class="preview-tag">{{ cat.name }}</span>
                }
              </div>
              <h4 class="preview-title">{{ packageForm.get('title')?.value || 'Package Title' }}</h4>
              <p class="preview-desc">{{ (packageForm.get('description')?.value || 'Your package description will appear here...') | slice:0:100 }}...</p>
              <div class="preview-price">
                <span class="label">Starting from</span>
                <span class="amount">{{ packageForm.get('currency')?.value || 'USD' }} {{ packageForm.get('price')?.value || '0' }}</span>
              </div>
              <div class="preview-details">
                <div class="detail-row">
                  <span class="detail-label">Duration</span>
                  <span class="detail-value">{{ calculateDuration() }} days</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Max Bookings</span>
                  <span class="detail-value">{{ packageForm.get('maxBookings')?.value || '-' }}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Available From</span>
                  <span class="detail-value">{{ formatPreviewDate(packageForm.get('startDate')?.value) }}</span>
                </div>
              </div>
            </div>

            @if (isEditMode() && existingPackage()) {
              <div class="package-stats">
                <h3>Package Statistics</h3>
                <div class="stat-row">
                  <span class="stat-label">Current Bookings</span>
                  <span class="stat-value">{{ existingPackage()?.currentBookings || 0 }}</span>
                </div>
                <div class="stat-row">
                  <span class="stat-label">Confirmed Bookings</span>
                  <span class="stat-value">{{ existingPackage()?.confirmedBookings || 0 }}</span>
                </div>
                @if (existingPackage()?.rating) {
                  <div class="stat-row">
                    <span class="stat-label">Rating</span>
                    <span class="stat-value rating">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      {{ existingPackage()?.rating }}
                    </span>
                  </div>
                }
                <div class="stat-row">
                  <span class="stat-label">Created</span>
                  <span class="stat-value">{{ formatDate(existingPackage()?.createdAt) }}</span>
                </div>
              </div>
            }

            <!-- Help Card -->
            <div class="help-card">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <span>Need Help?</span>
            </div>
          </aside>
        </div>
      }
    </div>

    <!-- Delete Confirmation Modal -->
    <app-modal
      [isOpen]="showDeleteModal()"
      title="Delete Package"
      size="sm"
      [showFooter]="true"
      (closed)="closeDeleteModal()"
    >
      <p>Are you sure you want to delete <strong>{{ existingPackage()?.title }}</strong>?</p>
      <p class="text-muted text-small">This action cannot be undone and will remove all associated bookings.</p>

      <div modal-footer>
        <app-button variant="ghost" (onClick)="closeDeleteModal()">Cancel</app-button>
        <app-button variant="danger" [loading]="isDeleting()" (onClick)="deletePackage()">
          Delete
        </app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .package-form-page {
      max-width: 100%;
    }

    /* Loading State */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px 20px;
      gap: 16px;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f4f6;
      border-top-color: #FF4E78;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .loading-container p {
      color: #6b7280;
      font-size: 14px;
    }

    /* Page Header */
    .page-header {
      margin-bottom: 24px;
    }

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
          color: #FF4E78;
        }
      }

      svg {
        color: #9ca3af;
      }

      span {
        color: #111827;
      }
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .header-text {
      h1 {
        font-size: 28px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 4px;
      }

      p {
        font-size: 14px;
        color: #6b7280;
        margin: 0;
      }
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }
    }

    .btn-delete {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: white;
      border: 1px solid #fecaca;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #dc2626;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #fef2f2;
        border-color: #f87171;
      }
    }

    /* Content Layout */
    .content-layout {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 24px;

      @media (max-width: 1200px) {
        grid-template-columns: 1fr;
      }
    }

    /* Form Sections */
    .form-section {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .section-title {
      h2 {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 4px;
      }

      p {
        font-size: 13px;
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

      &.info {
        background: #eff6ff;
        color: #3b82f6;
      }

      &.pricing {
        background: #ecfdf5;
        color: #10b981;
      }

      &.media {
        background: #fef3c7;
        color: #f59e0b;
      }

      &.hotel {
        background: #fce7f3;
        color: #ec4899;
      }
    }

    /* Form Elements */
    .form-group {
      margin-bottom: 20px;
    }

    .form-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;

      .required {
        color: #ef4444;
      }
    }

    .form-input, .form-select, .form-textarea {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      color: #111827;
      background: white;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;

      &::placeholder {
        color: #9ca3af;
      }

      &:focus {
        outline: none;
        border-color: #FF4E78;
        box-shadow: 0 0 0 3px rgba(232, 111, 92, 0.1);
      }

      &.ng-invalid.ng-touched {
        border-color: #ef4444;
        background-color: #fef2f2;
      }
    }

    .form-error {
      display: block;
      font-size: 12px;
      color: #ef4444;
      margin-top: 6px;
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .textarea-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
    }

    .form-hint {
      font-size: 12px;
      color: #9ca3af;
    }

    .char-count {
      font-size: 12px;
      color: #9ca3af;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .input-with-prefix {
      display: flex;

      .input-prefix {
        padding: 12px 14px;
        background: #f9fafb;
        border: 1px solid #e5e7eb;
        border-right: none;
        border-radius: 8px 0 0 8px;
        font-size: 14px;
        color: #6b7280;
        min-width: 60px;
        text-align: center;
      }

      .form-input {
        border-radius: 0 8px 8px 0;
      }
    }

    .input-with-icon {
      position: relative;

      .form-input {
        padding-right: 44px;
      }

      svg {
        position: absolute;
        right: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        pointer-events: none;
      }
    }

    /* Selected Tags */
    .selected-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 12px;
    }

    .tag {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 20px;
      font-size: 13px;
      color: #FF4E78;

      button {
        background: none;
        border: none;
        padding: 0;
        cursor: pointer;
        color: #FF4E78;
        display: flex;

        &:hover {
          color: #dc2626;
        }
      }
    }

    /* Tip Box */
    .tip-box {
      display: flex;
      gap: 12px;
      padding: 16px;
      background: #fef3c7;
      border-radius: 10px;
      margin-top: 20px;

      svg {
        color: #f59e0b;
        flex-shrink: 0;
        margin-top: 2px;
      }

      strong {
        display: block;
        font-size: 14px;
        font-weight: 600;
        color: #92400e;
        margin-bottom: 4px;
      }

      p {
        font-size: 13px;
        color: #a16207;
        margin: 0;
        line-height: 1.5;
      }
    }

    /* Upload Area */
    .upload-area {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px;
      border: 2px dashed #e5e7eb;
      border-radius: 12px;
      background: #fafafa;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        border-color: #FF4E78;
        background: #fef2f2;
      }
    }

    .upload-icon {
      width: 64px;
      height: 64px;
      background: #f3f4f6;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
      margin-bottom: 16px;
    }

    .upload-text {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 4px;
    }

    .upload-hint {
      font-size: 12px;
      color: #9ca3af;
    }

    /* Image Previews */
    .image-previews {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-top: 16px;
    }

    .image-preview {
      position: relative;
      aspect-ratio: 16/10;
      border-radius: 8px;
      overflow: hidden;
      border: 2px solid transparent;

      &.cover {
        border-color: #FF4E78;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cover-badge {
        position: absolute;
        top: 8px;
        left: 8px;
        padding: 4px 8px;
        background: #FF4E78;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        color: white;
      }

      .existing-badge {
        position: absolute;
        bottom: 8px;
        left: 8px;
        padding: 4px 8px;
        background: #10b981;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        color: white;
      }

      .remove-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        background: rgba(0, 0, 0, 0.5);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.15s;
      }

      &:hover .remove-btn {
        opacity: 1;
      }
    }

    .add-more {
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 16/10;
      border: 2px dashed #e5e7eb;
      border-radius: 8px;
      cursor: pointer;
      color: #9ca3af;
      transition: all 0.15s;

      &:hover {
        border-color: #FF4E78;
        color: #FF4E78;
      }
    }

    /* Form Actions */
    .form-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 0;
      margin-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .btn-cancel {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #f9fafb;
        color: #111827;
      }
    }

    .action-buttons {
      display: flex;
      gap: 12px;
    }

    .btn-draft {
      padding: 12px 24px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
      }
    }

    .btn-publish {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: opacity 0.15s;

      &:hover:not(:disabled) {
        opacity: 0.9;
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .btn-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;

      &.dark {
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-top-color: #374151;
      }
    }

    /* Preview Sidebar */
    .preview-sidebar {
      @media (max-width: 1200px) {
        display: none;
      }
    }

    .preview-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 24px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        padding: 16px 20px;
        border-bottom: 1px solid #f3f4f6;
        margin: 0;
      }
    }

    .preview-image-section {
      padding: 0;
    }

    .preview-main-image {
      position: relative;
      aspect-ratio: 16/9;
      background: linear-gradient(135deg, #fecaca 0%, #fda4af 100%);
      overflow: hidden;
    }

    .preview-images-container {
      position: relative;
      width: 100%;
      height: 100%;

      img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0;
        transform: scale(1.02);
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1),
                    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: opacity, transform;

        &.active {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }
      }
    }

    .preview-nav {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #374151;
      transition: all 0.2s;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
      z-index: 10;

      &:hover:not(:disabled) {
        background: white;
        transform: translateY(-50%) scale(1.1);
      }

      &:disabled {
        opacity: 0.4;
        cursor: default;
      }

      &.prev {
        left: 8px;
      }

      &.next {
        right: 8px;
      }
    }

    .preview-image-counter {
      position: absolute;
      bottom: 8px;
      right: 8px;
      padding: 4px 10px;
      background: rgba(0, 0, 0, 0.6);
      border-radius: 12px;
      font-size: 11px;
      font-weight: 500;
      color: white;
      z-index: 10;
    }

    .preview-thumbnails {
      display: flex;
      gap: 6px;
      padding: 10px;
      overflow-x: auto;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .thumbnail {
      flex-shrink: 0;
      width: 48px;
      height: 36px;
      border: 2px solid transparent;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      padding: 0;
      background: none;
      transition: border-color 0.15s, transform 0.15s;

      &:hover {
        transform: scale(1.05);
      }

      &.active {
        border-color: #FF4E78;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .preview-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      aspect-ratio: 16/9;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      color: #9ca3af;
      gap: 8px;

      span {
        font-size: 13px;
      }
    }

    .preview-tags {
      display: flex;
      gap: 8px;
      padding: 16px 20px 0;
      flex-wrap: wrap;
    }

    .preview-tag {
      padding: 4px 12px;
      background: #fef2f2;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      color: #FF4E78;
    }

    .preview-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
      padding: 12px 20px 4px;
      margin: 0;
    }

    .preview-desc {
      font-size: 13px;
      color: #6b7280;
      padding: 0 20px;
      margin: 0;
      line-height: 1.5;
    }

    .preview-price {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 20px;

      .label {
        font-size: 12px;
        color: #6b7280;
      }

      .amount {
        font-size: 24px;
        font-weight: 700;
        color: #FF4E78;
      }
    }

    .preview-details {
      padding: 0 20px 20px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
      }

      .detail-label {
        font-size: 13px;
        color: #6b7280;
      }

      .detail-value {
        font-size: 13px;
        font-weight: 500;
        color: #111827;
      }
    }

    /* Package Stats */
    .package-stats {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 24px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 16px;
      }
    }

    .stat-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #f3f4f6;

      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }

      .stat-label {
        font-size: 13px;
        color: #6b7280;
      }

      .stat-value {
        font-size: 14px;
        font-weight: 600;
        color: #111827;

        &.rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f59e0b;
        }
      }
    }

    /* Help Card */
    .help-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border-radius: 12px;
      color: white;
      cursor: pointer;

      svg {
        flex-shrink: 0;
      }

      span {
        font-size: 14px;
        font-weight: 500;
      }
    }

    /* Modal styles */
    .text-muted {
      color: #6b7280;
    }

    .text-small {
      font-size: 14px;
    }

    /* Journey Section Styles */
    .section-icon.journey {
      background: #fef2f2;
      color: #FF4E78;
    }

    .journey-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 16px;
    }

    .journey-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .journey-number {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .number-badge {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      background: #FF4E78;
      color: white;
      border-radius: 50%;
      font-size: 14px;
      font-weight: 600;
    }

    .journey-title {
      font-size: 16px;
      font-weight: 600;
      color: #111827;
    }

    .journey-actions {
      display: flex;
      gap: 8px;
    }

    .icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.15s;

      &:hover {
        background: #f3f4f6;
        color: #374151;
      }

      &.delete:hover {
        background: #fef2f2;
        border-color: #fecaca;
        color: #dc2626;
      }
    }

    /* Type Selector */
    .type-selector, .mode-selector {
      display: flex;
      gap: 12px;
    }

    .type-btn, .mode-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        border-color: #d1d5db;
        background: #f9fafb;
      }

      &.active {
        background: #fef2f2;
        border-color: #FF4E78;
        color: #FF4E78;
      }
    }

    /* Segment Card */
    .segment-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 16px;
    }

    .segment-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f3f4f6;
    }

    .segment-number {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #f3f4f6;
      color: #6b7280;
      border-radius: 50%;
      font-size: 12px;
      font-weight: 600;
    }

    .segment-title {
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      flex: 1;
    }

    .remove-segment-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: white;
      border: 1px solid #fecaca;
      border-radius: 6px;
      font-size: 13px;
      color: #dc2626;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #fef2f2;
      }
    }

    /* Transport Details Grid */
    .transport-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 20px 0;
    }

    .location-section {
      padding: 16px;
      border-radius: 10px;

      &.departure {
        background: #fef2f2;
        border: 1px solid #fecaca;
      }

      &.arrival {
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
      }
    }

    .location-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(0, 0, 0, 0.08);

      span {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.5px;
      }
    }

    .departure .location-header {
      color: #FF4E78;
    }

    .arrival .location-header {
      color: #10b981;
    }

    .location-section .form-group {
      margin-bottom: 12px;
    }

    .location-section .form-label {
      font-size: 12px;
      color: #6b7280;
    }

    .location-section .form-input {
      background: white;
      font-size: 13px;
      padding: 10px 12px;
    }

    /* Three Columns Row */
    .form-row.three-cols {
      grid-template-columns: 1fr 1fr 1fr;
    }

    /* Add Buttons */
    .add-segment-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 14px;
      background: white;
      border: 2px dashed #3b82f6;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #3b82f6;
      cursor: pointer;
      transition: all 0.15s;
      margin-bottom: 16px;

      &:hover {
        background: #eff6ff;
        border-color: #2563eb;
      }
    }

    .add-journey-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 16px;
      background: white;
      border: 2px dashed #FF4E78;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      color: #FF4E78;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #fef2f2;
        border-color: #dc2626;
      }
    }

    .duration-group {
      margin-top: 8px;
      padding-top: 16px;
      border-top: 1px solid #e5e7eb;
    }
  `]
})
export class PackageFormComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private travelPackageService = inject(TravelPackageService);
  private agencyService = inject(AgencyService);

  isSaving = signal(false);
  isDeleting = signal(false);
  isLoadingPackage = signal(false);
  isEditMode = signal(false);
  packageId = signal<string | null>(null);
  existingPackage = signal<TravelPackage | null>(null);
  showDeleteModal = signal(false);
  savingAs = signal<'draft' | 'publish' | null>(null);

  // Computed signal to check if the package is published (AVAILABLE status)
  isPublished = computed(() => {
    const pkg = this.existingPackage();
    return pkg?.status === 'AVAILABLE';
  });

  categories = signal<Category[]>([]);
  selectedCategories = signal<Category[]>([]);
  uploadedImages = signal<UploadedImage[]>([]);
  previewImageIndex = signal(0);

  packageForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: ['', [Validators.required, Validators.minLength(50)]],
    primaryCategory: [''],
    additionalCategory: [''],
    status: ['CREATED'],
    price: ['', [Validators.required, Validators.min(0)]],
    currency: ['USD'],
    maxBookings: ['', [Validators.required, Validators.min(1)]],
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    hotelInfo: this.fb.group({
      hotelName: [''],
      hotelAddress: [''],
      roomType: [''],
      checkInTime: [''],
      checkOutTime: [''],
      amenities: ['']
    }),
    journeys: this.fb.array([])
  }, { validators: dateRangeValidator });

  get journeysArray(): FormArray {
    return this.packageForm.get('journeys') as FormArray;
  }

  availableAdditionalCategories = computed(() => {
    const primary = this.packageForm.get('primaryCategory')?.value;
    return this.categories().filter(cat => cat.id !== primary);
  });

  ngOnInit(): void {
    this.loadCategories();

    // Check if we're in edit mode
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.packageId.set(id);
      this.isEditMode.set(true);
      this.loadPackage(id);
    }
  }

  loadCategories(): void {
    this.travelPackageService.getCategories({ offset: 0, limit: 50 }).subscribe({
      next: (response) => {
        this.categories.set(response.data || []);
      },
      error: () => {
        // Categories are optional
      }
    });
  }

  loadPackage(id: string): void {
    this.isLoadingPackage.set(true);

    const agencyId = this.agencyService.getCurrentAgency()?.id;
    if (!agencyId) {
      this.toast.error('No agency selected');
      this.router.navigate(['/dashboard/packages']);
      return;
    }

    this.travelPackageService.getAgencyTravelPackageById(agencyId, id).subscribe({
      next: (pkg) => {
        this.existingPackage.set(pkg);
        this.populateForm(pkg);
        this.isLoadingPackage.set(false);
      },
      error: () => {
        this.toast.error('Failed to load package');
        this.router.navigate(['/dashboard/packages']);
      }
    });
  }

  populateForm(pkg: TravelPackage): void {
    // Extract start/end dates from journeys if not provided directly
    let startDate = pkg.startDate;
    let endDate = pkg.endDate;

    if (pkg.details?.journeys && pkg.details.journeys.length > 0) {
      // Find OUTBOUND journey for start date
      const outboundJourney = pkg.details.journeys.find(j => j.journeyType === 'OUTBOUND');
      if (outboundJourney && !startDate) {
        startDate = outboundJourney.origin?.time || outboundJourney.segments?.[0]?.departure?.time;
      }

      // Find RETURN journey for end date
      const returnJourney = pkg.details.journeys.find(j => j.journeyType === 'RETURN');
      if (returnJourney && !endDate) {
        endDate = returnJourney.finalDestination?.time ||
                  returnJourney.segments?.[returnJourney.segments.length - 1]?.arrival?.time;
      }
    }

    // Basic info - price is a number with separate priceCurrency field
    this.packageForm.patchValue({
      title: pkg.title,
      description: pkg.description || '',
      status: pkg.status || 'AVAILABLE',
      price: pkg.price || 0,
      currency: pkg.priceCurrency || 'EUR',
      maxBookings: pkg.maxBookings,
      startDate: startDate ? this.formatDateForInput(startDate) : '',
      endDate: endDate ? this.formatDateForInput(endDate) : ''
    });

    // Hotel info
    if (pkg.details?.hotelInfo) {
      const hotel = pkg.details.hotelInfo;
      this.packageForm.get('hotelInfo')?.patchValue({
        hotelName: hotel.hotelName || '',
        hotelAddress: hotel.hotelAddress || '',
        roomType: hotel.roomType || '',
        checkInTime: hotel.checkInTime || '',
        checkOutTime: hotel.checkOutTime || '',
        amenities: hotel.amenities?.join(', ') || ''
      });
    }

    // Categories - API returns categories with 'categoryName' not 'name'
    if (pkg.categories && pkg.categories.length > 0) {
      // Convert TravelPackageCategory to Category format for the form
      const categoryList: Category[] = pkg.categories.map(cat => ({
        id: cat.id,
        name: cat.categoryName,
        description: cat.description,
        iconUrl: cat.iconUrl
      }));
      this.selectedCategories.set(categoryList);
      if (pkg.categories[0]) {
        this.packageForm.get('primaryCategory')?.setValue(pkg.categories[0].id);
      }
      if (pkg.categories[1]) {
        this.packageForm.get('additionalCategory')?.setValue(pkg.categories[1].id);
      }
    }

    // Images - API returns 'images' array (or 'files' for legacy)
    const packageImages = pkg.images || pkg.files || [];
    if (packageImages.length > 0) {
      const existingImages: UploadedImage[] = packageImages.map((url, index) => ({
        preview: url,
        name: `image-${index + 1}`,
        isExisting: true,
        url: url
      }));
      this.uploadedImages.set(existingImages);
    }

    // Journeys - load existing journeys into the form
    if (pkg.details?.journeys && pkg.details.journeys.length > 0) {
      this.journeysArray.clear();
      pkg.details.journeys.forEach((journey: any) => {
        const journeyGroup = this.createJourneyFormGroup();
        // Map backend field names to frontend form fields
        // Backend: totalDurationMinutes → Frontend: totalDuration
        journeyGroup.patchValue({
          journeyType: journey.journeyType || 'OUTBOUND',
          totalDuration: journey.totalDurationMinutes || journey.totalDuration || ''
        });

        // Clear default segment and load existing segments
        const segmentsArray = journeyGroup.get('segments') as FormArray;
        segmentsArray.clear();

        if (journey.segments && journey.segments.length > 0) {
          journey.segments.forEach((segment: any) => {
            const segmentGroup = this.createSegmentFormGroup();
            // Map backend field names to frontend form fields
            // Backend: type → Frontend: mode
            // Backend: number → Frontend: flightNumber
            // Backend: terminalName → Frontend: gate
            segmentGroup.patchValue({
              mode: segment.type || segment.mode || 'FLIGHT',
              flightType: segment.flightType || '',
              flightNumber: segment.number || segment.flightNumber || '',
              departure: {
                dateTime: segment.departure?.time ? this.formatDateTimeForInput(segment.departure.time) : '',
                terminal: segment.departure?.terminal || '',
                gate: segment.departure?.terminalName || segment.departure?.gate || '',
                city: segment.departure?.city || '',
                country: segment.departure?.country || ''
              },
              arrival: {
                dateTime: segment.arrival?.time ? this.formatDateTimeForInput(segment.arrival.time) : '',
                terminal: segment.arrival?.terminal || '',
                gate: segment.arrival?.terminalName || segment.arrival?.gate || '',
                city: segment.arrival?.city || '',
                country: segment.arrival?.country || ''
              },
              carrier: segment.carrier || '',
              status: segment.status || '',
              baggage: segment.baggage || ''
            });
            segmentsArray.push(segmentGroup);
          });
        } else {
          segmentsArray.push(this.createSegmentFormGroup());
        }

        this.journeysArray.push(journeyGroup);
      });
    }
  }

  formatDateTimeForInput(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    // Format as YYYY-MM-DDTHH:mm for datetime-local input
    return date.toISOString().slice(0, 16);
  }

  formatDateForInput(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateStr);
        return '';
      }
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.warn('Error parsing date:', dateStr, e);
      return '';
    }
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  formatPreviewDate(dateStr?: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  onPrimaryCategoryChange(): void {
    const categoryId = this.packageForm.get('primaryCategory')?.value;
    if (categoryId) {
      const category = this.categories().find(c => c.id === categoryId);
      if (category) {
        const existing = this.selectedCategories();
        const filtered = existing.filter(c => c.id !== categoryId);
        this.selectedCategories.set([category, ...filtered.slice(0, 4)]);
      }
    }
  }

  onAdditionalCategoryChange(): void {
    const categoryId = this.packageForm.get('additionalCategory')?.value;
    if (categoryId) {
      const category = this.categories().find(c => c.id === categoryId);
      if (category && !this.selectedCategories().find(c => c.id === categoryId)) {
        this.selectedCategories.update(cats => [...cats, category].slice(0, 5));
      }
      // Keep the selected value visible in the dropdown
    }
  }

  removeCategory(id: string): void {
    this.selectedCategories.update(cats => cats.filter(c => c.id !== id));
    if (this.packageForm.get('primaryCategory')?.value === id) {
      this.packageForm.get('primaryCategory')?.setValue('');
    }
  }

  triggerFileUpload(): void {
    this.fileInput?.nativeElement?.click();
  }

  /**
   * Compresses an image file using Canvas API
   * @param file - Original image file
   * @param maxWidth - Maximum width (default 1920px)
   * @param maxHeight - Maximum height (default 1080px)
   * @param quality - JPEG quality 0-1 (default 0.8)
   * @returns Promise with compressed file and preview data URL
   */
  private compressImage(
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.8
  ): Promise<{ file: File; preview: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Calculate new dimensions while maintaining aspect ratio
          let { width, height } = img;

          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // Create canvas and draw resized image
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          // Use better image smoothing
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Could not compress image'));
                return;
              }

              // Create new file from blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });

              // Get preview data URL
              const preview = canvas.toDataURL('image/jpeg', quality);

              // Log compression results
              const originalSize = (file.size / 1024).toFixed(2);
              const compressedSize = (compressedFile.size / 1024).toFixed(2);
              const savings = (((file.size - compressedFile.size) / file.size) * 100).toFixed(1);
              console.log(`Image compressed: ${originalSize}KB → ${compressedSize}KB (${savings}% saved)`);

              resolve({ file: compressedFile, preview });
            },
            'image/jpeg',
            quality
          );
        };
        img.onerror = () => reject(new Error('Could not load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Could not read file'));
      reader.readAsDataURL(file);
    });
  }

  async onFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const currentCount = this.uploadedImages().length;
      const remainingSlots = 10 - currentCount;
      const filesToProcess = Array.from(input.files).slice(0, remainingSlots);

      for (const file of filesToProcess) {
        try {
          const { file: compressedFile, preview } = await this.compressImage(file);
          this.uploadedImages.update(imgs => [
            ...imgs,
            { file: compressedFile, preview, name: file.name, isExisting: false }
          ]);
        } catch (error) {
          console.error('Failed to compress image:', error);
          // Fallback to original file if compression fails
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadedImages.update(imgs => [
              ...imgs,
              { file, preview: e.target?.result as string, name: file.name, isExisting: false }
            ]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
    // Reset input
    input.value = '';
  }

  removeImage(index: number): void {
    this.uploadedImages.update(imgs => imgs.filter((_, i) => i !== index));
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  async onDrop(event: DragEvent): Promise<void> {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const currentCount = this.uploadedImages().length;
      const remainingSlots = 10 - currentCount;
      const filesToProcess = Array.from(event.dataTransfer.files)
        .filter(file => file.type.startsWith('image/'))
        .slice(0, remainingSlots);

      for (const file of filesToProcess) {
        try {
          const { file: compressedFile, preview } = await this.compressImage(file);
          this.uploadedImages.update(imgs => [
            ...imgs,
            { file: compressedFile, preview, name: file.name, isExisting: false }
          ]);
        } catch (error) {
          console.error('Failed to compress image:', error);
          // Fallback to original file if compression fails
          const reader = new FileReader();
          reader.onload = (e) => {
            this.uploadedImages.update(imgs => [
              ...imgs,
              { file, preview: e.target?.result as string, name: file.name, isExisting: false }
            ]);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  }

  // Journey Management Methods
  createSegmentFormGroup(): FormGroup {
    return this.fb.group({
      mode: ['FLIGHT'],
      flightType: [''],
      flightNumber: [''],
      departure: this.fb.group({
        dateTime: [''],
        terminal: [''],
        gate: [''],
        city: [''],
        country: ['']
      }),
      arrival: this.fb.group({
        dateTime: [''],
        terminal: [''],
        gate: [''],
        city: [''],
        country: ['']
      }),
      carrier: [''],
      status: [''],
      baggage: ['']
    });
  }

  createJourneyFormGroup(): FormGroup {
    return this.fb.group({
      journeyType: ['OUTBOUND'],
      segments: this.fb.array([this.createSegmentFormGroup()]),
      totalDuration: ['']
    });
  }

  addJourney(): void {
    this.journeysArray.push(this.createJourneyFormGroup());
  }

  removeJourney(index: number): void {
    if (this.journeysArray.length > 0) {
      this.journeysArray.removeAt(index);
    }
  }

  copyJourney(index: number): void {
    const journey = this.journeysArray.at(index) as FormGroup;
    const copyValue = journey.getRawValue();
    const newJourney = this.createJourneyFormGroup();

    // Clear segments and recreate with copied values
    const segmentsArray = newJourney.get('segments') as FormArray;
    segmentsArray.clear();

    copyValue.segments.forEach((segment: any) => {
      const newSegment = this.createSegmentFormGroup();
      newSegment.patchValue(segment);
      segmentsArray.push(newSegment);
    });

    newJourney.patchValue({
      journeyType: copyValue.journeyType,
      totalDuration: copyValue.totalDuration
    });

    this.journeysArray.push(newJourney);
  }

  getSegments(journeyIndex: number): FormArray {
    return this.journeysArray.at(journeyIndex).get('segments') as FormArray;
  }

  addSegment(journeyIndex: number): void {
    const segments = this.getSegments(journeyIndex);
    segments.push(this.createSegmentFormGroup());
  }

  removeSegment(journeyIndex: number, segmentIndex: number): void {
    const segments = this.getSegments(journeyIndex);
    if (segments.length > 1) {
      segments.removeAt(segmentIndex);
    }
  }

  setJourneyType(journeyIndex: number, type: JourneyType): void {
    const journey = this.journeysArray.at(journeyIndex);
    journey.get('journeyType')?.setValue(type);
  }

  setSegmentMode(journeyIndex: number, segmentIndex: number, mode: TransportMode): void {
    const segment = this.getSegments(journeyIndex).at(segmentIndex);
    segment.get('mode')?.setValue(mode);
  }

  calculateDuration(): string {
    const start = this.packageForm.get('startDate')?.value;
    const end = this.packageForm.get('endDate')?.value;
    if (start && end) {
      const diff = new Date(end).getTime() - new Date(start).getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      return days > 0 ? days.toString() : '-';
    }
    return '-';
  }

  previewPackage(): void {
    this.toast.info('Preview functionality coming soon');
  }

  // Preview image navigation
  prevPreviewImage(): void {
    const current = this.previewImageIndex();
    if (current > 0) {
      this.previewImageIndex.set(current - 1);
    }
  }

  nextPreviewImage(): void {
    const current = this.previewImageIndex();
    if (current < this.uploadedImages().length - 1) {
      this.previewImageIndex.set(current + 1);
    }
  }

  setPreviewImage(index: number): void {
    this.previewImageIndex.set(index);
  }

  saveAsDraft(): void {
    this.savingAs.set('draft');
    this.submitWithStatus('CREATED');
  }

  publishPackage(): void {
    this.savingAs.set('publish');
    this.submitWithStatus('AVAILABLE');
  }

  private submitWithStatus(status: string): void {
    this.packageForm.get('status')?.setValue(status);
    this.onSubmit();
  }

  confirmDelete(): void {
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
  }

  deletePackage(): void {
    const agency = this.agencyService.getCurrentAgency();
    const pkgId = this.packageId();
    if (!agency || !pkgId) return;

    this.isDeleting.set(true);

    this.travelPackageService.deleteTravelPackage(agency.id, pkgId).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.toast.success('Package deleted successfully');
        this.router.navigate(['/dashboard/packages']);
      },
      error: (error) => {
        this.isDeleting.set(false);
        this.toast.error(error.message || 'Failed to delete package');
      }
    });
  }

  onSubmit(): void {
    if (this.packageForm.invalid) {
      this.packageForm.markAllAsTouched();
      this.toast.error('Please fill in all required fields');
      return;
    }

    const agency = this.agencyService.getCurrentAgency();
    if (!agency) {
      this.toast.error('No agency selected');
      return;
    }

    this.isSaving.set(true);

    const formValue = this.packageForm.value;
    const hotelAmenities = formValue.hotelInfo?.amenities
      ? formValue.hotelInfo.amenities.split(',').map((a: string) => a.trim()).filter((a: string) => a)
      : [];

    // Transform journeys data for API
    // Backend expects: type (not mode), number (not flightNumber), totalDurationMinutes (not totalDuration)
    const journeysData = formValue.journeys?.map((journey: any) => ({
      journeyType: journey.journeyType,
      totalDurationMinutes: journey.totalDuration ? parseInt(journey.totalDuration) : undefined,
      segments: journey.segments?.map((segment: any) => ({
        type: segment.mode, // Backend expects 'type' not 'mode'
        number: segment.flightNumber || undefined, // Backend expects 'number' not 'flightNumber'
        departure: {
          time: segment.departure?.dateTime ? new Date(segment.departure.dateTime).toISOString() : undefined,
          terminal: segment.departure?.terminal || undefined,
          terminalName: segment.departure?.gate || undefined, // Map gate to terminalName
          city: segment.departure?.city || undefined,
          country: segment.departure?.country || undefined
        },
        arrival: {
          time: segment.arrival?.dateTime ? new Date(segment.arrival.dateTime).toISOString() : undefined,
          terminal: segment.arrival?.terminal || undefined,
          terminalName: segment.arrival?.gate || undefined, // Map gate to terminalName
          city: segment.arrival?.city || undefined,
          country: segment.arrival?.country || undefined
        },
        carrier: segment.carrier || undefined,
        status: segment.status || undefined,
        baggage: segment.baggage || undefined
      }))
    })) || [];

    const data: any = {
      title: formValue.title,
      description: formValue.description,
      price: parseFloat(formValue.price),
      priceCurrency: formValue.currency,
      startDate: new Date(formValue.startDate).toISOString(),
      endDate: formValue.endDate ? new Date(formValue.endDate).toISOString() : undefined,
      maxBookings: parseInt(formValue.maxBookings),
      categoryIds: this.selectedCategories().map(c => c.id),
      details: {
        hotelInfo: {
          hotelName: formValue.hotelInfo?.hotelName || undefined,
          hotelAddress: formValue.hotelInfo?.hotelAddress || undefined,
          roomType: formValue.hotelInfo?.roomType || undefined,
          checkInTime: formValue.hotelInfo?.checkInTime || undefined,
          checkOutTime: formValue.hotelInfo?.checkOutTime || undefined,
          amenities: hotelAmenities.length > 0 ? hotelAmenities : undefined
        },
        journeys: journeysData.length > 0 ? journeysData : undefined
      }
    };

    // Always include status
    data.status = formValue.status;

    // Only include new files (not existing ones)
    const newFiles = this.uploadedImages()
      .filter(img => !img.isExisting && img.file)
      .map(img => img.file!);

    const request$ = this.isEditMode()
      ? this.travelPackageService.updateTravelPackage(agency.id, this.packageId()!, data, newFiles)
      : this.travelPackageService.createTravelPackage(agency.id, data, newFiles);

    request$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.savingAs.set(null);
        const statusMsg = formValue.status === 'AVAILABLE' ? 'published' : 'saved as draft';
        const actionMsg = this.isEditMode() ? 'Package updated and ' + statusMsg : 'Package ' + statusMsg;
        this.toast.success(actionMsg + '!');
        this.router.navigate(['/dashboard/packages']);
      },
      error: (error) => {
        this.isSaving.set(false);
        this.savingAs.set(null);
        this.toast.error(error.message || `Failed to ${this.isEditMode() ? 'update' : 'create'} package`);
      }
    });
  }
}
