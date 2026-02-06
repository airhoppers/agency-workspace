import { Component, Input, signal, ElementRef, inject, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-optimized-image',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="image-container"
      [class.loaded]="isLoaded()"
      [class.error]="hasError()"
      [style.aspect-ratio]="aspectRatio"
    >
      <!-- Skeleton placeholder -->
      @if (!isLoaded() && !hasError()) {
        <div class="skeleton">
          <div class="skeleton-shimmer"></div>
        </div>
      }

      <!-- Actual image -->
      @if (shouldLoad()) {
        <img
          [src]="src"
          [alt]="alt"
          [class.visible]="isLoaded()"
          (load)="onImageLoad()"
          (error)="onImageError()"
          loading="lazy"
          decoding="async"
        />
      }

      <!-- Error fallback -->
      @if (hasError()) {
        <div class="error-fallback">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
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

    .image-container {
      position: relative;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #f3f4f6;
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
        rgba(255, 255, 255, 0.4) 50%,
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

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0;
      transition: opacity 0.3s ease;

      &.visible {
        opacity: 1;
      }
    }

    .error-fallback {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
      color: #9ca3af;
    }

    .image-container.loaded .skeleton {
      display: none;
    }
  `]
})
export class OptimizedImageComponent implements OnInit, OnDestroy {
  @Input({ required: true }) src!: string;
  @Input() alt = '';
  @Input() aspectRatio = '16/9';
  @Input() priority = false; // For above-the-fold images

  private elementRef = inject(ElementRef);
  private observer: IntersectionObserver | null = null;

  isLoaded = signal(false);
  hasError = signal(false);
  shouldLoad = signal(false);

  ngOnInit(): void {
    if (this.priority) {
      // Load immediately for priority images
      this.shouldLoad.set(true);
    } else {
      // Use Intersection Observer for lazy loading
      this.setupIntersectionObserver();
    }
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  private setupIntersectionObserver(): void {
    if ('IntersectionObserver' in window) {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.shouldLoad.set(true);
              this.observer?.disconnect();
            }
          });
        },
        {
          rootMargin: '100px', // Start loading 100px before visible
          threshold: 0
        }
      );

      this.observer.observe(this.elementRef.nativeElement);
    } else {
      // Fallback for older browsers
      this.shouldLoad.set(true);
    }
  }

  onImageLoad(): void {
    this.isLoaded.set(true);
  }

  onImageError(): void {
    this.hasError.set(true);
  }
}
