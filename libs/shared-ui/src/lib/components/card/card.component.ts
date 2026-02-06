import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card" [class.hoverable]="hoverable" [class.clickable]="clickable">
      @if (title || showHeader) {
        <div class="card-header">
          <div class="header-content">
            @if (title) {
              <h3 class="card-title">{{ title }}</h3>
            }
            @if (subtitle) {
              <p class="card-subtitle">{{ subtitle }}</p>
            }
          </div>
          <div class="header-actions">
            <ng-content select="[card-actions]"></ng-content>
          </div>
        </div>
      }

      <div class="card-body" [class.no-padding]="noPadding">
        <ng-content></ng-content>
      </div>

      @if (showFooter) {
        <div class="card-footer">
          <ng-content select="[card-footer]"></ng-content>
        </div>
      }
    </div>
  `,
  styles: [`
    .card {
      background-color: white;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      overflow: hidden;

      &.hoverable {
        transition: all 0.2s ease;

        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          border-color: #d1d5db;
        }
      }

      &.clickable {
        cursor: pointer;
      }
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px 24px;
      border-bottom: 1px solid #f3f4f6;
    }

    .header-content {
      flex: 1;
    }

    .card-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .card-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin: 4px 0 0 0;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .card-body {
      padding: 24px;

      &.no-padding {
        padding: 0;
      }
    }

    .card-footer {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      padding: 16px 24px;
      border-top: 1px solid #f3f4f6;
      background-color: #f9fafb;
    }
  `]
})
export class CardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() hoverable = false;
  @Input() clickable = false;
  @Input() noPadding = false;
  @Input() showHeader = false;
  @Input() showFooter = false;
}
