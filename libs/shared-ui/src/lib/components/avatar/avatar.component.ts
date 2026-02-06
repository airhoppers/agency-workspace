import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="avatar" [class]="avatarClass" [style.background-color]="backgroundColor">
      @if (src) {
        <img [src]="src" [alt]="alt" (error)="onImageError()" />
      } @else {
        <span class="initials">{{ initials }}</span>
      }
      @if (showStatus) {
        <span class="status" [class]="statusClass"></span>
      }
    </div>
  `,
  styles: [`
    .avatar {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full);
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .initials {
        font-weight: var(--font-weight-medium);
        color: var(--text-inverse);
        text-transform: uppercase;
      }

      &.avatar-xs {
        width: 24px;
        height: 24px;
        .initials { font-size: 10px; }
      }

      &.avatar-sm {
        width: 32px;
        height: 32px;
        .initials { font-size: var(--font-size-xs); }
      }

      &.avatar-md {
        width: 40px;
        height: 40px;
        .initials { font-size: var(--font-size-sm); }
      }

      &.avatar-lg {
        width: 56px;
        height: 56px;
        .initials { font-size: var(--font-size-lg); }
      }

      &.avatar-xl {
        width: 80px;
        height: 80px;
        .initials { font-size: var(--font-size-2xl); }
      }
    }

    .status {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 25%;
      height: 25%;
      border-radius: 50%;
      border: 2px solid var(--bg-primary);

      &.status-online {
        background-color: var(--color-success);
      }

      &.status-offline {
        background-color: var(--color-neutral-400);
      }

      &.status-busy {
        background-color: var(--color-error);
      }

      &.status-away {
        background-color: var(--color-warning);
      }
    }
  `]
})
export class AvatarComponent {
  @Input() src?: string;
  @Input() alt = 'Avatar';
  @Input() name?: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showStatus = false;
  @Input() status: 'online' | 'offline' | 'busy' | 'away' = 'offline';

  showImage = true;

  get avatarClass(): string {
    return `avatar-${this.size}`;
  }

  get statusClass(): string {
    return `status-${this.status}`;
  }

  get initials(): string {
    if (!this.name) return '?';
    const parts = this.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return this.name.substring(0, 2).toUpperCase();
  }

  get backgroundColor(): string {
    if (this.src) return 'transparent';

    // Generate consistent color based on name
    const colors = [
      'var(--color-primary-500)',
      'var(--color-secondary-500)',
      '#6366f1', // indigo
      '#8b5cf6', // violet
      '#ec4899', // pink
      '#f59e0b', // amber
      '#10b981', // emerald
      '#06b6d4', // cyan
    ];

    const name = this.name || 'default';
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  }

  onImageError(): void {
    this.src = undefined;
  }
}
