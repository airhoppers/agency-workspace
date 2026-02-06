import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardComponent, ButtonComponent, BadgeComponent, AvatarComponent, LoadingComponent, EmptyStateComponent, ModalComponent, InputComponent, ToastService } from '@workspace/shared-ui';
import { AgencyService } from '@workspace/core';
import { AgencyMember, AgencyRole } from '@workspace/core';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, BadgeComponent, AvatarComponent, LoadingComponent, EmptyStateComponent, ModalComponent, InputComponent],
  template: `
    <div class="members-page">
      <div class="page-header">
        <div>
          <h1>Team Members</h1>
          <p>Manage your agency team members</p>
        </div>
        <app-button (onClick)="openAddModal()">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          Add Member
        </app-button>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <app-loading size="lg" text="Loading members..."></app-loading>
        </div>
      } @else if (members().length === 0) {
        <app-empty-state
          title="No team members yet"
          description="Add team members to help manage your agency"
          actionLabel="Add Member"
          (action)="openAddModal()"
        ></app-empty-state>
      } @else {
        <div class="members-grid">
          @for (member of members(); track member.id) {
            <app-card>
              <div class="member-card">
                <app-avatar [name]="member.firstName + ' ' + member.lastName" [src]="member.profileImageUrl" size="lg"></app-avatar>
                <div class="member-info">
                  <h3>{{ member.firstName }} {{ member.lastName }}</h3>
                  <span class="email">{{ member.email }}</span>
                  <app-badge [variant]="getRoleVariant(member.role)">{{ member.role }}</app-badge>
                </div>
                @if (member.role !== 'OWNER') {
                  <button class="remove-btn" (click)="confirmRemove(member)" title="Remove member">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                }
              </div>
            </app-card>
          }
        </div>
      }
    </div>

    <app-modal [isOpen]="showAddModal()" title="Add Team Member" size="sm" [showFooter]="true" (closed)="closeAddModal()">
      <form [formGroup]="addForm">
        <div class="form-group">
          <app-input label="Email" type="email" placeholder="member@example.com" formControlName="email" [error]="getFieldError('email')" [required]="true"></app-input>
        </div>
        <div class="form-group">
          <label class="input-label">Role</label>
          <select formControlName="role" class="select-field">
            <option value="MANAGER">Manager</option>
            <option value="AGENT">Agent</option>
          </select>
        </div>
      </form>
      <div modal-footer>
        <app-button variant="ghost" (onClick)="closeAddModal()">Cancel</app-button>
        <app-button [loading]="isAdding()" [disabled]="addForm.invalid" (onClick)="addMember()">Add Member</app-button>
      </div>
    </app-modal>

    <app-modal [isOpen]="showRemoveModal()" title="Remove Member" size="sm" [showFooter]="true" (closed)="closeRemoveModal()">
      <p>Are you sure you want to remove <strong>{{ memberToRemove()?.firstName }} {{ memberToRemove()?.lastName }}</strong>?</p>
      <div modal-footer>
        <app-button variant="ghost" (onClick)="closeRemoveModal()">Cancel</app-button>
        <app-button variant="danger" [loading]="isRemoving()" (onClick)="removeMember()">Remove</app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .members-page { max-width: var(--content-max-width); margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--spacing-xl); }
    .page-header h1 { font-size: var(--font-size-3xl); font-weight: var(--font-weight-bold); margin: 0 0 var(--spacing-xs) 0; }
    .page-header p { font-size: var(--font-size-base); color: var(--text-secondary); margin: 0; }
    .loading-container { display: flex; justify-content: center; padding: var(--spacing-2xl); }
    .members-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--spacing-md); }
    .member-card { display: flex; align-items: center; gap: var(--spacing-md); position: relative; }
    .member-info { flex: 1; display: flex; flex-direction: column; gap: var(--spacing-xs); }
    .member-info h3 { font-size: var(--font-size-base); font-weight: var(--font-weight-semibold); margin: 0; }
    .member-info .email { font-size: var(--font-size-sm); color: var(--text-secondary); }
    .remove-btn { position: absolute; top: 0; right: 0; background: none; border: none; color: var(--text-tertiary); cursor: pointer; padding: var(--spacing-xs); border-radius: var(--radius-md); }
    .remove-btn:hover { background-color: var(--color-error-light); color: var(--color-error); }
    .form-group { margin-bottom: var(--spacing-md); }
    .input-label { display: block; font-size: var(--font-size-sm); font-weight: var(--font-weight-medium); margin-bottom: var(--spacing-xs); }
    .select-field { width: 100%; padding: var(--spacing-sm) var(--spacing-md); border: 1px solid var(--border-default); border-radius: var(--radius-md); font-size: var(--font-size-sm); }
  `]
})
export class MembersComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  isLoading = signal(true);
  isAdding = signal(false);
  isRemoving = signal(false);
  members = signal<AgencyMember[]>([]);
  showAddModal = signal(false);
  showRemoveModal = signal(false);
  memberToRemove = signal<AgencyMember | null>(null);

  addForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    role: ['AGENT', Validators.required]
  });

  ngOnInit(): void { this.loadMembers(); }

  loadMembers(): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) return;
    this.agencyService.getAgencyMembers(agency.id).subscribe({
      next: (members) => { this.members.set(members); this.isLoading.set(false); },
      error: () => { this.isLoading.set(false); this.toast.error('Failed to load members'); }
    });
  }

  openAddModal(): void { this.showAddModal.set(true); }
  closeAddModal(): void { this.showAddModal.set(false); this.addForm.reset({ role: 'AGENT' }); }

  getFieldError(field: string): string | undefined {
    const control = this.addForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Invalid email';
    }
    return undefined;
  }

  addMember(): void {
    if (this.addForm.invalid) return;
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) return;
    this.isAdding.set(true);
    this.agencyService.addAgencyMember(agency.id, this.addForm.value).subscribe({
      next: () => { this.isAdding.set(false); this.closeAddModal(); this.toast.success('Member added'); this.loadMembers(); },
      error: (error) => { this.isAdding.set(false); this.toast.error(error.message || 'Failed to add member'); }
    });
  }

  confirmRemove(member: AgencyMember): void { this.memberToRemove.set(member); this.showRemoveModal.set(true); }
  closeRemoveModal(): void { this.showRemoveModal.set(false); this.memberToRemove.set(null); }

  removeMember(): void {
    const member = this.memberToRemove();
    const agency = this.agencyService.getCurrentAgency();
    if (!member || !agency) return;
    this.isRemoving.set(true);
    this.agencyService.removeAgencyMember(agency.id, member.id).subscribe({
      next: () => { this.isRemoving.set(false); this.closeRemoveModal(); this.toast.success('Member removed'); this.loadMembers(); },
      error: (error) => { this.isRemoving.set(false); this.toast.error(error.message || 'Failed to remove member'); }
    });
  }

  getRoleVariant(role: AgencyRole): 'primary' | 'success' | 'default' {
    return role === 'OWNER' ? 'primary' : role === 'MANAGER' ? 'success' : 'default';
  }
}
