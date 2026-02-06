import { Component, Input, Output, EventEmitter, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pagination">
      <div class="pagination-info">
        Showing {{ startItem() }} - {{ endItem() }} of {{ total }}
      </div>

      <div class="pagination-controls">
        <button
          class="page-btn"
          [disabled]="currentPage === 1"
          (click)="goToPage(1)"
          aria-label="First page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
        </button>

        <button
          class="page-btn"
          [disabled]="currentPage === 1"
          (click)="goToPage(currentPage - 1)"
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
        </button>

        @for (page of visiblePages(); track page) {
          @if (page === '...') {
            <span class="page-ellipsis">...</span>
          } @else {
            <button
              class="page-btn page-number"
              [class.active]="page === currentPage"
              (click)="goToPage(+page)"
            >
              {{ page }}
            </button>
          }
        }

        <button
          class="page-btn"
          [disabled]="currentPage === totalPages()"
          (click)="goToPage(currentPage + 1)"
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
        </button>

        <button
          class="page-btn"
          [disabled]="currentPage === totalPages()"
          (click)="goToPage(totalPages())"
          aria-label="Last page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .pagination-info {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .page-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 36px;
      height: 36px;
      padding: var(--spacing-xs);
      background: transparent;
      border: 1px solid var(--border-light);
      border-radius: var(--radius-md);
      color: var(--text-secondary);
      font-size: var(--font-size-sm);
      cursor: pointer;
      transition: all var(--transition-fast);

      &:hover:not(:disabled) {
        background-color: var(--bg-secondary);
        border-color: var(--border-default);
        color: var(--text-primary);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }

      &.active {
        background-color: var(--color-primary-600);
        border-color: var(--color-primary-600);
        color: var(--text-inverse);
      }
    }

    .page-ellipsis {
      padding: 0 var(--spacing-xs);
      color: var(--text-tertiary);
    }
  `]
})
export class PaginationComponent {
  @Input() total = 0;
  @Input() currentPage = 1;
  @Input() pageSize = 10;
  @Input() maxVisiblePages = 5;

  @Output() pageChange = new EventEmitter<number>();

  totalPages = computed(() => Math.ceil(this.total / this.pageSize) || 1);

  startItem = computed(() => {
    if (this.total === 0) return 0;
    return (this.currentPage - 1) * this.pageSize + 1;
  });

  endItem = computed(() => {
    return Math.min(this.currentPage * this.pageSize, this.total);
  });

  visiblePages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage;
    const max = this.maxVisiblePages;

    if (total <= max) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const half = Math.floor(max / 2);

    let start = Math.max(current - half, 1);
    let end = Math.min(start + max - 1, total);

    if (end - start < max - 1) {
      start = Math.max(end - max + 1, 1);
    }

    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < total) {
      if (end < total - 1) pages.push('...');
      pages.push(total);
    }

    return pages;
  });

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages() || page === this.currentPage) {
      return;
    }
    this.pageChange.emit(page);
  }
}
