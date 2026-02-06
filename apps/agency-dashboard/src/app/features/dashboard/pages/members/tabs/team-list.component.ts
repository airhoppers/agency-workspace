import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgencyMember, AgencyRole } from '@workspace/core';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Total Members</span>
          <div class="stat-icon-box blue">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
        </div>
        <div class="stat-value">{{ totalCount() }}</div>
        <div class="stat-sub green">
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="18 15 12 9 6 15"/></svg>
          {{ totalCount() }} total
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Active</span>
          <div class="stat-icon-box green">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          </div>
        </div>
        <div class="stat-value">{{ activeCount() }}</div>
        <div class="stat-sub muted">{{ totalCount() > 0 ? ((activeCount() / totalCount() * 100) | number:'1.0-1') + '% active rate' : 'No members' }}</div>
      </div>
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Pending Invites</span>
          <div class="stat-icon-box amber">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
        </div>
        <div class="stat-value">{{ invitedCount() }}</div>
        <div class="stat-sub muted">Awaiting response</div>
      </div>
      <div class="stat-card">
        <div class="stat-top">
          <span class="stat-label">Admins</span>
          <div class="stat-icon-box purple">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
        </div>
        <div class="stat-value">{{ adminCount() }}</div>
        <div class="stat-sub muted">Full access</div>
      </div>
    </div>

    <!-- Table Container -->
    <div class="table-container">
      <!-- Toolbar -->
      <div class="table-toolbar">
        <div class="toolbar-left">
          <div class="search-input-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" class="search-input" placeholder="Search by name or email..." [(ngModel)]="searchQuery" (ngModelChange)="resetPage()" />
          </div>
          <div class="select-wrap">
            <select class="filter-select" [(ngModel)]="roleFilter" (ngModelChange)="resetPage()">
              <option value="">All Roles</option>
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
            </select>
          </div>
          <div class="select-wrap">
            <select class="filter-select" [(ngModel)]="statusFilter" (ngModelChange)="resetPage()">
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="invited">Invited</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-scroll">
        <table class="members-table">
          <thead>
            <tr>
              <th class="check-col">
                <input type="checkbox" class="checkbox" />
              </th>
              <th>Member</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th class="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            @for (member of paginatedMembers(); track member.id) {
              <tr class="member-row">
                <td class="check-col">
                  <input type="checkbox" class="checkbox" />
                </td>
                <td>
                  <div class="member-cell">
                    <img [src]="getAvatarUrl(member)" alt="" class="member-avatar" />
                    <div>
                      <div class="member-name">{{ member.firstName }} {{ member.lastName }}</div>
                      <div class="member-position">{{ member.position || getDefaultPosition(member.role) }}</div>
                    </div>
                  </div>
                </td>
                <td class="email-cell">{{ member.email }}</td>
                <td>
                  <span class="role-badge" [ngClass]="getRoleBadgeClass(member.role)">{{ getDisplayRole(member.role) }}</span>
                </td>
                <td>
                  <span class="status-badge" [ngClass]="'status-' + getStatus(member)">
                    <span class="status-dot"></span>
                    {{ getStatus(member) | titlecase }}
                  </span>
                </td>
                <td class="date-cell">{{ member.joinedAt ? formatDate(member.joinedAt) : '-' }}</td>
                <td class="actions-col">
                  @if (getStatus(member) === 'invited') {
                    <button class="action-link primary" (click)="resendInvite(member)">Resend Invite</button>
                  } @else if (getStatus(member) === 'suspended') {
                    <button class="action-link green" (click)="reactivate(member)">Reactivate</button>
                  } @else {
                    <button class="more-btn" (click)="openDrawer(member)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
                    </button>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="7" class="empty-cell">No members found matching your filters.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      @if (filteredMembers().length > pageSize) {
        <div class="table-footer">
          <div class="pagination-info">
            Showing <strong>{{ paginationStart() }}-{{ paginationEnd() }}</strong> of <strong>{{ filteredMembers().length }}</strong> members
          </div>
          <div class="pagination-btns">
            <button class="page-btn" [disabled]="currentPage() === 1" (click)="currentPage.set(currentPage() - 1)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            @for (p of totalPages(); track p) {
              <button class="page-btn" [class.active]="p === currentPage()" (click)="currentPage.set(p)">{{ p }}</button>
            }
            <button class="page-btn" [disabled]="currentPage() === totalPages().length" (click)="currentPage.set(currentPage() + 1)">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      }
    </div>

    <!-- Coming Soon -->
    <div class="coming-soon">
      <div class="coming-soon-inner">
        <div class="coming-soon-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>
        </div>
        <h3 class="coming-soon-title">Activity Tracking & Audit Logs</h3>
        <p class="coming-soon-desc">Track team member activities, view detailed audit logs, and monitor access patterns to ensure security and compliance.</p>
        <div class="coming-soon-features">
          <span class="feature-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Real-time activity monitoring
          </span>
          <span class="feature-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Detailed audit trails
          </span>
          <span class="feature-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            Compliance reports
          </span>
        </div>
        <div class="coming-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          Coming Soon
        </div>
      </div>
    </div>

    <!-- Member Detail Drawer -->
    @if (drawerMember()) {
      <div class="drawer-overlay" (click)="closeDrawer()"></div>
      <div class="drawer">
        <div class="drawer-header">
          <h3 class="drawer-title">Member Details</h3>
          <button class="close-btn" (click)="closeDrawer()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div class="drawer-body">
          <!-- Profile -->
          <div class="drawer-profile">
            <img [src]="getAvatarUrl(drawerMember()!)" alt="" class="drawer-avatar" />
            <div>
              <h4 class="drawer-name">{{ drawerMember()!.firstName }} {{ drawerMember()!.lastName }}</h4>
              <p class="drawer-email">{{ drawerMember()!.email }}</p>
              <div class="drawer-badges">
                <span class="role-badge" [ngClass]="getRoleBadgeClass(drawerMember()!.role)">{{ getDisplayRole(drawerMember()!.role) }}</span>
                <span class="status-badge" [ngClass]="'status-' + getStatus(drawerMember()!)">
                  <span class="status-dot"></span>
                  {{ getStatus(drawerMember()!) | titlecase }}
                </span>
              </div>
            </div>
          </div>

          <!-- Info -->
          <div class="drawer-section">
            <h5 class="section-title">Member Information</h5>
            <div class="info-rows">
              <div class="info-row">
                <span class="info-label">Position</span>
                <span class="info-value">{{ drawerMember()!.position || getDefaultPosition(drawerMember()!.role) }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Joined</span>
                <span class="info-value">{{ drawerMember()!.joinedAt ? formatDate(drawerMember()!.joinedAt!) : '-' }}</span>
              </div>
              <div class="info-row">
                <span class="info-label">Last Active</span>
                <span class="info-value">Recently</span>
              </div>
            </div>
          </div>

          <!-- Change Role -->
          <div class="drawer-section">
            <h5 class="section-title">Change Role</h5>
            <select class="role-select" [(ngModel)]="drawerRoleValue">
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="MANAGER">Manager</option>
              <option value="STAFF">Staff</option>
            </select>
            <button class="update-role-btn">Update Role</button>
          </div>

          <!-- Permissions -->
          <div class="drawer-section">
            <h5 class="section-title">Permissions</h5>
            <div class="perm-list">
              @for (perm of drawerPermissions(); track perm) {
                <div class="perm-item">
                  <span>{{ perm }}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                </div>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="drawer-section">
            <h5 class="section-title">Actions</h5>
            <div class="action-buttons">
              <button class="drawer-action-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                Resend Invitation
              </button>
              <button class="drawer-action-btn" (click)="confirmAction = 'suspend'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                Suspend Access
              </button>
              <button class="drawer-action-btn danger" (click)="confirmAction = 'revoke'">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="18" y1="8" x2="23" y2="13"/><line x1="23" y1="8" x2="18" y2="13"/></svg>
                Revoke Access
              </button>
            </div>
          </div>
        </div>
      </div>
    }

    <!-- Confirm Dialog -->
    @if (confirmAction) {
      <div class="confirm-overlay" (click)="confirmAction = null">
        <div class="confirm-dialog" (click)="$event.stopPropagation()">
          <div class="confirm-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <h3 class="confirm-title">{{ confirmAction === 'suspend' ? 'Suspend Member Access' : 'Revoke Member Access' }}</h3>
          <p class="confirm-msg">{{ confirmAction === 'suspend'
            ? 'This member will lose access to the portal immediately. You can reactivate them later.'
            : 'This action will permanently remove this member from your team. This cannot be undone.' }}</p>
          <div class="confirm-buttons">
            <button class="cancel-btn" (click)="confirmAction = null">Cancel</button>
            <button class="confirm-btn" (click)="confirmAction = null; closeDrawer()">{{ confirmAction === 'suspend' ? 'Suspend' : 'Revoke' }}</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    /* Stats */
    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
    .stat-card {
      background: white; border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px;
    }
    .stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .stat-label { font-size: 13px; font-weight: 500; color: #6b7280; }
    .stat-icon-box {
      width: 32px; height: 32px; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }
    .stat-icon-box.blue { background: #dbeafe; color: #2563eb; }
    .stat-icon-box.green { background: #dcfce7; color: #16a34a; }
    .stat-icon-box.amber { background: #fef3c7; color: #d97706; }
    .stat-icon-box.purple { background: #f3e8ff; color: #7c3aed; }
    .stat-value { font-size: 28px; font-weight: 700; color: #111827; }
    .stat-sub { font-size: 12px; margin-top: 4px; display: flex; align-items: center; gap: 4px; }
    .stat-sub.green { color: #16a34a; }
    .stat-sub.muted { color: #6b7280; }

    /* Table Container */
    .table-container {
      background: white; border: 1px solid #e5e7eb; border-radius: 10px;
      overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }

    .table-toolbar {
      padding: 16px; border-bottom: 1px solid #e5e7eb; background: #f9fafb;
    }
    .toolbar-left { display: flex; gap: 12px; flex: 1; align-items: center; }

    .search-input-wrap {
      position: relative; flex: 1; max-width: 400px;
    }
    .search-input-wrap svg {
      position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #9ca3af;
    }
    .search-input {
      width: 100%; padding: 8px 16px 8px 36px;
      border: 1px solid #d1d5db; border-radius: 8px; font-size: 13px;
      outline: none; box-sizing: border-box;
    }
    .search-input:focus { border-color: #FF4E78; box-shadow: 0 0 0 2px rgba(255,78,120,0.1); }
    .search-input::placeholder { color: #9ca3af; }

    .select-wrap { position: relative; }
    .filter-select {
      padding: 8px 32px 8px 16px; border: 1px solid #d1d5db;
      border-radius: 8px; font-size: 13px; background: white;
      appearance: none; cursor: pointer; outline: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 12px center;
    }

    .table-scroll { overflow-x: auto; }
    .members-table { width: 100%; border-collapse: collapse; }
    .members-table thead { background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
    .members-table th {
      padding: 12px 24px; text-align: left; font-size: 11px; font-weight: 600;
      color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .members-table td { padding: 16px 24px; border-bottom: 1px solid #e5e7eb; }
    .check-col { width: 48px; text-align: center !important; }
    .actions-col { text-align: right !important; width: 120px; }
    .checkbox { width: 16px; height: 16px; accent-color: #FF4E78; cursor: pointer; }
    .member-row { transition: background 0.1s; }
    .member-row:hover { background: #f9fafb; }

    .member-cell { display: flex; align-items: center; gap: 12px; }
    .member-avatar { width: 40px; height: 40px; border-radius: 8px; object-fit: cover; }
    .member-name { font-size: 14px; font-weight: 600; color: #111827; }
    .member-position { font-size: 12px; color: #6b7280; }
    .email-cell { font-size: 14px; color: #374151; }
    .date-cell { font-size: 14px; color: #4b5563; }

    .role-badge {
      display: inline-flex; padding: 2px 10px; border-radius: 20px;
      font-size: 12px; font-weight: 600;
    }
    .badge-owner { background: #f3e8ff; color: #7c3aed; }
    .badge-admin { background: #dbeafe; color: #2563eb; }
    .badge-manager { background: #e0e7ff; color: #4338ca; }
    .badge-staff { background: #f3f4f6; color: #4b5563; }

    .status-badge {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 12px; font-weight: 500;
    }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%;
    }
    .status-active { color: #15803d; }
    .status-active .status-dot { background: #22c55e; }
    .status-invited { color: #b45309; }
    .status-invited .status-dot { background: #f59e0b; }
    .status-suspended { color: #b91c1c; }
    .status-suspended .status-dot { background: #ef4444; }

    .action-link {
      background: none; border: none; font-size: 12px; font-weight: 500;
      cursor: pointer; padding: 6px 12px;
    }
    .action-link.primary { color: #FF4E78; }
    .action-link.primary:hover { color: #e63965; }
    .action-link.green { color: #16a34a; }
    .action-link.green:hover { color: #15803d; }

    .more-btn {
      background: none; border: none; color: #9ca3af; cursor: pointer;
      padding: 8px; border-radius: 6px; transition: all 0.1s;
    }
    .more-btn:hover { color: #4b5563; background: #f3f4f6; }

    .empty-cell { text-align: center; padding: 40px 24px !important; color: #6b7280; font-size: 14px; }

    /* Pagination */
    .table-footer {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 24px; background: #f9fafb; border-top: 1px solid #e5e7eb;
    }
    .pagination-info { font-size: 13px; color: #4b5563; }
    .pagination-info strong { color: #111827; }
    .pagination-btns { display: flex; gap: 8px; }
    .page-btn {
      padding: 6px 12px; background: white; border: 1px solid #d1d5db;
      border-radius: 8px; font-size: 13px; font-weight: 500; color: #374151;
      cursor: pointer; transition: all 0.1s;
      display: flex; align-items: center; justify-content: center; min-width: 32px;
    }
    .page-btn:hover:not(:disabled) { background: #f3f4f6; }
    .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .page-btn.active { background: #FF4E78; color: white; border-color: #FF4E78; }

    /* Coming Soon */
    .coming-soon { margin-top: 32px; }
    .coming-soon-inner {
      background: linear-gradient(135deg, #f9fafb, #f3f4f6);
      border: 2px dashed #d1d5db; border-radius: 16px; padding: 40px;
      text-align: center;
    }
    .coming-soon-icon {
      width: 64px; height: 64px; border-radius: 50%; margin: 0 auto 16px;
      background: linear-gradient(135deg, #ffe8e0, #ffd0c2);
      display: flex; align-items: center; justify-content: center; color: #FF4E78;
    }
    .coming-soon-title { font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 8px; }
    .coming-soon-desc { font-size: 14px; color: #6b7280; max-width: 600px; margin: 0 auto 24px; }
    .coming-soon-features { display: flex; justify-content: center; gap: 24px; margin-bottom: 24px; }
    .feature-item { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #374151; }
    .feature-item svg { color: #16a34a; }
    .coming-badge {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 8px 16px; background: #fff5f2; border: 1px solid #ffd0c2;
      border-radius: 8px; font-size: 13px; font-weight: 600; color: #FF4E78;
    }

    /* Drawer */
    .drawer-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 200;
    }
    .drawer {
      position: fixed; top: 0; right: 0; bottom: 0; width: 480px;
      background: white; box-shadow: -10px 0 40px rgba(0,0,0,0.15);
      z-index: 201; display: flex; flex-direction: column; overflow-y: auto;
    }
    .drawer-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 24px; border-bottom: 1px solid #e5e7eb;
      position: sticky; top: 0; background: white; z-index: 1;
    }
    .drawer-title { font-size: 18px; font-weight: 700; color: #111827; margin: 0; }
    .close-btn {
      background: none; border: none; color: #9ca3af; cursor: pointer;
      padding: 8px; border-radius: 8px; transition: all 0.15s;
    }
    .close-btn:hover { background: #f3f4f6; color: #4b5563; }

    .drawer-body { padding: 24px; flex: 1; }

    .drawer-profile {
      display: flex; align-items: center; gap: 16px;
      padding-bottom: 24px; border-bottom: 1px solid #e5e7eb; margin-bottom: 24px;
    }
    .drawer-avatar { width: 80px; height: 80px; border-radius: 12px; object-fit: cover; }
    .drawer-name { font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .drawer-email { font-size: 14px; color: #6b7280; margin: 0 0 8px; }
    .drawer-badges { display: flex; gap: 8px; align-items: center; }

    .drawer-section { margin-bottom: 24px; padding-top: 24px; border-top: 1px solid #e5e7eb; }
    .drawer-section:first-of-type { border-top: none; padding-top: 0; }
    .section-title { font-size: 14px; font-weight: 600; color: #111827; margin: 0 0 12px; }

    .info-rows { display: flex; flex-direction: column; gap: 12px; }
    .info-row { display: flex; justify-content: space-between; align-items: center; }
    .info-label { font-size: 14px; color: #6b7280; }
    .info-value { font-size: 14px; font-weight: 500; color: #111827; }

    .role-select {
      width: 100%; padding: 12px 16px; border: 1px solid #d1d5db;
      border-radius: 8px; font-size: 14px; outline: none; appearance: none;
      background: white;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 12px center;
    }
    .update-role-btn {
      width: 100%; margin-top: 12px; padding: 10px;
      background: #FF4E78; color: white; border: none; border-radius: 8px;
      font-size: 14px; font-weight: 600; cursor: pointer; transition: background 0.15s;
    }
    .update-role-btn:hover { background: #e63965; }

    .perm-list { display: flex; flex-direction: column; gap: 8px; }
    .perm-item {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px; background: #f9fafb; border-radius: 8px; font-size: 14px; color: #374151;
    }

    .action-buttons { display: flex; flex-direction: column; gap: 8px; }
    .drawer-action-btn {
      width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 10px; background: white; border: 1px solid #d1d5db;
      border-radius: 8px; font-size: 14px; font-weight: 500; color: #374151;
      cursor: pointer; transition: all 0.15s;
    }
    .drawer-action-btn:hover { background: #f9fafb; }
    .drawer-action-btn.danger { border-color: #fecaca; color: #dc2626; }
    .drawer-action-btn.danger:hover { background: #fef2f2; }

    /* Confirm Dialog */
    .confirm-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 300;
      display: flex; align-items: center; justify-content: center; padding: 24px;
    }
    .confirm-dialog {
      background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
      max-width: 400px; width: 100%; padding: 32px; text-align: center;
    }
    .confirm-icon-wrap {
      width: 64px; height: 64px; border-radius: 50%; background: #fef2f2;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;
    }
    .confirm-title { font-size: 20px; font-weight: 700; color: #111827; margin: 0 0 8px; }
    .confirm-msg { font-size: 14px; color: #6b7280; margin: 0 0 24px; }
    .confirm-buttons { display: flex; gap: 12px; }
    .cancel-btn {
      flex: 1; padding: 12px; background: #f3f4f6; border: none;
      border-radius: 8px; font-size: 14px; font-weight: 500; color: #374151;
      cursor: pointer; transition: background 0.15s;
    }
    .cancel-btn:hover { background: #e5e7eb; }
    .confirm-btn {
      flex: 1; padding: 12px; background: #dc2626; border: none;
      border-radius: 8px; font-size: 14px; font-weight: 600; color: white;
      cursor: pointer; transition: background 0.15s;
    }
    .confirm-btn:hover { background: #b91c1c; }
  `]
})
export class TeamListComponent {
  members = input.required<AgencyMember[]>();

  searchQuery = '';
  roleFilter = '';
  statusFilter = '';
  pageSize = 8;
  currentPage = signal(1);

  drawerMember = signal<AgencyMember | null>(null);
  drawerRoleValue = '';
  confirmAction: 'suspend' | 'revoke' | null = null;

  // Computed stats
  totalCount = computed(() => this.members().length);
  activeCount = computed(() => this.members().filter(m => this.getStatus(m) === 'active').length);
  invitedCount = computed(() => this.members().filter(m => this.getStatus(m) === 'invited').length);
  adminCount = computed(() => this.members().filter(m => m.role === AgencyRole.OWNER || m.role === AgencyRole.ADMIN).length);

  filteredMembers = computed(() => {
    let list = this.members();
    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(m =>
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    }
    if (this.roleFilter) {
      list = list.filter(m => this.mapRole(m.role) === this.roleFilter);
    }
    if (this.statusFilter) {
      list = list.filter(m => this.getStatus(m) === this.statusFilter);
    }
    return list;
  });

  paginatedMembers = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.filteredMembers().slice(start, start + this.pageSize);
  });

  paginationStart = computed(() => {
    if (this.filteredMembers().length === 0) return 0;
    return (this.currentPage() - 1) * this.pageSize + 1;
  });

  paginationEnd = computed(() => {
    return Math.min(this.currentPage() * this.pageSize, this.filteredMembers().length);
  });

  totalPages = computed(() => {
    const count = Math.ceil(this.filteredMembers().length / this.pageSize);
    return Array.from({ length: count }, (_, i) => i + 1);
  });

  drawerPermissions = computed(() => {
    const member = this.drawerMember();
    if (!member) return [];
    const role = this.mapRole(member.role);
    if (role === 'OWNER') return ['Manage Packages', 'Manage Bookings', 'View Analytics', 'Manage Team', 'Billing & Settings'];
    if (role === 'ADMIN') return ['Manage Packages', 'Manage Bookings', 'View Analytics', 'Manage Team'];
    if (role === 'MANAGER') return ['Manage Packages', 'Manage Bookings', 'View Analytics'];
    return ['View Packages', 'View Bookings'];
  });

  resetPage(): void {
    this.currentPage.set(1);
  }

  getStatus(member: AgencyMember): string {
    return member.status || 'active';
  }

  getDisplayRole(role: AgencyRole): string {
    const mapped = this.mapRole(role);
    switch (mapped) {
      case 'OWNER': return 'Owner';
      case 'ADMIN': return 'Admin';
      case 'MANAGER': return 'Manager';
      default: return 'Staff';
    }
  }

  getRoleBadgeClass(role: AgencyRole): string {
    const mapped = this.mapRole(role);
    switch (mapped) {
      case 'OWNER': return 'badge-owner';
      case 'ADMIN': return 'badge-admin';
      case 'MANAGER': return 'badge-manager';
      default: return 'badge-staff';
    }
  }

  mapRole(role: AgencyRole): string {
    if (role === AgencyRole.AGENT) return 'STAFF';
    return role;
  }

  getDefaultPosition(role: AgencyRole): string {
    const mapped = this.mapRole(role);
    switch (mapped) {
      case 'OWNER': return 'Agency Owner';
      case 'ADMIN': return 'Administrator';
      case 'MANAGER': return 'Manager';
      default: return 'Staff Member';
    }
  }

  getAvatarUrl(member: AgencyMember): string {
    if (member.profileImageUrl) return member.profileImageUrl;
    const name = `${member.firstName || ''}+${member.lastName || ''}`;
    return `https://ui-avatars.com/api/?name=${name}&background=FF4E78&color=fff&rounded=true`;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  openDrawer(member: AgencyMember): void {
    this.drawerMember.set(member);
    this.drawerRoleValue = member.role;
  }

  closeDrawer(): void {
    this.drawerMember.set(null);
    this.confirmAction = null;
  }

  resendInvite(member: AgencyMember): void {
    // Placeholder - would call API
  }

  reactivate(member: AgencyMember): void {
    // Placeholder - would call API
  }
}
