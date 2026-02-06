import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast" [class]="'toast-' + toast.type" (click)="toastService.remove(toast.id)">
          <div class="toast-icon">
            @switch (toast.type) {
              @case ('success') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              }
              @case ('error') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
              }
              @case ('warning') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              }
              @case ('info') {
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              }
            }
          </div>

          <div class="toast-content">
            @if (toast.title) {
              <div class="toast-title">{{ toast.title }}</div>
            }
            <div class="toast-message">{{ toast.message }}</div>
          </div>

          <button class="toast-close" (click)="toastService.remove(toast.id); $event.stopPropagation()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 80px; /* Below the sticky header (64px) + spacing */
      right: var(--spacing-lg);
      z-index: var(--z-tooltip);
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      max-width: 400px;
      width: 100%;
      pointer-events: none;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background-color: var(--bg-primary);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      pointer-events: auto;
      cursor: pointer;
      animation: slideIn 0.3s ease-out;
      border-left: 4px solid;

      &.toast-success {
        border-left-color: var(--color-success);
        .toast-icon { color: var(--color-success); }
      }

      &.toast-error {
        border-left-color: var(--color-error);
        .toast-icon { color: var(--color-error); }
      }

      &.toast-warning {
        border-left-color: var(--color-warning);
        .toast-icon { color: var(--color-warning); }
      }

      &.toast-info {
        border-left-color: var(--color-info);
        .toast-icon { color: var(--color-info); }
      }
    }

    .toast-icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    .toast-content {
      flex: 1;
      min-width: 0;
    }

    .toast-title {
      font-weight: var(--font-weight-semibold);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .toast-message {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: var(--line-height-normal);
    }

    .toast-close {
      flex-shrink: 0;
      background: none;
      border: none;
      padding: var(--spacing-xs);
      color: var(--text-tertiary);
      cursor: pointer;
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;

      &:hover {
        background-color: var(--bg-tertiary);
        color: var(--text-primary);
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(100%);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
