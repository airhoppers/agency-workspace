import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen) {
      <div class="modal-backdrop" (click)="onBackdropClick($event)">
        <div class="modal-container" [class]="sizeClass" role="dialog" aria-modal="true">
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            @if (showCloseButton) {
              <button class="close-button" (click)="close()" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            }
          </div>

          <div class="modal-body">
            <ng-content></ng-content>
          </div>

          @if (showFooter) {
            <div class="modal-footer">
              <ng-content select="[modal-footer]"></ng-content>
            </div>
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--z-modal-backdrop);
      animation: fadeIn 0.2s ease-out;
    }

    .modal-container {
      background-color: var(--bg-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      z-index: var(--z-modal);
      animation: slideIn 0.2s ease-out;

      &.modal-sm {
        width: 400px;
        max-width: 90vw;
      }

      &.modal-md {
        width: 600px;
        max-width: 90vw;
      }

      &.modal-lg {
        width: 800px;
        max-width: 90vw;
      }

      &.modal-xl {
        width: 1000px;
        max-width: 90vw;
      }
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-lg);
      border-bottom: 1px solid var(--border-light);
    }

    .modal-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0;
    }

    .close-button {
      background: none;
      border: none;
      padding: var(--spacing-xs);
      color: var(--text-tertiary);
      cursor: pointer;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all var(--transition-fast);

      &:hover {
        background-color: var(--bg-tertiary);
        color: var(--text-primary);
      }
    }

    .modal-body {
      padding: var(--spacing-lg);
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--spacing-sm);
      padding: var(--spacing-md) var(--spacing-lg);
      border-top: 1px solid var(--border-light);
      background-color: var(--bg-secondary);
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `]
})
export class ModalComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showCloseButton = true;
  @Input() showFooter = true;
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;

  @Output() closed = new EventEmitter<void>();

  get sizeClass(): string {
    return `modal-${this.size}`;
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen && this.closeOnEscape) {
      this.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.close();
    }
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }
}
