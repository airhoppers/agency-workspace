import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '@workspace/shared-ui';
import { AgencyService, InviteMemberRequest, AgencyMember } from '@workspace/core';
import { TeamListComponent } from './tabs/team-list.component';
import { PermissionsMatrixComponent } from './tabs/permissions-matrix.component';
import { InviteMemberModalComponent } from './components/invite-member-modal.component';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, TeamListComponent, PermissionsMatrixComponent, InviteMemberModalComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="members-page">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Team Management</h1>
          <p class="page-subtitle">Manage team members, assign roles, and control access permissions</p>
        </div>
        <button class="invite-btn" (click)="showInviteModal.set(true)">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          Invite Member
        </button>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button
          class="tab"
          [class.active]="activeTab() === 'list'"
          (click)="activeTab.set('list')"
        >Team List</button>
        <button
          class="tab"
          [class.active]="activeTab() === 'permissions'"
          (click)="activeTab.set('permissions')"
        >Permissions Matrix</button>
      </div>

      <!-- Tab Content -->
      @if (isLoading()) {
        <div class="loading-container">
          <div class="spinner"></div>
          <span>Loading members...</span>
        </div>
      } @else {
        @if (activeTab() === 'list') {
          <app-team-list [members]="members()" />
        } @else {
          <app-permissions-matrix />
        }
      }
    </div>

    <!-- Invite Modal -->
    <app-invite-member-modal
      [isOpen]="showInviteModal()"
      (closed)="showInviteModal.set(false)"
      (invited)="onInvite($event)"
    />
  `,
  styles: [`
    .members-page { max-width: 1200px; }

    .page-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 24px;
    }
    .page-title {
      font-size: 28px; font-weight: 700; color: #111827; margin: 0 0 8px;
    }
    .page-subtitle {
      font-size: 14px; color: #6b7280; margin: 0;
    }
    .invite-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 20px; border: none; border-radius: 8px;
      font-size: 14px; font-weight: 600; color: white; cursor: pointer;
      background: linear-gradient(135deg, #FF9370, #FF4E78);
      box-shadow: 0 4px 12px rgba(255,78,120,0.3);
      transition: box-shadow 0.15s;
    }
    .invite-btn:hover { box-shadow: 0 6px 20px rgba(255,78,120,0.4); }

    .tabs {
      display: flex; gap: 4px; margin-bottom: 24px;
      border-bottom: 1px solid #e5e7eb;
    }
    .tab {
      padding: 12px 16px; background: none; border: none;
      border-bottom: 2px solid transparent;
      font-size: 14px; font-weight: 500; color: #6b7280;
      cursor: pointer; transition: all 0.15s;
    }
    .tab:hover { color: #111827; border-bottom-color: #d1d5db; }
    .tab.active {
      color: #111827; font-weight: 600;
      border-bottom-color: #FF4E78;
    }

    .loading-container {
      display: flex; flex-direction: column; align-items: center; gap: 12px;
      padding: 64px 0; color: #6b7280; font-size: 14px;
    }
    .spinner {
      width: 32px; height: 32px; border: 3px solid #e5e7eb;
      border-top-color: #FF4E78; border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class MembersComponent implements OnInit {
  private agencyService = inject(AgencyService);
  private toast = inject(ToastService);

  activeTab = signal<'list' | 'permissions'>('list');
  isLoading = signal(true);
  members = signal<AgencyMember[]>([]);
  showInviteModal = signal(false);

  ngOnInit(): void {
    this.loadMembers();
  }

  loadMembers(): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) {
      this.isLoading.set(false);
      return;
    }
    this.agencyService.getAgencyMembers(agency.id).subscribe({
      next: (members) => {
        this.members.set(members);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Failed to load members');
      }
    });
  }

  onInvite(data: InviteMemberRequest): void {
    const agency = this.agencyService.getCurrentAgency();
    if (!agency) return;
    this.agencyService.inviteMember(agency.id, data).subscribe({
      next: () => {
        this.showInviteModal.set(false);
        this.toast.success('Invitation sent successfully');
        this.loadMembers();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Failed to send invitation');
      }
    });
  }
}
