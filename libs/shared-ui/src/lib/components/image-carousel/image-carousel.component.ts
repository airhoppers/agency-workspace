import { Component, Input, Output, EventEmitter, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-carousel',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="carousel" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">
      <!-- Images container -->
      <div class="images-container">
        @for (image of images; track image; let i = $index) {
          <div
            class="image-slide"
            [class.active]="i === activeIndex()"
            [class.preload]="shouldPreload(i)"
          >
            @if (shouldRender(i)) {
              <img
                [src]="image"
                [alt]="alt + ' - Image ' + (i + 1)"
                [class.loaded]="loadedImages()[i]"
                (load)="onImageLoad(i)"
                (error)="onImageError(i)"
                loading="lazy"
                decoding="async"
              />
            }
            <!-- Skeleton for unloaded images -->
            @if (!loadedImages()[i] && shouldRender(i)) {
              <div class="skeleton">
                <div class="skeleton-shimmer"></div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Navigation arrows (only show on hover for performance) -->
      @if (images.length > 1 && isHovered()) {
        <button
          class="nav-btn prev"
          [class.hidden]="activeIndex() === 0"
          (click)="prev($event)"
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
        </button>
        <button
          class="nav-btn next"
          [class.hidden]="activeIndex() === images.length - 1"
          (click)="next($event)"
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      }

      <!-- Dots indicator -->
      @if (images.length > 1) {
        <div class="dots">
          @for (image of images; track image; let i = $index) {
            <button
              class="dot"
              [class.active]="i === activeIndex()"
              (click)="goTo(i, $event)"
              [attr.aria-label]="'Go to image ' + (i + 1)"
            ></button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }

    .carousel {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
    }

    .images-container {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .image-slide {
      position: absolute;
      inset: 0;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.4s ease, visibility 0.4s ease;

      &.active {
        opacity: 1;
        visibility: visible;
        z-index: 1;
      }

      &.preload {
        visibility: hidden;
      }
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;

      &.loaded {
        opacity: 1;
      }
    }

    .skeleton {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      overflow: hidden;
    }

    .skeleton-shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.5) 50%,
        transparent 100%
      );
      animation: shimmer 1.5s infinite;
      transform: translateX(-100%);
    }

    @keyframes shimmer {
      100% {
        transform: translateX(100%);
      }
    }

    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      background: rgba(255, 255, 255, 0.95);
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #374151;
      z-index: 2;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;

      &:hover {
        transform: translateY(-50%) scale(1.1);
        box-shadow: 0 3px 12px rgba(0, 0, 0, 0.2);
      }

      &.prev {
        left: 8px;
      }

      &.next {
        right: 8px;
      }

      &.hidden {
        opacity: 0.4;
        pointer-events: none;
      }
    }

    .dots {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 6px;
      z-index: 2;
    }

    .dot {
      width: 8px;
      height: 8px;
      background: rgba(255, 255, 255, 0.5);
      border: none;
      border-radius: 50%;
      cursor: pointer;
      padding: 0;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.8);
      }

      &.active {
        background: white;
        transform: scale(1.2);
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
      }
    }
  `]
})
export class ImageCarouselComponent {
  @Input({ required: true }) images: string[] = [];
  @Input() alt = 'Image';
  @Input() initialIndex = 0;
  @Output() indexChange = new EventEmitter<number>();

  activeIndex = signal(0);
  isHovered = signal(false);
  loadedImages = signal<Record<number, boolean>>({});
  errorImages = signal<Record<number, boolean>>({});

  // Only render current, previous, and next images for performance
  shouldRender(index: number): boolean {
    const current = this.activeIndex();
    return index === current || index === current - 1 || index === current + 1;
  }

  // Preload next image
  shouldPreload(index: number): boolean {
    return index === this.activeIndex() + 1;
  }

  onMouseEnter(): void {
    this.isHovered.set(true);
  }

  onMouseLeave(): void {
    this.isHovered.set(false);
  }

  onImageLoad(index: number): void {
    this.loadedImages.update(loaded => ({ ...loaded, [index]: true }));
  }

  onImageError(index: number): void {
    this.errorImages.update(errors => ({ ...errors, [index]: true }));
  }

  prev(event: Event): void {
    event.stopPropagation();
    if (this.activeIndex() > 0) {
      this.activeIndex.update(i => i - 1);
      this.indexChange.emit(this.activeIndex());
    }
  }

  next(event: Event): void {
    event.stopPropagation();
    if (this.activeIndex() < this.images.length - 1) {
      this.activeIndex.update(i => i + 1);
      this.indexChange.emit(this.activeIndex());
    }
  }

  goTo(index: number, event: Event): void {
    event.stopPropagation();
    this.activeIndex.set(index);
    this.indexChange.emit(index);
  }
}
