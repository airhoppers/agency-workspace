import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type AccessLevel = 'full' | 'view' | 'none';

interface PermissionRow {
  name: string;
  description: string;
  owner: AccessLevel;
  admin: AccessLevel;
  manager: AccessLevel;
  staff: AccessLevel;
}

interface PermissionCategory {
  name: string;
  icon: string;
  permissions: PermissionRow[];
}

@Component({
  selector: 'app-permissions-matrix',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="permissions-matrix">
      <!-- Header -->
      <div class="matrix-header">
        <div>
          <h1 class="matrix-title">Role Permissions Matrix</h1>
          <p class="matrix-subtitle">Compare permissions across all roles to understand access levels</p>
        </div>
        <button class="toggle-diff-btn" [class.active]="showDifferencesOnly()" (click)="toggleDifferences()">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          <span>{{ showDifferencesOnly() ? 'Show All Permissions' : 'Show Only Differences' }}</span>
        </button>
      </div>

      <!-- Legend -->
      <div class="legend-card">
        <div class="legend-left">
          <div class="legend-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
          </div>
          <div>
            <h3 class="legend-title">Permission Legend</h3>
            <p class="legend-desc">Understanding access levels across roles</p>
          </div>
        </div>
        <div class="legend-items">
          <div class="legend-item">
            <div class="access-icon full small"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg></div>
            <span>Full Access</span>
          </div>
          <div class="legend-item">
            <div class="access-icon view small"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></div>
            <span>View Only</span>
          </div>
          <div class="legend-item">
            <div class="access-icon none small"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
            <span>No Access</span>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-container">
        <table class="permissions-table">
          <thead>
            <tr>
              <th class="permission-col-header">
                <div class="col-label">Permission Category</div>
              </th>
              <th class="role-col-header">
                <div class="role-header">
                  <div class="role-avatar owner-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-5 4-5-6-5 6-5-4z"/><path d="M3 20h18"/></svg>
                  </div>
                  <div class="role-name">Owner</div>
                  <div class="role-level">Full Control</div>
                </div>
              </th>
              <th class="role-col-header">
                <div class="role-header">
                  <div class="role-avatar admin-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div class="role-name">Admin</div>
                  <div class="role-level">Advanced</div>
                </div>
              </th>
              <th class="role-col-header">
                <div class="role-header">
                  <div class="role-avatar manager-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div class="role-name">Manager</div>
                  <div class="role-level">Moderate</div>
                </div>
              </th>
              <th class="role-col-header">
                <div class="role-header">
                  <div class="role-avatar staff-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  </div>
                  <div class="role-name">Staff</div>
                  <div class="role-level">Basic</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            @for (category of categories; track category.name) {
              <tr class="category-row">
                <td colspan="5">
                  <div class="category-label">
                    <span class="category-icon" [innerHTML]="category.icon"></span>
                    <span>{{ category.name }}</span>
                  </div>
                </td>
              </tr>
              @for (perm of category.permissions; track perm.name) {
                @if (!showDifferencesOnly() || !allSame(perm)) {
                  <tr class="permission-row">
                    <td class="permission-cell">
                      <div class="perm-name">{{ perm.name }}</div>
                      <div class="perm-desc">{{ perm.description }}</div>
                    </td>
                    <td class="access-cell"><div class="access-icon" [class]="perm.owner">@if (perm.owner === 'full') {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>} @else if (perm.owner === 'view') {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>} @else {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>}</div></td>
                    <td class="access-cell"><div class="access-icon" [class]="perm.admin">@if (perm.admin === 'full') {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>} @else if (perm.admin === 'view') {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>} @else {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>}</div></td>
                    <td class="access-cell"><div class="access-icon" [class]="perm.manager">@if (perm.manager === 'full') {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>} @else if (perm.manager === 'view') {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>} @else {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>}</div></td>
                    <td class="access-cell"><div class="access-icon" [class]="perm.staff">@if (perm.staff === 'full') {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>} @else if (perm.staff === 'view') {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>} @else {<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="5" y1="12" x2="19" y2="12"/></svg>}</div></td>
                  </tr>
                }
              }
            }
          </tbody>
        </table>
      </div>

      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="summary-card owner-card">
          <div class="summary-top">
            <div class="summary-icon-box owner-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 4l3 12h14l3-12-5 4-5-6-5 6-5-4z"/><path d="M3 20h18"/></svg>
            </div>
            <span class="summary-level owner-text">Full Control</span>
          </div>
          <h3 class="summary-role">Owner</h3>
          <p class="summary-desc">Complete access to all features and settings</p>
        </div>
        <div class="summary-card admin-card">
          <div class="summary-top">
            <div class="summary-icon-box admin-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <span class="summary-level admin-text">Advanced</span>
          </div>
          <h3 class="summary-role">Admin</h3>
          <p class="summary-desc">Manage team, content, and most settings</p>
        </div>
        <div class="summary-card manager-card">
          <div class="summary-top">
            <div class="summary-icon-box manager-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span class="summary-level manager-text">Moderate</span>
          </div>
          <h3 class="summary-role">Manager</h3>
          <p class="summary-desc">Create content and manage bookings</p>
        </div>
        <div class="summary-card staff-card">
          <div class="summary-top">
            <div class="summary-icon-box staff-bg">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span class="summary-level staff-text">Basic</span>
          </div>
          <h3 class="summary-role">Staff</h3>
          <p class="summary-desc">View and create basic content</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .permissions-matrix { max-width: 1200px; }

    .matrix-header {
      display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 24px;
    }
    .matrix-title { font-size: 28px; font-weight: 700; color: #111827; margin: 0 0 8px; }
    .matrix-subtitle { font-size: 14px; color: #6b7280; margin: 0; }

    .toggle-diff-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 10px 16px; background: white; border: 2px solid #d1d5db;
      border-radius: 8px; font-size: 13px; font-weight: 500; color: #374151;
      cursor: pointer; transition: all 0.15s; white-space: nowrap;
    }
    .toggle-diff-btn:hover { border-color: #9ca3af; }
    .toggle-diff-btn.active {
      background: #fff5f2; border-color: #FF4E78; color: #FF4E78;
    }

    /* Legend */
    .legend-card {
      display: flex; align-items: center; justify-content: space-between;
      background: linear-gradient(135deg, #eff6ff, #eef2ff); border: 1px solid #bfdbfe;
      border-radius: 12px; padding: 20px; margin-bottom: 24px;
    }
    .legend-left { display: flex; align-items: center; gap: 12px; }
    .legend-icon-box {
      width: 40px; height: 40px; border-radius: 8px; background: #dbeafe;
      display: flex; align-items: center; justify-content: center; color: #2563eb;
    }
    .legend-title { font-size: 15px; font-weight: 700; color: #111827; margin: 0 0 2px; }
    .legend-desc { font-size: 13px; color: #374151; margin: 0; }
    .legend-items { display: flex; gap: 24px; }
    .legend-item { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 500; color: #374151; }

    /* Table */
    .table-container {
      background: white; border: 1px solid #e5e7eb; border-radius: 12px;
      overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .permissions-table { width: 100%; border-collapse: collapse; }

    .permission-col-header {
      padding: 16px 24px; text-align: left; background: #f9fafb; border-bottom: 2px solid #e5e7eb;
      width: 33%;
    }
    .col-label { font-size: 11px; font-weight: 600; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }

    .role-col-header {
      padding: 16px 24px; text-align: center; background: #f9fafb;
      border-bottom: 2px solid #e5e7eb; border-left: 1px solid #e5e7eb; width: 16.75%;
    }
    .role-header { display: flex; flex-direction: column; align-items: center; gap: 8px; }
    .role-avatar {
      width: 40px; height: 40px; border-radius: 50%; display: flex;
      align-items: center; justify-content: center; color: white;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .owner-avatar { background: linear-gradient(135deg, #6366f1, #4f46e5); }
    .admin-avatar { background: linear-gradient(135deg, #3b82f6, #2563eb); }
    .manager-avatar { background: linear-gradient(135deg, #22c55e, #16a34a); }
    .staff-avatar { background: linear-gradient(135deg, #9ca3af, #6b7280); }
    .role-name { font-size: 14px; font-weight: 700; color: #111827; }
    .role-level { font-size: 11px; color: #6b7280; }

    .category-row td {
      padding: 12px 24px; background: #f9fafb;
    }
    .category-label {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; font-weight: 700; color: #111827;
      text-transform: uppercase; letter-spacing: 0.5px;
    }
    .category-icon { display: flex; align-items: center; color: #4b5563; }
    :host ::ng-deep .category-icon svg { width: 14px; height: 14px; }

    .permission-row:hover { background: #f9fafb; }
    .permission-row td { border-bottom: 1px solid #e5e7eb; }

    .permission-cell { padding: 16px 24px; }
    .perm-name { font-size: 14px; font-weight: 500; color: #111827; }
    .perm-desc { font-size: 12px; color: #6b7280; margin-top: 2px; }

    .access-cell {
      padding: 16px 24px; text-align: center; border-left: 1px solid #e5e7eb;
    }

    .access-icon {
      width: 32px; height: 32px; border-radius: 8px;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .access-icon.full { background: #dcfce7; color: #16a34a; }
    .access-icon.view { background: #fef3c7; color: #d97706; }
    .access-icon.none { background: #f3f4f6; color: #9ca3af; }
    .access-icon.small { width: 20px; height: 20px; border-radius: 4px; }

    /* Summary Cards */
    .summary-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 32px; }
    .summary-card {
      background: white; border-radius: 12px; padding: 20px;
      border: 2px solid #e5e7eb; transition: box-shadow 0.15s;
    }
    .summary-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
    .owner-card { border-color: #c7d2fe; }
    .admin-card { border-color: #bfdbfe; }
    .manager-card { border-color: #bbf7d0; }
    .staff-card { border-color: #e5e7eb; }

    .summary-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
    .summary-icon-box {
      width: 48px; height: 48px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
    }
    .owner-bg { background: rgba(99,102,241,0.1); color: #4f46e5; }
    .admin-bg { background: rgba(59,130,246,0.1); color: #2563eb; }
    .manager-bg { background: rgba(34,197,94,0.1); color: #16a34a; }
    .staff-bg { background: #f3f4f6; color: #4b5563; }

    .summary-level { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }
    .owner-text { color: #4f46e5; }
    .admin-text { color: #2563eb; }
    .manager-text { color: #16a34a; }
    .staff-text { color: #4b5563; }

    .summary-role { font-size: 22px; font-weight: 700; color: #111827; margin: 0 0 4px; }
    .summary-desc { font-size: 13px; color: #6b7280; margin: 0; }
  `]
})
export class PermissionsMatrixComponent {
  showDifferencesOnly = signal(false);

  categories: PermissionCategory[] = [
    {
      name: 'Billing & Payments',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
      permissions: [
        { name: 'View billing information', description: 'Access to invoices and payment history', owner: 'full', admin: 'view', manager: 'none', staff: 'none' },
        { name: 'Manage payment methods', description: 'Add, remove, or update payment methods', owner: 'full', admin: 'none', manager: 'none', staff: 'none' },
        { name: 'Change subscription plan', description: 'Upgrade or downgrade plan', owner: 'full', admin: 'none', manager: 'none', staff: 'none' },
      ]
    },
    {
      name: 'Users & Team Management',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      permissions: [
        { name: 'View team members', description: 'Access to team list and member details', owner: 'full', admin: 'full', manager: 'full', staff: 'view' },
        { name: 'Invite new members', description: 'Send invitations to join the team', owner: 'full', admin: 'full', manager: 'full', staff: 'none' },
        { name: 'Change member roles', description: 'Update permissions and access levels', owner: 'full', admin: 'full', manager: 'none', staff: 'none' },
        { name: 'Remove team members', description: 'Revoke access and remove from team', owner: 'full', admin: 'full', manager: 'none', staff: 'none' },
      ]
    },
    {
      name: 'Packages & Content',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
      permissions: [
        { name: 'View packages', description: 'Access to all package listings', owner: 'full', admin: 'full', manager: 'full', staff: 'full' },
        { name: 'Create & edit packages', description: 'Add new packages and modify existing ones', owner: 'full', admin: 'full', manager: 'full', staff: 'full' },
        { name: 'Publish packages', description: 'Make packages live and available to customers', owner: 'full', admin: 'full', manager: 'full', staff: 'none' },
        { name: 'Delete packages', description: 'Permanently remove packages from the system', owner: 'full', admin: 'full', manager: 'none', staff: 'none' },
      ]
    },
    {
      name: 'Bookings & Orders',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
      permissions: [
        { name: 'View bookings', description: 'Access to all booking information', owner: 'full', admin: 'full', manager: 'full', staff: 'full' },
        { name: 'Approve/reject bookings', description: 'Manage booking requests and confirmations', owner: 'full', admin: 'full', manager: 'full', staff: 'none' },
        { name: 'Process refunds', description: 'Issue refunds for cancelled bookings', owner: 'full', admin: 'full', manager: 'none', staff: 'none' },
      ]
    },
    {
      name: 'Settings & Configuration',
      icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
      permissions: [
        { name: 'View agency settings', description: 'Access to configuration and preferences', owner: 'full', admin: 'full', manager: 'view', staff: 'none' },
        { name: 'Modify agency settings', description: 'Change configuration and preferences', owner: 'full', admin: 'full', manager: 'none', staff: 'none' },
        { name: 'Delete agency', description: 'Permanently remove agency and all data', owner: 'full', admin: 'none', manager: 'none', staff: 'none' },
      ]
    }
  ];

  toggleDifferences(): void {
    this.showDifferencesOnly.update(v => !v);
  }

  allSame(perm: PermissionRow): boolean {
    return perm.owner === perm.admin && perm.admin === perm.manager && perm.manager === perm.staff;
  }
}
