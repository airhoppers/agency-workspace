import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef, AfterContentInit } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            @for (column of columns; track column.key) {
              <th
                [style.width]="column.width"
                [class.sortable]="column.sortable"
                [class.text-center]="column.align === 'center'"
                [class.text-right]="column.align === 'right'"
                (click)="column.sortable && onSort(column.key)"
              >
                {{ column.label }}
                @if (column.sortable) {
                  <span class="sort-icon">
                    @if (sortKey === column.key) {
                      @if (sortDirection === 'asc') {
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>
                      } @else {
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
                      }
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                    }
                  </span>
                }
              </th>
            }
          </tr>
        </thead>

        <tbody>
          @if (loading) {
            @for (i of [1,2,3,4,5]; track i) {
              <tr class="skeleton-row">
                @for (column of columns; track column.key) {
                  <td><div class="skeleton"></div></td>
                }
              </tr>
            }
          } @else if (data.length === 0) {
            <tr>
              <td [attr.colspan]="columns.length" class="empty-state">
                {{ emptyMessage }}
              </td>
            </tr>
          } @else {
            @for (row of data; track trackByFn(row)) {
              <tr
                [class.clickable]="rowClickable"
                (click)="rowClickable && rowClick.emit(row)"
              >
                @for (column of columns; track column.key) {
                  <td
                    [class.text-center]="column.align === 'center'"
                    [class.text-right]="column.align === 'right'"
                  >
                    @if (cellTemplate) {
                      <ng-container
                        [ngTemplateOutlet]="cellTemplate"
                        [ngTemplateOutletContext]="{ $implicit: row, column: column.key, value: row[column.key] }"
                      ></ng-container>
                    } @else {
                      {{ row[column.key] }}
                    }
                  </td>
                }
              </tr>
            }
          }
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .table-wrapper {
      overflow-x: auto;
    }

    .table {
      width: 100%;
      border-collapse: collapse;
    }

    thead {
      background-color: var(--bg-secondary);
      border-bottom: 1px solid var(--border-light);

      th {
        padding: var(--spacing-sm) var(--spacing-md);
        font-size: var(--font-size-xs);
        font-weight: var(--font-weight-semibold);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--text-secondary);
        text-align: left;

        &.sortable {
          cursor: pointer;
          user-select: none;

          &:hover {
            color: var(--text-primary);
          }
        }

        &.text-center { text-align: center; }
        &.text-right { text-align: right; }
      }
    }

    .sort-icon {
      display: inline-flex;
      margin-left: var(--spacing-xs);
      vertical-align: middle;
    }

    tbody {
      tr {
        border-bottom: 1px solid var(--border-light);
        transition: background-color var(--transition-fast);

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: var(--bg-secondary);
        }

        &.clickable {
          cursor: pointer;
        }
      }

      td {
        padding: var(--spacing-md);
        font-size: var(--font-size-sm);
        color: var(--text-primary);

        &.text-center { text-align: center; }
        &.text-right { text-align: right; }
      }
    }

    .empty-state {
      padding: var(--spacing-2xl) !important;
      text-align: center;
      color: var(--text-tertiary);
    }

    .skeleton-row td {
      padding: var(--spacing-md);
    }

    .skeleton {
      height: 20px;
      background: linear-gradient(
        90deg,
        var(--bg-tertiary) 25%,
        var(--bg-secondary) 50%,
        var(--bg-tertiary) 75%
      );
      background-size: 200% 100%;
      animation: skeleton-loading 1.5s infinite;
      border-radius: var(--radius-sm);
    }

    @keyframes skeleton-loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `]
})
export class TableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() loading = false;
  @Input() emptyMessage = 'No data available';
  @Input() rowClickable = false;
  @Input() trackBy: string = 'id';
  @Input() cellTemplate?: TemplateRef<any>;

  @Output() rowClick = new EventEmitter<any>();
  @Output() sort = new EventEmitter<{ key: string; direction: 'asc' | 'desc' }>();

  sortKey?: string;
  sortDirection: 'asc' | 'desc' = 'asc';

  trackByFn(row: any): any {
    return row[this.trackBy];
  }

  onSort(key: string): void {
    if (this.sortKey === key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortKey = key;
      this.sortDirection = 'asc';
    }
    this.sort.emit({ key: this.sortKey, direction: this.sortDirection });
  }
}
