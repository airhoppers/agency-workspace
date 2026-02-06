import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled || loading"
      [class]="buttonClasses"
      (click)="onClick.emit($event)"
    >
      @if (loading) {
        <span class="spinner"></span>
      }
      @if (icon && iconPosition === 'left') {
        <span class="icon" [innerHTML]="icon"></span>
      }
      <ng-content></ng-content>
      @if (icon && iconPosition === 'right') {
        <span class="icon" [innerHTML]="icon"></span>
      }
    </button>
  `,
  styles: [`
    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-weight: 600;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.15s ease;
      border: none;
      outline: none;
      padding: 10px 20px;
      font-size: 14px;
      min-height: 40px;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      &.btn-primary {
        background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
        color: white;

        &:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      }

      &.btn-secondary {
        background: transparent;
        color: #FF4E78;
        border: 1px solid #FF4E78;

        &:hover:not(:disabled) {
          background: rgba(255, 78, 120, 0.1);
        }
      }

      &.btn-ghost {
        background: transparent;
        color: #6b7280;

        &:hover:not(:disabled) {
          background: #f3f4f6;
          color: #111827;
        }
      }

      &.btn-danger {
        background: #ef4444;
        color: white;

        &:hover:not(:disabled) {
          background: #dc2626;
        }
      }

      &.btn-success {
        background: #10b981;
        color: white;

        &:hover:not(:disabled) {
          background: #059669;
        }
      }

      &.btn-sm {
        padding: 6px 12px;
        font-size: 12px;
        min-height: 32px;
      }

      &.btn-lg {
        padding: 14px 28px;
        font-size: 16px;
        min-height: 48px;
      }

      &.btn-block {
        width: 100%;
      }
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .icon {
      display: flex;
      align-items: center;

      :host ::ng-deep svg {
        width: 18px;
        height: 18px;
      }
    }
  `]
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() block = false;
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'left';

  @Output() onClick = new EventEmitter<MouseEvent>();

  get buttonClasses(): string {
    return [
      `btn-${this.variant}`,
      `btn-${this.size}`,
      this.block ? 'btn-block' : ''
    ].filter(Boolean).join(' ');
  }
}
