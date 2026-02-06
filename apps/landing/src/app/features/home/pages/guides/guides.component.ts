import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-guides',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Learn &amp; Grow
          </div>
          <h1 class="hero-title">Guides to Help You Succeed</h1>
          <p class="hero-description">
            Step-by-step guides crafted to help you get the most out of AirHoppers. From setting up your first package to advanced analytics, we've got you covered.
          </p>
        </div>
      </div>
    </section>

    <!-- Featured Guides Section -->
    <section class="featured-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Featured</p>
          <h2 class="section-title">Essential Guides</h2>
          <p class="section-description">Our most popular guides to get you started and growing fast.</p>
        </div>
        <div class="featured-grid">
          @for (guide of featuredGuides; track guide.title) {
            <div class="featured-card">
              <div class="featured-card-top">
                <span class="category-badge" [style.background]="guide.badgeBg" [style.color]="guide.badgeColor">
                  {{ guide.category }}
                </span>
              </div>
              <h3 class="featured-card-title">{{ guide.title }}</h3>
              <p class="featured-card-desc">{{ guide.description }}</p>
              <div class="featured-card-footer">
                <span class="read-time">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  {{ guide.readTime }}
                </span>
                <a href="javascript:void(0)" class="read-guide-link">
                  Read Guide
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- More Guides Section -->
    <section class="more-guides-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Explore More</p>
          <h2 class="section-title">More Guides</h2>
          <p class="section-description">Dive deeper into specific topics to level up your travel agency.</p>
        </div>
        <div class="more-guides-grid">
          @for (guide of moreGuides; track guide.title) {
            <div class="more-guide-card">
              <div class="more-guide-card-top">
                <span class="category-badge small" [style.background]="guide.badgeBg" [style.color]="guide.badgeColor">
                  {{ guide.category }}
                </span>
              </div>
              <h3 class="more-guide-title">{{ guide.title }}</h3>
              <p class="more-guide-desc">{{ guide.description }}</p>
              <a href="javascript:void(0)" class="read-guide-link">
                Read Guide
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Want More Tips?</h2>
          <p>Stay up to date with the latest best practices, product updates, and travel industry insights from the AirHoppers team.</p>
          <div class="cta-buttons">
            <a routerLink="/resources" class="btn btn-cta-white btn-lg">
              Visit Our Blog
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/support" class="btn btn-cta-outline btn-lg">Contact Support</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
    }

    * {
      box-sizing: border-box;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-lg);
    }

    /* =============================
       BUTTONS
       ============================= */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
      padding: 10px 20px;
      border-radius: var(--radius-md);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      text-decoration: none;
      cursor: pointer;
      border: none;
      transition: all var(--transition-normal);
    }

    .btn-lg {
      padding: 14px 28px;
      font-size: var(--font-size-lg);
    }

    /* =============================
       SECTION HEADER
       ============================= */
    .section-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .section-tag {
      display: inline-block;
      background: var(--coral-100);
      color: var(--primary);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs, 12px);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-md);
    }

    .section-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 var(--spacing-md);
    }

    .section-description {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    /* =============================
       HERO SECTION
       ============================= */
    .hero {
      padding: 120px 0 60px;
      background: linear-gradient(135deg, var(--coral-50) 0%, #fef2f2 30%, #fdf4ff 60%, white 100%);
      position: relative;
      overflow: hidden;
    }

    .hero::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -20%;
      width: 80%;
      height: 150%;
      background: radial-gradient(circle, rgba(255, 78, 120, 0.08) 0%, transparent 70%);
      pointer-events: none;
    }

    .hero-content {
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: var(--bg-primary);
      border: 1px solid var(--border);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: var(--spacing-lg);
    }

    .badge-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--primary);
    }

    .hero-title {
      font-size: 42px;
      font-weight: 700;
      line-height: 1.1;
      color: var(--text-primary);
      margin: 0 0 20px;
    }

    .hero-description {
      font-size: var(--font-size-xl);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
    }

    /* =============================
       CATEGORY BADGES
       ============================= */
    .category-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs, 12px);
      font-weight: var(--font-weight-semibold);
      letter-spacing: 0.3px;
    }

    .category-badge.small {
      padding: 3px 10px;
      font-size: 11px;
    }

    /* =============================
       FEATURED GUIDES SECTION
       ============================= */
    .featured-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .featured-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      display: flex;
      flex-direction: column;
      transition: all var(--transition-normal);
    }

    .featured-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .featured-card-top {
      margin-bottom: 20px;
    }

    .featured-card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 12px;
      line-height: 1.4;
    }

    .featured-card-desc {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 24px;
      flex: 1;
    }

    .featured-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }

    .read-time {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-sm, 14px);
      color: var(--text-secondary);
    }

    .read-guide-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--primary);
      text-decoration: none;
      transition: gap var(--transition-normal);
    }

    .read-guide-link:hover {
      gap: 10px;
    }

    /* =============================
       MORE GUIDES SECTION
       ============================= */
    .more-guides-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .more-guides-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }

    .more-guide-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px;
      transition: all var(--transition-normal);
    }

    .more-guide-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .more-guide-card-top {
      margin-bottom: 16px;
    }

    .more-guide-title {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 8px;
      line-height: 1.4;
    }

    .more-guide-desc {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 20px;
    }

    /* =============================
       CTA SECTION
       ============================= */
    .cta-section {
      padding: 80px 0;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      position: relative;
      overflow: hidden;
    }

    .cta-section::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -20%;
      width: 80%;
      height: 200%;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      pointer-events: none;
    }

    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .cta-content h2 {
      font-size: 32px;
      font-weight: 700;
      color: white;
      margin: 0 0 var(--spacing-md);
    }

    .cta-content p {
      font-size: var(--font-size-lg);
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
      margin: 0 0 var(--spacing-xl);
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
    }

    .btn-cta-white {
      background: white;
      color: #FF4E78;
      padding: 14px 28px;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-md);
    }

    .btn-cta-white:hover {
      background: #fff1f2;
    }

    .btn-cta-outline {
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: white;
      padding: 14px 28px;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-md);
    }

    .btn-cta-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.5);
    }

    /* =============================
       RESPONSIVE - TABLET (1024px)
       ============================= */
    @media (max-width: 1024px) {
      .hero-title {
        font-size: 36px;
      }

      .section-title {
        font-size: 28px;
      }

      .featured-grid {
        grid-template-columns: 1fr;
        max-width: 540px;
        margin: 0 auto;
      }

      .more-guides-grid {
        grid-template-columns: 1fr;
        max-width: 540px;
        margin: 0 auto;
      }
    }

    /* =============================
       RESPONSIVE - MOBILE (768px)
       ============================= */
    @media (max-width: 768px) {
      .hero {
        padding: 100px 0 48px;
      }

      .hero-title {
        font-size: 28px;
      }

      .hero-description {
        font-size: var(--font-size-lg);
      }

      .featured-section,
      .more-guides-section,
      .cta-section {
        padding: 60px 0;
      }

      .section-title {
        font-size: 24px;
      }

      .featured-card {
        padding: 24px;
      }

      .more-guide-card {
        padding: 20px;
      }

      .cta-content h2 {
        font-size: 24px;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn-cta-white,
      .btn-cta-outline {
        width: 100%;
        max-width: 300px;
      }
    }
  `]
})
export class PublicGuidesComponent {
  featuredGuides = [
    {
      category: 'Getting Started',
      badgeBg: '#eff6ff',
      badgeColor: '#2563eb',
      title: 'How to Create Your First Travel Package',
      description: 'Learn how to set up a compelling travel package from scratch, including adding itineraries, pricing tiers, images, and publishing it for travelers to discover.',
      readTime: '10 min read'
    },
    {
      category: 'Best Practices',
      badgeBg: '#f0fdf4',
      badgeColor: '#16a34a',
      title: 'Optimizing Your Agency Profile',
      description: 'Discover how to craft a standout agency profile that builds trust with potential customers and ranks higher in search results across the platform.',
      readTime: '8 min read'
    },
    {
      category: 'Advanced',
      badgeBg: '#f5f3ff',
      badgeColor: '#7c3aed',
      title: 'Managing Bookings Efficiently',
      description: 'Master the booking management workflow from handling new requests and confirmations to communicating with travelers and tracking payments.',
      readTime: '12 min read'
    }
  ];

  moreGuides = [
    {
      category: 'Analytics',
      badgeBg: '#fef3c7',
      badgeColor: '#b45309',
      title: 'Understanding the Analytics Dashboard',
      description: 'A comprehensive walkthrough of your analytics dashboard, including key metrics, revenue tracking, and performance insights.'
    },
    {
      category: 'Payments',
      badgeBg: '#fce7f3',
      badgeColor: '#be185d',
      title: 'Setting Up Payment Processing',
      description: 'Configure payment methods, manage payouts, and understand transaction fees to keep your finances running smoothly.'
    },
    {
      category: 'Growth',
      badgeBg: '#ecfdf5',
      badgeColor: '#059669',
      title: 'Building Customer Trust',
      description: 'Proven strategies for earning verified status, collecting reviews, and building a loyal customer base on AirHoppers.'
    },
    {
      category: 'Marketing',
      badgeBg: '#eff6ff',
      badgeColor: '#2563eb',
      title: 'Marketing Your Packages',
      description: 'Tips and techniques for promoting your travel packages, leveraging social media, and increasing visibility on the platform.'
    },
    {
      category: 'Developer',
      badgeBg: '#f5f3ff',
      badgeColor: '#7c3aed',
      title: 'Working with the API',
      description: 'Get started with the AirHoppers API to integrate bookings, sync inventory, and automate your agency operations.'
    },
    {
      category: 'Operations',
      badgeBg: '#fff7ed',
      badgeColor: '#c2410c',
      title: 'Team Management Best Practices',
      description: 'Learn how to invite team members, assign roles and permissions, and collaborate effectively within your agency dashboard.'
    }
  ];
}
