import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgencyRole, InviteMemberRequest } from '@workspace/core';

interface RoleOption {
  value: AgencyRole;
  label: string;
  description: string;
  badgeLabel: string;
  badgeClass: string;
}

@Component({
  selector: 'app-invite-member-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="modal-overlay" (click)="onOverlayClick($event)">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div class="header-left">
              <div class="header-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
              <div>
                <h2 class="header-title">Invite Team Member</h2>
                <p class="header-subtitle">Send an invitation to join your team with specific role and permissions</p>
              </div>
            </div>
            <button class="close-btn" (click)="onClose()">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Email -->
            <div class="field-group">
              <label class="field-label">
                Email Address <span class="required">*</span>
              </label>
              <div class="input-wrapper">
                <div class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <input
                  type="email"
                  class="text-input"
                  placeholder="colleague@example.com"
                  [(ngModel)]="email"
                />
              </div>
              <p class="field-hint">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                The invitation will be sent to this email address
              </p>
            </div>

            <!-- Role -->
            <div class="field-group">
              <label class="field-label">
                Role <span class="required">*</span>
              </label>
              <div class="role-cards">
                @for (role of roleOptions; track role.value) {
                  <label class="role-card" [class.selected]="selectedRole === role.value" (click)="selectedRole = role.value">
                    <div class="radio-circle" [class.checked]="selectedRole === role.value">
                      @if (selectedRole === role.value) {
                        <div class="radio-dot"></div>
                      }
                    </div>
                    <div class="role-card-content">
                      <div class="role-card-top">
                        <span class="role-card-name">{{ role.label }}</span>
                        <span class="role-badge" [ngClass]="role.badgeClass">{{ role.badgeLabel }}</span>
                      </div>
                      <p class="role-card-desc">{{ role.description }}</p>
                    </div>
                  </label>
                }
              </div>
            </div>

            <!-- Message -->
            <div class="field-group">
              <label class="field-label">
                Personal Message <span class="optional">(Optional)</span>
              </label>
              <textarea
                class="textarea-input"
                rows="4"
                placeholder="Add a personal note to your invitation... (e.g., 'Looking forward to working with you!')"
                [(ngModel)]="message"
                [maxlength]="500"
              ></textarea>
              <div class="textarea-footer">
                <p class="field-hint-inline">This message will be included in the invitation email</p>
                <span class="char-count">{{ message.length }}/500</span>
              </div>
            </div>

            <!-- Info Box -->
            <div class="info-box">
              <div class="info-icon-box">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
              </div>
              <div>
                <div class="info-title">What happens next?</div>
                <ul class="info-list">
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    The member receives an email invitation with a secure link
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    They have 7 days to accept the invitation
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    Once accepted, they'll have immediate access based on their assigned role
                  </li>
                  <li>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                    You can resend or revoke the invitation anytime from the team list
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <button class="cancel-btn" (click)="onClose()">Cancel</button>
            <button class="submit-btn" [disabled]="!isValid()" (click)="onSubmit()">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              Send Invitation
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1000;
      display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .modal-container {
      background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      max-width: 600px; width: 100%; max-height: 90vh; display: flex; flex-direction: column;
      overflow: hidden;
    }

    .modal-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      padding: 24px 32px;
      background: linear-gradient(135deg, #fff5f2, #ffe8e0);
      border-bottom: 1px solid #ffd0c2;
    }
    .header-left { display: flex; align-items: flex-start; gap: 16px; }
    .header-icon {
      width: 48px; height: 48px; border-radius: 12px;
      background: linear-gradient(135deg, #FF9370, #FF4E78);
      display: flex; align-items: center; justify-content: center; color: white;
      flex-shrink: 0;
    }
    .header-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .header-subtitle { font-size: 13px; color: #6b7280; margin: 0; }
    .close-btn {
      background: none; border: none; color: #9ca3af; cursor: pointer; padding: 8px;
      border-radius: 8px; transition: all 0.15s;
    }
    .close-btn:hover { background: rgba(255,255,255,0.5); color: #4b5563; }

    .modal-body { padding: 32px; overflow-y: auto; flex: 1; }

    .field-group { margin-bottom: 24px; }
    .field-label { display: block; font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 10px; }
    .required { color: #ef4444; margin-left: 4px; }
    .optional { font-size: 11px; color: #6b7280; font-weight: 400; margin-left: 4px; }

    .input-wrapper { position: relative; }
    .input-icon {
      position: absolute; left: 16px; top: 50%; transform: translateY(-50%);
      color: #9ca3af; display: flex;
    }
    .text-input {
      width: 100%; padding: 14px 16px 14px 44px;
      border: 2px solid #d1d5db; border-radius: 12px; font-size: 14px;
      color: #111827; outline: none; transition: all 0.15s;
      box-sizing: border-box;
    }
    .text-input:focus { border-color: #FF4E78; box-shadow: 0 0 0 3px rgba(255,78,120,0.1); }
    .text-input::placeholder { color: #9ca3af; }

    .field-hint {
      display: flex; align-items: center; gap: 4px;
      font-size: 12px; color: #6b7280; margin-top: 8px;
    }

    .role-cards { display: flex; flex-direction: column; gap: 12px; }
    .role-card {
      display: flex; align-items: flex-start; gap: 12px;
      padding: 16px; border: 2px solid #d1d5db; border-radius: 12px;
      cursor: pointer; transition: all 0.15s;
    }
    .role-card:hover { border-color: #ffb39d; background: rgba(255,78,120,0.02); }
    .role-card.selected { border-color: #FF4E78; background: #fff5f2; }

    .radio-circle {
      width: 20px; height: 20px; border: 2px solid #d1d5db; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0; margin-top: 2px; transition: all 0.15s;
    }
    .radio-circle.checked { border-color: #FF4E78; background: #FF4E78; }
    .radio-dot { width: 8px; height: 8px; background: white; border-radius: 50%; }

    .role-card-content { flex: 1; }
    .role-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .role-card-name { font-size: 14px; font-weight: 600; color: #111827; }
    .role-badge {
      display: inline-flex; padding: 2px 10px; border-radius: 20px;
      font-size: 11px; font-weight: 600;
    }
    .badge-purple { background: #f3e8ff; color: #7c3aed; }
    .badge-blue { background: #dbeafe; color: #2563eb; }
    .badge-indigo { background: #e0e7ff; color: #4f46e5; }
    .badge-gray { background: #f3f4f6; color: #4b5563; }
    .role-card-desc { font-size: 12px; color: #6b7280; margin: 0; }

    .textarea-input {
      width: 100%; padding: 14px 16px;
      border: 2px solid #d1d5db; border-radius: 12px; font-size: 14px;
      color: #111827; outline: none; resize: none; transition: all 0.15s;
      font-family: inherit; box-sizing: border-box;
    }
    .textarea-input:focus { border-color: #FF4E78; box-shadow: 0 0 0 3px rgba(255,78,120,0.1); }
    .textarea-input::placeholder { color: #9ca3af; }
    .textarea-footer {
      display: flex; justify-content: space-between; align-items: center; margin-top: 8px;
    }
    .field-hint-inline { font-size: 12px; color: #6b7280; }
    .char-count { font-size: 12px; color: #9ca3af; }

    .info-box {
      display: flex; gap: 12px; padding: 20px;
      background: linear-gradient(135deg, #eff6ff, #eef2ff);
      border: 2px solid #bfdbfe; border-radius: 12px;
    }
    .info-icon-box {
      width: 40px; height: 40px; border-radius: 8px; background: #dbeafe;
      display: flex; align-items: center; justify-content: center; color: #2563eb;
      flex-shrink: 0;
    }
    .info-title { font-size: 13px; font-weight: 600; color: #111827; margin-bottom: 8px; }
    .info-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
    .info-list li {
      display: flex; align-items: flex-start; gap: 8px;
      font-size: 12px; color: #374151;
    }
    .info-list li svg { color: #2563eb; flex-shrink: 0; margin-top: 2px; }

    .modal-footer {
      display: flex; justify-content: flex-end; gap: 12px;
      padding: 24px 32px; border-top: 1px solid #e5e7eb;
    }
    .cancel-btn {
      padding: 12px 24px; background: white; border: 2px solid #d1d5db;
      border-radius: 12px; font-size: 14px; font-weight: 600; color: #374151;
      cursor: pointer; transition: all 0.15s;
    }
    .cancel-btn:hover { background: #f9fafb; border-color: #9ca3af; }
    .submit-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 12px 32px; border: none; border-radius: 12px;
      font-size: 14px; font-weight: 600; color: white; cursor: pointer;
      background: linear-gradient(135deg, #FF9370, #FF4E78);
      box-shadow: 0 4px 12px rgba(255,78,120,0.3); transition: all 0.15s;
    }
    .submit-btn:hover { box-shadow: 0 6px 20px rgba(255,78,120,0.4); }
    .submit-btn:disabled { opacity: 0.5; cursor: not-allowed; box-shadow: none; }
  `]
})
export class InviteMemberModalComponent {
  isOpen = input.required<boolean>();
  closed = output<void>();
  invited = output<InviteMemberRequest>();

  email = '';
  selectedRole: AgencyRole = AgencyRole.ADMIN;
  message = '';

  roleOptions: RoleOption[] = [
    { value: AgencyRole.OWNER, label: 'Owner', description: 'Complete control over agency settings, billing, team management, and all features', badgeLabel: 'Highest Access', badgeClass: 'badge-purple' },
    { value: AgencyRole.ADMIN, label: 'Admin', description: 'Manage packages, bookings, team members, and access all features except billing', badgeLabel: 'Full Access', badgeClass: 'badge-blue' },
    { value: AgencyRole.MANAGER, label: 'Manager', description: 'Create and edit packages, manage bookings, view analytics, but cannot manage team', badgeLabel: 'Limited Access', badgeClass: 'badge-indigo' },
    { value: AgencyRole.STAFF, label: 'Staff', description: 'View and respond to bookings, update assigned tasks, limited editing capabilities', badgeLabel: 'Basic Access', badgeClass: 'badge-gray' },
  ];

  isValid(): boolean {
    return this.email.includes('@') && this.email.includes('.') && !!this.selectedRole;
  }

  onSubmit(): void {
    if (!this.isValid()) return;
    this.invited.emit({
      email: this.email,
      role: this.selectedRole,
      message: this.message || undefined,
    });
    this.reset();
  }

  onClose(): void {
    this.reset();
    this.closed.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.onClose();
    }
  }

  private reset(): void {
    this.email = '';
    this.selectedRole = AgencyRole.ADMIN;
    this.message = '';
  }
}
