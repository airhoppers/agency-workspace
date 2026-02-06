import { Component, inject, signal, OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardComponent, ButtonComponent, LoadingComponent, EmptyStateComponent, ModalComponent, ToastService, ImageCarouselComponent } from '@workspace/shared-ui';
import { TravelPackageService, AgencyService } from '@workspace/core';
import { TravelPackage, TravelPackageStatus, Category } from '@workspace/core';

@Component({
  selector: 'app-packages',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    CardComponent,
    ButtonComponent,
    LoadingComponent,
    EmptyStateComponent,
    ModalComponent,
    ImageCarouselComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="packages-page">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <div class="breadcrumb">
            <span>Dashboard</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span class="current">Travel Packages</span>
          </div>
          <h1>Travel Packages Gallery</h1>
          <p>Browse and manage all available travel packages</p>
        </div>
        <div class="header-actions">
          <button class="btn-filter" (click)="toggleFilters()">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Filters
          </button>
          <button class="btn-create" routerLink="/dashboard/packages/create">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Create Package
          </button>
        </div>
      </div>

      <!-- Category Filters -->
      <div class="category-filters">
        <div class="filter-header">
          <span class="filter-label">Filter by Category</span>
          @if (selectedCategory()) {
            <button class="clear-filter" (click)="selectCategory(null)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
              Clear filter
            </button>
          }
        </div>
        <div class="filter-chips">
          <button
            class="chip"
            [class.active]="selectedCategory() === null"
            (click)="selectCategory(null)"
          >
            @if (selectedCategory() === null) {
              <span class="chip-check">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
            }
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="chip-icon">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            <span class="chip-text">All Packages</span>
            <span class="chip-count">({{ packages().length }})</span>
          </button>
          @for (category of categories(); track category.id) {
            <button
              class="chip"
              [class.active]="selectedCategory()?.id === category.id"
              (click)="selectCategory(category)"
            >
              @if (selectedCategory()?.id === category.id) {
                <span class="chip-check">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </span>
              }
              <span class="chip-text">{{ category.name }}</span>
              <span class="chip-count">({{ getCategoryCount(category.id) }})</span>
            </button>
          }
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <app-loading size="lg" text="Loading packages..."></app-loading>
        </div>
      } @else if (filteredPackages().length === 0) {
        <!-- Empty State -->
        <app-empty-state
          title="No travel packages yet"
          [description]="selectedCategory() ? 'No packages found in this category' : 'Create your first travel package to start accepting bookings'"
          actionLabel="Create Package"
          (action)="goToCreate()"
        ></app-empty-state>
      } @else {
        <!-- Packages Grid -->
        <div class="packages-grid">
          @for (pkg of filteredPackages(); track pkg.id) {
            <div class="package-card" (click)="viewPackage(pkg)">
              <!-- Image Section with Optimized Carousel -->
              <div class="card-image">
                @if (getPackageImages(pkg).length > 0) {
                  <app-image-carousel
                    [images]="getPackageImages(pkg)"
                    [alt]="pkg.title"
                  ></app-image-carousel>
                } @else {
                  <div class="placeholder-image">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                    </svg>
                  </div>
                }
                <!-- Rating Badge -->
                @if (pkg.rating) {
                  <div class="rating-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                    {{ pkg.rating | number:'1.1-1' }}
                  </div>
                }
                <!-- Status Badge -->
                <div class="status-badge" [class]="getStatusClass(pkg.status)">
                  {{ formatStatus(pkg.status) }}
                </div>
              </div>

              <!-- Card Content -->
              <div class="card-content">
                <!-- Category Tag -->
                @if (pkg.categories && pkg.categories.length > 0) {
                  <span class="category-tag">{{ pkg.categories![0].categoryName }}</span>
                }

                <!-- Title -->
                <h3 class="card-title">{{ pkg.title }}</h3>

                <!-- Description -->
                @if (pkg.description) {
                  <p class="card-description">{{ pkg.description | slice:0:80 }}{{ pkg.description.length > 80 ? '...' : '' }}</p>
                }

                <!-- Meta Info -->
                <div class="card-meta">
                  <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                    </svg>
                    <span>{{ getDestination(pkg) }}</span>
                  </div>
                  <div class="meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span>{{ calculateDuration(pkg) }} Days / {{ calculateDuration(pkg) - 1 }} Nights</span>
                  </div>
                </div>

                <!-- Footer -->
                <div class="card-footer">
                  <div class="price-section">
                    <span class="price-label">Starting from</span>
                    <span class="price-amount">{{ pkg.priceCurrency || 'EUR' }} {{ pkg.price | number:'1.0-0' }}</span>
                  </div>
                  <button class="view-btn" (click)="editPackage(pkg, $event)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Booking Progress -->
              <div class="booking-progress">
                <div class="progress-bar">
                  <div class="progress-fill" [style.width.%]="getBookingPercentage(pkg)"></div>
                </div>
                <span class="progress-text">{{ pkg.confirmedBookings || 0 }}/{{ pkg.maxBookings }} booked</span>
              </div>
            </div>
          }
        </div>

        <!-- Pagination -->
        @if (total() > pageSize) {
          <div class="pagination">
            <button
              class="page-btn"
              [disabled]="currentPage() === 1"
              (click)="goToPage(currentPage() - 1)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            @for (page of visiblePages(); track page) {
              <button
                class="page-btn"
                [class.active]="page === currentPage()"
                (click)="goToPage(page)"
              >
                {{ page }}
              </button>
            }
            <button
              class="page-btn"
              [disabled]="currentPage() === totalPages()"
              (click)="goToPage(currentPage() + 1)"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        }
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
      <p>Are you sure you want to delete <strong>{{ packageToDelete()?.title }}</strong>?</p>
      <p class="text-muted text-small">This action cannot be undone.</p>

      <div modal-footer>
        <app-button variant="ghost" (onClick)="closeDeleteModal()">Cancel</app-button>
        <app-button variant="danger" [loading]="isDeleting()" (onClick)="deletePackage()">
          Delete
        </app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .packages-page {
      max-width: var(--content-max-width);
      margin: 0 auto;
    }

    /* Page Header */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #6b7280;

      svg {
        color: #9ca3af;
      }

      .current {
        color: #111827;
        font-weight: 500;
      }
    }

    .header-left {
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

    .btn-filter {
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

    .btn-create {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      transition: opacity 0.15s;

      &:hover {
        opacity: 0.9;
      }
    }

    /* Category Filters */
    .category-filters {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 24px;
      padding: 20px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
    }

    .filter-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .filter-label {
      font-size: 15px;
      font-weight: 600;
      color: #111827;
    }

    .clear-filter {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: #fff5f6;
      border: 1px solid #ffccd5;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      color: #FF4E78;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #ffe4e9;
      }
    }

    .filter-chips {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .chip {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      background: #f9fafb;
      border: 2px solid #e5e7eb;
      border-radius: 10px;
      font-size: 13px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;
      white-space: nowrap;

      &:hover {
        border-color: #d1d5db;
        background: #f3f4f6;
        transform: translateY(-1px);
      }

      &.active {
        background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
        border-color: transparent;
        color: white;
        box-shadow: 0 4px 12px rgba(255, 78, 120, 0.3);
        transform: translateY(-1px);

        .chip-icon {
          color: white;
        }

        .chip-count {
          background: rgba(255, 255, 255, 0.25);
          color: white;
        }
      }
    }

    .chip-check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
    }

    .chip-icon {
      color: #9ca3af;
    }

    .chip-text {
      font-weight: 500;
    }

    .chip-count {
      padding: 2px 8px;
      background: #e5e7eb;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      color: #6b7280;
    }

    /* Loading */
    .loading-container {
      display: flex;
      justify-content: center;
      padding: 64px;
    }

    /* Packages Grid */
    .packages-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }

    /* Package Card */
    .package-card {
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        border-color: #d1d5db;
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }
    }

    .card-image {
      position: relative;
      height: 180px;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      overflow: hidden;

      .placeholder-image {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #9ca3af;
      }
    }

    .rating-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 6px 10px;
      background: rgba(255, 255, 255, 0.95);
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      color: #f59e0b;
      backdrop-filter: blur(4px);

      svg {
        color: #f59e0b;
      }
    }

    .status-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 10;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.available {
        background: rgba(16, 185, 129, 0.9);
        color: white;
      }

      &.created {
        background: rgba(107, 114, 128, 0.9);
        color: white;
      }

      &.fully-booked {
        background: rgba(245, 158, 11, 0.9);
        color: white;
      }

      &.cancelled {
        background: rgba(239, 68, 68, 0.9);
        color: white;
      }

      &.expired {
        background: rgba(107, 114, 128, 0.9);
        color: white;
      }
    }

    .card-content {
      padding: 16px 20px;
    }

    .category-tag {
      display: inline-block;
      padding: 4px 10px;
      background: rgba(255, 78, 120, 0.1);
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      color: #FF4E78;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 10px;
    }

    .card-title {
      font-size: 17px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .card-description {
      font-size: 13px;
      color: #6b7280;
      line-height: 1.5;
      margin: 0 0 12px;
    }

    .card-meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #6b7280;

      svg {
        color: #9ca3af;
        flex-shrink: 0;
      }
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 16px;
      border-top: 1px solid #f3f4f6;
    }

    .price-section {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .price-label {
      font-size: 11px;
      color: #9ca3af;
    }

    .price-amount {
      font-size: 20px;
      font-weight: 700;
      color: #FF4E78;
    }

    .view-btn {
      width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(255, 78, 120, 0.4);
      }
    }

    /* Booking Progress */
    .booking-progress {
      padding: 12px 20px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .progress-bar {
      flex: 1;
      height: 6px;
      background: #f3f4f6;
      border-radius: 3px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #059669 100%);
      border-radius: 3px;
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 12px;
      color: #6b7280;
      white-space: nowrap;
    }

    /* Pagination */
    .pagination {
      display: flex;
      justify-content: center;
      gap: 8px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e5e7eb;
    }

    .page-btn {
      min-width: 40px;
      height: 40px;
      padding: 0 12px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;

      &:hover:not(:disabled) {
        background: #f9fafb;
        border-color: #d1d5db;
      }

      &.active {
        background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
        border-color: #FF4E78;
        color: white;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    /* Modal styles */
    .text-muted {
      color: var(--text-secondary);
    }

    .text-small {
      font-size: var(--font-size-sm);
    }

    /* Responsive */
    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
        gap: 16px;
      }

      .header-actions {
        width: 100%;

        button {
          flex: 1;
        }
      }

      .category-filters {
        flex-direction: column;
        align-items: flex-start;
      }

      .packages-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PackagesComponent implements OnInit {
  private travelPackageService = inject(TravelPackageService);
  private agencyService = inject(AgencyService);
  private router = inject(Router);
  private toast = inject(ToastService);

  isLoading = signal(true);
  isDeleting = signal(false);
  packages = signal<TravelPackage[]>([]);
  categories = signal<Category[]>([]);
  selectedCategory = signal<Category | null>(null);
  total = signal(0);
  currentPage = signal(1);
  pageSize = 12;

  showDeleteModal = signal(false);
  packageToDelete = signal<TravelPackage | null>(null);

  filteredPackages = computed(() => {
    const category = this.selectedCategory();
    const pkgs = this.packages();

    if (!category) return pkgs;

    return pkgs.filter(pkg =>
      pkg.categories?.some(cat => cat.id === category.id)
    );
  });

  totalPages = computed(() => Math.ceil(this.total() / this.pageSize));

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  });

  ngOnInit(): void {
    this.loadPackages();
    this.loadCategories();
  }

  loadPackages(): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) {
      this.isLoading.set(false);
      return;
    }

    const offset = (this.currentPage() - 1) * this.pageSize;

    this.travelPackageService.getAgencyTravelPackages(agency.id, { offset, limit: this.pageSize }).subscribe({
      next: (response) => {
        this.packages.set(response.data || []);
        this.total.set(response.total || 0);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Failed to load packages');
      }
    });
  }

  loadCategories(): void {
    this.travelPackageService.getCategories({ offset: 0, limit: 20 }).subscribe({
      next: (response) => {
        this.categories.set(response.data || []);
      },
      error: () => {
        // Categories are optional, don't show error
      }
    });
  }

  selectCategory(category: Category | null): void {
    this.selectedCategory.set(category);
  }

  getCategoryCount(categoryId: string): number {
    return this.packages().filter(pkg =>
      pkg.categories?.some(cat => cat.id === categoryId)
    ).length;
  }

  toggleFilters(): void {
    this.toast.info('Advanced filters coming soon');
  }

  showAllCategories(): void {
    this.toast.info('All categories view coming soon');
  }

  goToCreate(): void {
    this.router.navigate(['/dashboard/packages/create']);
  }

  viewPackage(pkg: TravelPackage): void {
    this.router.navigate(['/dashboard/packages', pkg.id, 'edit']);
  }

  editPackage(pkg: TravelPackage, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/dashboard/packages', pkg.id, 'edit']);
  }

  confirmDelete(pkg: TravelPackage): void {
    this.packageToDelete.set(pkg);
    this.showDeleteModal.set(true);
  }

  closeDeleteModal(): void {
    this.showDeleteModal.set(false);
    this.packageToDelete.set(null);
  }

  deletePackage(): void {
    const pkg = this.packageToDelete();
    const agency = this.agencyService.getCurrentAgency();
    if (!pkg || !agency) return;

    this.isDeleting.set(true);

    this.travelPackageService.deleteTravelPackage(agency.id, pkg.id).subscribe({
      next: () => {
        this.isDeleting.set(false);
        this.closeDeleteModal();
        this.toast.success('Package deleted successfully');
        this.loadPackages();
      },
      error: (error) => {
        this.isDeleting.set(false);
        this.toast.error(error.message || 'Failed to delete package');
      }
    });
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadPackages();
  }

  getDestination(pkg: TravelPackage): string {
    // Try to extract destination from details or use title as fallback
    if (pkg.destination) return pkg.destination;

    // Try to get from journeys (new API structure)
    const details = pkg.details as any;
    if (details?.journeys?.[0]?.finalDestination?.city) {
      return details.journeys[0].finalDestination.city;
    }

    // Try to get from hotel info
    if (pkg.details?.hotelInfo?.hotelAddress) {
      return pkg.details.hotelInfo.hotelAddress.split(',')[0];
    }

    // Try to get from transportation (legacy)
    if (pkg.details?.transportationInfo?.[0]?.arrival?.city) {
      return pkg.details.transportationInfo[0].arrival.city;
    }

    return 'Multiple Destinations';
  }

  calculateDuration(pkg: TravelPackage): number {
    if (pkg.duration) return pkg.duration;

    // Try to calculate from journeys
    const details = pkg.details as any;
    if (details?.journeys?.length >= 2) {
      const outbound = details.journeys.find((j: any) => j.journeyType === 'OUTBOUND');
      const returnJourney = details.journeys.find((j: any) => j.journeyType === 'RETURN');
      if (outbound?.origin?.time && returnJourney?.finalDestination?.time) {
        const start = new Date(outbound.origin.time);
        const end = new Date(returnJourney.finalDestination.time);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays > 0) return diffDays;
      }
    }

    // Try hotel nights
    if (details?.hotelInfo?.numberOfNights) {
      return details.hotelInfo.numberOfNights + 1;
    }

    if (pkg.startDate && pkg.endDate) {
      const start = new Date(pkg.startDate);
      const end = new Date(pkg.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays || 1;
    }

    return 7; // Default
  }

  getBookingPercentage(pkg: TravelPackage): number {
    if (!pkg.maxBookings) return 0;
    const booked = pkg.confirmedBookings || pkg.currentBookings || 0;
    return Math.min((booked / pkg.maxBookings) * 100, 100);
  }

  getStatusClass(status?: TravelPackageStatus | string): string {
    const normalizedStatus = (status || '').toString().toUpperCase().replace(/-/g, '_');
    const classes: Record<string, string> = {
      'AVAILABLE': 'available',
      'CREATED': 'created',
      'DRAFT': 'created',
      'FULLY_BOOKED': 'fully-booked',
      'FULLYBOOKED': 'fully-booked',
      'CANCELLED': 'cancelled',
      'CANCELED': 'cancelled',
      'EXPIRED': 'expired'
    };
    return classes[normalizedStatus] || 'available';
  }

  formatStatus(status?: TravelPackageStatus | string): string {
    const normalizedStatus = (status || '').toString().toUpperCase().replace(/-/g, '_');
    const labels: Record<string, string> = {
      'AVAILABLE': 'Available',
      'CREATED': 'Draft',
      'DRAFT': 'Draft',
      'FULLY_BOOKED': 'Fully Booked',
      'FULLYBOOKED': 'Fully Booked',
      'CANCELLED': 'Cancelled',
      'CANCELED': 'Cancelled',
      'EXPIRED': 'Expired'
    };
    return labels[normalizedStatus] || 'Available';
  }

  // Helper to get package images (API returns 'images' or 'files')
  getPackageImages(pkg: TravelPackage): string[] {
    return pkg.images || pkg.files || [];
  }
}
