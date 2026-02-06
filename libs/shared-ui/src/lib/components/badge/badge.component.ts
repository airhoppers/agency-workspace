import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [class]="badgeClass">
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 500;
      border-radius: 20px;
      white-space: nowrap;

      &.badge-default {
        background-color: #f3f4f6;
        color: #6b7280;
      }

      &.badge-primary {
        background-color: rgba(255, 78, 120, 0.1);
        color: #FF4E78;
      }

      &.badge-success {
        background-color: #d1fae5;
        color: #065f46;
      }

      &.badge-warning {
        background-color: #fef3c7;
        color: #92400e;
      }

      &.badge-danger {
        background-color: #fee2e2;
        color: #dc2626;
      }

      &.badge-info {
        background-color: #dbeafe;
        color: #1e40af;
      }

      &.badge-sm {
        padding: 2px 6px;
        font-size: 10px;
      }

      &.badge-lg {
        padding: 6px 14px;
        font-size: 14px;
      }
    }
  `]
})
export class BadgeComponent {
  @Input() variant: BadgeVariant = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  get badgeClass(): string {
    return `badge-${this.variant} badge-${this.size}`;
  }
}
