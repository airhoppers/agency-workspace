import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="empty-state">
      @if (icon) {
        <div class="empty-icon" [innerHTML]="icon"></div>
      } @else {
        <div class="empty-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><polyline points="13 2 13 9 20 9"/>
          </svg>
        </div>
      }

      <h3 class="empty-title">{{ title }}</h3>

      @if (description) {
        <p class="empty-description">{{ description }}</p>
      }

      @if (actionLabel) {
        <app-button
          [variant]="actionVariant"
          (onClick)="action.emit()"
        >
          {{ actionLabel }}
        </app-button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--spacing-2xl);
      text-align: center;
    }

    .empty-icon {
      color: var(--text-tertiary);
      margin-bottom: var(--spacing-lg);
      opacity: 0.5;

      :host ::ng-deep svg {
        width: 64px;
        height: 64px;
      }
    }

    .empty-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-sm) 0;
    }

    .empty-description {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-lg) 0;
      max-width: 400px;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title = 'No data found';
  @Input() description?: string;
  @Input() icon?: string;
  @Input() actionLabel?: string;
  @Input() actionVariant: 'primary' | 'secondary' = 'primary';

  @Output() action = new EventEmitter<void>();
}
