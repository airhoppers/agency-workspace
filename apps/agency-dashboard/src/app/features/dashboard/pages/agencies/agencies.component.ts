import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardComponent, ButtonComponent, InputComponent, ModalComponent, AvatarComponent, LoadingComponent, EmptyStateComponent, ToastService, BadgeComponent } from '@workspace/shared-ui';
import { AgencyService } from '@workspace/core';
import { Agency, MyAgencyResponse } from '@workspace/core';

@Component({
  selector: 'app-agencies',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    ModalComponent,
    AvatarComponent,
    LoadingComponent,
    EmptyStateComponent,
    BadgeComponent
  ],
  template: `
    <div class="agencies-page">
      <div class="page-header">
        <div>
          <h1>My Agencies</h1>
          <p>Select an agency to manage or create a new one</p>
        </div>
        <app-button (onClick)="openCreateModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Create Agency
        </app-button>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <app-loading size="lg" text="Loading agencies..."></app-loading>
        </div>
      } @else if (agencies().length === 0) {
        <app-empty-state
          title="No agencies yet"
          description="Create your first agency to start managing travel packages and bookings"
          actionLabel="Create Agency"
          (action)="openCreateModal()"
        ></app-empty-state>
      } @else {
        <div class="agencies-grid">
          @for (agency of agencies(); track agency.id) {
            <app-card [hoverable]="true" [clickable]="true" (click)="selectAgency(agency)">
              <div class="agency-card">
                <div class="agency-header">
                  <app-avatar [name]="agency.name" [src]="agency.logoUrl" size="lg"></app-avatar>
                  @if (currentAgency()?.id === agency.id) {
                    <app-badge variant="primary">Current</app-badge>
                  }
                </div>
                <div class="agency-info">
                  <h3>{{ agency.name }}</h3>
                  @if (agency.description) {
                    <p class="description">{{ agency.description }}</p>
                  }
                  <div class="agency-meta">
                    @if (agency.city || agency.country) {
                      <span class="location">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                        </svg>
                        {{ getLocationText(agency) }}
                      </span>
                    }
                    @if (agency.verified) {
                      <span class="verified">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                        Verified
                      </span>
                    }
                  </div>
                </div>
                <div class="agency-action">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            </app-card>
          }
        </div>
      }
    </div>

    <!-- Create Agency Modal -->
    <app-modal
      [isOpen]="showCreateModal()"
      title="Create New Agency"
      size="md"
      [showFooter]="true"
      (closed)="closeCreateModal()"
    >
      <form [formGroup]="createForm">
        <div class="form-group">
          <app-input
            label="Agency Name"
            placeholder="Enter agency name"
            formControlName="name"
            [error]="getFieldError('name')"
            [required]="true"
          ></app-input>
        </div>

        <div class="form-group">
          <app-input
            label="Description"
            type="textarea"
            placeholder="Describe your agency"
            formControlName="description"
            [rows]="3"
          ></app-input>
        </div>

        <div class="form-row">
          <div class="form-group">
            <app-input
              label="City"
              placeholder="City"
              formControlName="city"
            ></app-input>
          </div>
          <div class="form-group">
            <app-input
              label="Country"
              placeholder="Country"
              formControlName="country"
            ></app-input>
          </div>
        </div>

        <div class="form-group">
          <app-input
            label="Address"
            placeholder="Street address"
            formControlName="addressLine"
          ></app-input>
        </div>

        <div class="form-group">
          <app-input
            label="Phone Number"
            type="tel"
            placeholder="+1 234 567 8900"
            formControlName="phoneNumber"
          ></app-input>
        </div>
      </form>

      <div modal-footer>
        <app-button variant="ghost" (onClick)="closeCreateModal()">Cancel</app-button>
        <app-button
          [loading]="isCreating()"
          [disabled]="createForm.invalid"
          (onClick)="createAgency()"
        >
          Create Agency
        </app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .agencies-page {
      max-width: var(--content-max-width);
      margin: 0 auto;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: var(--spacing-xl);

      h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs) 0;
      }

      p {
        font-size: var(--font-size-base);
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: var(--spacing-2xl);
    }

    .agencies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: var(--spacing-md);
    }

    .agency-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .agency-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .agency-info {
      flex: 1;
      min-width: 0;

      h3 {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-semibold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs) 0;
      }

      .description {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        margin: 0 0 var(--spacing-sm) 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }

    .agency-meta {
      display: flex;
      flex-wrap: wrap;
      gap: var(--spacing-md);
    }

    .location, .verified {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    .verified {
      color: var(--color-success);
    }

    .agency-action {
      color: var(--text-tertiary);
    }

    .form-group {
      margin-bottom: var(--spacing-md);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);
    }
  `]
})
export class AgenciesComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private router = inject(Router);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  isLoading = signal(true);
  isCreating = signal(false);
  showCreateModal = signal(false);
  agencyResponses = signal<MyAgencyResponse[]>([]);
  currentAgency = signal<Agency | null>(null);

  // Computed signal to get agencies array for template
  agencies = computed(() => this.agencyResponses().map(r => r.agency));

  createForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: [''],
    city: [''],
    country: [''],
    addressLine: [''],
    phoneNumber: ['']
  });

  ngOnInit(): void {
    this.loadAgencies();
    this.agencyService.currentAgency$.subscribe(agency => {
      this.currentAgency.set(agency);
    });
  }

  loadAgencies(): void {
    this.agencyService.getMyAgencies().subscribe({
      next: (responses) => {
        this.agencyResponses.set(responses);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Failed to load agencies');
      }
    });
  }

  selectAgency(agency: Agency): void {
    this.agencyService.setCurrentAgency(agency);
    this.toast.success(`Switched to ${agency.name}`);
    this.router.navigate(['/dashboard/overview']);
  }

  openCreateModal(): void {
    this.showCreateModal.set(true);
  }

  closeCreateModal(): void {
    this.showCreateModal.set(false);
    this.createForm.reset();
  }

  getFieldError(field: string): string | undefined {
    const control = this.createForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Agency name is required';
      if (control.errors['minlength']) return 'Name must be at least 2 characters';
    }
    return undefined;
  }

  createAgency(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isCreating.set(true);

    this.agencyService.createAgency(this.createForm.value).subscribe({
      next: (agency) => {
        this.isCreating.set(false);
        this.closeCreateModal();
        this.toast.success('Agency created successfully!');
        this.loadAgencies();
        this.selectAgency(agency);
      },
      error: (error) => {
        this.isCreating.set(false);
        this.toast.error(error.message || 'Failed to create agency');
      }
    });
  }

  getLocationText(agency: Agency): string {
    return [agency.city, agency.country].filter(x => !!x).join(', ');
  }
}
