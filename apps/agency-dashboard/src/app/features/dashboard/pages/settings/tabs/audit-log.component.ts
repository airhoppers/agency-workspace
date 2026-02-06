import { Component, Input, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgencyService } from '@workspace/core';
import { AuditLog, AuditLogFilter, AuditLogResponse, AuditAction, AuditResourceType } from '@workspace/core';
import { LoadingComponent, PaginationComponent, EmptyStateComponent } from '@workspace/shared-ui';

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [CommonModule, FormsModule, LoadingComponent, PaginationComponent, EmptyStateComponent, DatePipe],
  template: `
    <div class="audit-log">
      <!-- Summary Stats -->
      @if (!isLoading() && response()) {
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ response()!.total }}</span>
              <span class="stat-label">Total Changes</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon stat-icon--filter">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
              </svg>
            </div>
            <div class="stat-content">
              <span class="stat-value">{{ logs().length }}</span>
              <span class="stat-label">Showing on Page</span>
            </div>
          </div>
        </div>
      }

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">Section</label>
            <select class="filter-select" [(ngModel)]="filterResourceType">
              <option value="">All Sections</option>
              @for (section of resourceTypes; track section.value) {
                <option [value]="section.value">{{ section.label }}</option>
              }
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Action</label>
            <select class="filter-select" [(ngModel)]="filterAction">
              <option value="">All Actions</option>
              @for (action of actions; track action.value) {
                <option [value]="action.value">{{ action.label }}</option>
              }
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">Date From</label>
            <input
              type="date"
              class="filter-input"
              [(ngModel)]="filterDateFrom"
            />
          </div>

          <div class="filter-group">
            <label class="filter-label">Date To</label>
            <input
              type="date"
              class="filter-input"
              [(ngModel)]="filterDateTo"
            />
          </div>
        </div>

        <div class="filter-actions">
          <button class="btn btn-primary" (click)="applyFilters()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
            </svg>
            Apply Filters
          </button>
          <button class="btn btn-secondary" (click)="resetFilters()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
            </svg>
            Reset
          </button>
          <button class="btn btn-outline" (click)="exportLog()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Log
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (isLoading()) {
        <div class="loading-container">
          <app-loading size="lg" text="Loading audit logs..."></app-loading>
        </div>
      } @else if (logs().length === 0) {
        <!-- Empty State -->
        <div class="empty-container">
          <app-empty-state
            title="No audit logs found"
            description="There are no audit log entries matching your current filters. Try adjusting the filters or check back later."
            [actionLabel]="hasActiveFilters() ? 'Clear Filters' : undefined"
            (action)="resetFilters()"
          ></app-empty-state>
        </div>
      } @else {
        <!-- Data Table -->
        <div class="table-container">
          <table class="audit-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Section</th>
                <th>Action</th>
                <th>Description</th>
                <th>Changed By</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              @for (log of logs(); track log.id) {
                <tr class="audit-row" (click)="toggleRowExpand(log.id)">
                  <td class="cell-timestamp">
                    <span class="timestamp-date">{{ log.createdAt | date:'MMM d, y' }}</span>
                    <span class="timestamp-time">{{ log.createdAt | date:'HH:mm:ss' }}</span>
                  </td>
                  <td>
                    <span class="badge" [class]="'badge--' + getResourceTypeColor(log.resourceType)">
                      {{ formatResourceType(log.resourceType) }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge--action" [class]="'badge--action-' + log.action.toLowerCase()">
                      {{ log.action }}
                    </span>
                  </td>
                  <td class="cell-description">
                    {{ log.description || 'No description' }}
                  </td>
                  <td class="cell-performer">
                    <div class="performer">
                      <div class="performer-avatar">
                        {{ getPerformerInitials(log) }}
                      </div>
                      <span class="performer-name">{{ getPerformerName(log) }}</span>
                    </div>
                  </td>
                  <td class="cell-created">
                    {{ log.createdAt | date:'short' }}
                  </td>
                </tr>
                @if (expandedRowId() === log.id && log.changes) {
                  <tr class="changes-row">
                    <td colspan="6">
                      <div class="changes-detail">
                        <span class="changes-label">Changes:</span>
                        <pre class="changes-content">{{ formatChanges(log.changes) }}</pre>
                      </div>
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        @if (response()!.total > pageSize) {
          <div class="pagination-wrapper">
            <app-pagination
              [total]="response()!.total"
              [currentPage]="currentPage()"
              [pageSize]="pageSize"
              (pageChange)="onPageChange($event)"
            ></app-pagination>
          </div>
        }
      }
    </div>
  `,
  styles: [`
    .audit-log {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    /* ---- Summary Stats ---- */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-md);
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      transition: box-shadow var(--transition-fast);

      &:hover {
        box-shadow: var(--shadow-md);
      }
    }

    .stat-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 44px;
      height: 44px;
      border-radius: var(--radius-lg);
      background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
      color: #fff;
      flex-shrink: 0;

      &--filter {
        background: linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-primary-700) 100%);
      }
    }

    .stat-content {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      line-height: var(--line-height-tight);
    }

    .stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      font-weight: var(--font-weight-medium);
    }

    /* ---- Filter Bar ---- */
    .filter-bar {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .filter-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-md);

      @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .filter-label {
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .filter-select,
    .filter-input {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background-color: var(--bg-secondary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: border-color var(--transition-fast), box-shadow var(--transition-fast);

      &:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }

      &:hover {
        border-color: var(--border-default);
      }
    }

    .filter-input {
      font-family: var(--font-family-base);
    }

    .filter-actions {
      display: flex;
      gap: var(--spacing-sm);
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    /* ---- Buttons ---- */
    .btn {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      font-family: var(--font-family-base);
      border-radius: var(--radius-md);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all var(--transition-fast);
      white-space: nowrap;

      &:active {
        transform: scale(0.98);
      }
    }

    .btn-primary {
      background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
      color: #fff;
      border-color: transparent;

      &:hover {
        opacity: 0.9;
        box-shadow: var(--shadow-md);
      }
    }

    .btn-secondary {
      background: var(--bg-secondary);
      color: var(--text-secondary);
      border-color: var(--border-light);

      &:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
        border-color: var(--border-default);
      }
    }

    .btn-outline {
      background: transparent;
      color: var(--text-secondary);
      border-color: var(--border-default);

      &:hover {
        background: var(--bg-secondary);
        color: var(--text-primary);
      }
    }

    /* ---- Loading ---- */
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 300px;
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
    }

    /* ---- Empty State ---- */
    .empty-container {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
    }

    /* ---- Table ---- */
    .table-container {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
      overflow-x: auto;
    }

    .audit-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 780px;

      th {
        padding: var(--spacing-sm) var(--spacing-md);
        text-align: left;
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-semibold);
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.04em;
        background: var(--bg-secondary);
        border-bottom: 1px solid var(--border-light);
        white-space: nowrap;
      }

      td {
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: var(--font-size-sm);
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-light);
        vertical-align: middle;
      }
    }

    .audit-row {
      cursor: pointer;
      transition: background-color var(--transition-fast);

      &:hover {
        background-color: var(--bg-secondary);
      }

      &:last-child td {
        border-bottom: none;
      }
    }

    .cell-timestamp {
      white-space: nowrap;
    }

    .timestamp-date {
      display: block;
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      line-height: var(--line-height-tight);
    }

    .timestamp-time {
      display: block;
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      font-family: var(--font-family-mono);
    }

    .cell-description {
      max-width: 280px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--text-secondary);
    }

    .cell-created {
      white-space: nowrap;
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    /* ---- Badges ---- */
    .badge {
      display: inline-block;
      padding: 2px 10px;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-full);
      white-space: nowrap;
      letter-spacing: 0.02em;
    }

    .badge--blue {
      background-color: #dbeafe;
      color: #1e40af;
    }

    .badge--purple {
      background-color: #ede9fe;
      color: #6d28d9;
    }

    .badge--orange {
      background-color: #fff7ed;
      color: #c2410c;
    }

    .badge--green {
      background-color: #dcfce7;
      color: #15803d;
    }

    .badge--teal {
      background-color: #ccfbf1;
      color: #0f766e;
    }

    .badge--amber {
      background-color: #fef3c7;
      color: #92400e;
    }

    .badge--action {
      text-transform: uppercase;
      font-size: 0.65rem;
      letter-spacing: 0.06em;
    }

    .badge--action-create {
      background-color: var(--color-success-light);
      color: var(--color-success-dark);
    }

    .badge--action-update {
      background-color: var(--color-info-light);
      color: var(--color-info-dark);
    }

    .badge--action-delete {
      background-color: var(--color-error-light);
      color: var(--color-error-dark);
    }

    .badge--action-invite {
      background-color: #ede9fe;
      color: #6d28d9;
    }

    .badge--action-accept {
      background-color: var(--color-success-light);
      color: var(--color-success-dark);
    }

    .badge--action-cancel {
      background-color: var(--color-warning-light);
      color: var(--color-warning-dark);
    }

    .badge--action-status_change {
      background-color: #ccfbf1;
      color: #0f766e;
    }

    /* ---- Performer ---- */
    .performer {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .performer-avatar {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg, #ff9370 0%, #ff4e78 100%);
      color: #fff;
      font-size: 0.65rem;
      font-weight: var(--font-weight-bold);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .performer-name {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      white-space: nowrap;
    }

    /* ---- Expanded Changes Row ---- */
    .changes-row td {
      padding: 0;
      background-color: var(--bg-secondary);
      border-bottom: 1px solid var(--border-light);
    }

    .changes-detail {
      padding: var(--spacing-sm) var(--spacing-lg);
    }

    .changes-label {
      display: block;
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: var(--spacing-xs);
    }

    .changes-content {
      font-family: var(--font-family-mono);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
      background: var(--bg-tertiary);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      overflow-x: auto;
      margin: 0;
      line-height: var(--line-height-relaxed);
      white-space: pre-wrap;
      word-break: break-all;
    }

    /* ---- Pagination Wrapper ---- */
    .pagination-wrapper {
      background: var(--bg-primary);
      border: 1px solid var(--border-light);
      border-radius: var(--radius-xl);
      overflow: hidden;
    }

    /* ---- Responsive ---- */
    @media (max-width: 600px) {
      .filter-actions {
        justify-content: stretch;

        .btn {
          flex: 1;
          justify-content: center;
        }
      }

      .stats-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AuditLogComponent implements OnInit {
  @Input({ required: true }) agencyId!: string;

  private readonly agencyService = inject(AgencyService);

  // State
  readonly isLoading = signal(true);
  readonly response = signal<AuditLogResponse | null>(null);
  readonly expandedRowId = signal<string | null>(null);

  // Derived
  readonly logs = computed(() => this.response()?.data ?? []);
  readonly currentPage = computed(() => {
    const resp = this.response();
    if (!resp) return 1;
    return Math.floor(resp.offset / this.pageSize) + 1;
  });

  // Pagination
  readonly pageSize = 15;

  // Filter form state
  filterResourceType = '';
  filterAction = '';
  filterDateFrom = '';
  filterDateTo = '';

  // Filter options
  readonly resourceTypes: { value: AuditResourceType; label: string }[] = [
    { value: 'AGENCY', label: 'Agency' },
    { value: 'AGENCY_SETTINGS', label: 'Agency Settings' },
    { value: 'AGENCY_MEMBER', label: 'Agency Member' },
    { value: 'TRAVEL_PACKAGE', label: 'Travel Package' },
    { value: 'BOOKING', label: 'Booking' },
    { value: 'VERIFICATION', label: 'Verification' }
  ];

  readonly actions: { value: AuditAction; label: string }[] = [
    { value: 'CREATE', label: 'Create' },
    { value: 'UPDATE', label: 'Update' },
    { value: 'DELETE', label: 'Delete' },
    { value: 'INVITE', label: 'Invite' },
    { value: 'ACCEPT', label: 'Accept' },
    { value: 'CANCEL', label: 'Cancel' },
    { value: 'STATUS_CHANGE', label: 'Status Change' }
  ];

  // Color map for resource type badges
  private readonly resourceTypeColorMap: Record<string, string> = {
    'AGENCY_SETTINGS': 'blue',
    'TRAVEL_PACKAGE': 'purple',
    'BOOKING': 'orange',
    'AGENCY': 'green',
    'AGENCY_MEMBER': 'teal',
    'VERIFICATION': 'amber'
  };

  ngOnInit(): void {
    this.loadAuditLogs(0);
  }

  applyFilters(): void {
    this.loadAuditLogs(0);
  }

  resetFilters(): void {
    this.filterResourceType = '';
    this.filterAction = '';
    this.filterDateFrom = '';
    this.filterDateTo = '';
    this.loadAuditLogs(0);
  }

  hasActiveFilters(): boolean {
    return !!(this.filterResourceType || this.filterAction || this.filterDateFrom || this.filterDateTo);
  }

  onPageChange(page: number): void {
    const offset = (page - 1) * this.pageSize;
    this.loadAuditLogs(offset);
  }

  toggleRowExpand(logId: string): void {
    this.expandedRowId.update(current => current === logId ? null : logId);
  }

  getResourceTypeColor(resourceType: string): string {
    return this.resourceTypeColorMap[resourceType] ?? 'blue';
  }

  formatResourceType(resourceType: string): string {
    return resourceType
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  }

  getPerformerName(log: AuditLog): string {
    if (log.performedByFirstName || log.performedByLastName) {
      return [log.performedByFirstName, log.performedByLastName].filter(Boolean).join(' ');
    }
    return log.performedById.substring(0, 8) + '...';
  }

  getPerformerInitials(log: AuditLog): string {
    if (log.performedByFirstName && log.performedByLastName) {
      return log.performedByFirstName.charAt(0) + log.performedByLastName.charAt(0);
    }
    if (log.performedByFirstName) {
      return log.performedByFirstName.charAt(0);
    }
    return log.performedById.substring(0, 2).toUpperCase();
  }

  formatChanges(changes: string): string {
    try {
      const parsed = JSON.parse(changes);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return changes;
    }
  }

  exportLog(): void {
    const data = this.logs();
    if (data.length === 0) return;

    const headers = ['Timestamp', 'Section', 'Action', 'Description', 'Changed By', 'Created At'];
    const rows = data.map(log => [
      log.createdAt,
      this.formatResourceType(log.resourceType),
      log.action,
      log.description ?? '',
      this.getPerformerName(log),
      log.createdAt
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `audit-log-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private loadAuditLogs(offset: number): void {
    this.isLoading.set(true);
    this.expandedRowId.set(null);

    const filter: AuditLogFilter = {
      offset,
      limit: this.pageSize
    };

    if (this.filterResourceType) {
      filter.resourceType = this.filterResourceType;
    }
    if (this.filterAction) {
      filter.action = this.filterAction;
    }
    if (this.filterDateFrom) {
      filter.from = new Date(this.filterDateFrom).getTime();
    }
    if (this.filterDateTo) {
      // Set to end of the selected day
      const toDate = new Date(this.filterDateTo);
      toDate.setHours(23, 59, 59, 999);
      filter.to = toDate.getTime();
    }

    this.agencyService.getAuditLogs(this.agencyId, filter).subscribe({
      next: (response) => {
        this.response.set(response);
        this.isLoading.set(false);
      },
      error: () => {
        this.response.set({ data: [], offset: 0, total: 0 });
        this.isLoading.set(false);
      }
    });
  }
}
