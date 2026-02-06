import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading" [class]="sizeClass">
      <div class="spinner"></div>
      @if (text) {
        <span class="loading-text">{{ text }}</span>
      }
    </div>
  `,
  styles: [`
    .loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md);

      &.loading-sm {
        .spinner {
          width: 20px;
          height: 20px;
          border-width: 2px;
        }
        .loading-text {
          font-size: var(--font-size-xs);
        }
      }

      &.loading-md {
        .spinner {
          width: 32px;
          height: 32px;
          border-width: 3px;
        }
        .loading-text {
          font-size: var(--font-size-sm);
        }
      }

      &.loading-lg {
        .spinner {
          width: 48px;
          height: 48px;
          border-width: 4px;
        }
        .loading-text {
          font-size: var(--font-size-base);
        }
      }
    }

    .spinner {
      border-radius: 50%;
      border-style: solid;
      border-color: var(--border-light);
      border-top-color: var(--color-primary-600);
      animation: spin 0.8s linear infinite;
    }

    .loading-text {
      color: var(--text-secondary);
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() text?: string;

  get sizeClass(): string {
    return `loading-${this.size}`;
  }
}
