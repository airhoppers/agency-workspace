import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-features',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Platform Features
          </div>
          <h1 class="hero-title">Everything You Need to Grow Your Travel Business</h1>
          <p class="hero-description">
            Comprehensive tools and powerful features designed to help travel agencies manage packages, streamline bookings, and scale their operations effortlessly.
          </p>
        </div>
      </div>
    </section>

    <!-- Features Grid Section -->
    <section class="features-grid-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Core Features</p>
          <h2 class="section-title">Powerful Tools for Modern Travel Agencies</h2>
          <p class="section-description">Everything you need to create, manage, and grow your travel business from a single platform.</p>
        </div>
        <div class="features-grid">
          <!-- Package Management -->
          <div class="feature-card">
            <div class="feature-icon coral">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <h3 class="feature-card-title">Package Management</h3>
            <p class="feature-card-desc">Create and manage stunning travel packages with rich media, detailed itineraries, dynamic pricing, and real-time availability updates.</p>
          </div>

          <!-- Booking System -->
          <div class="feature-card">
            <div class="feature-icon blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3 class="feature-card-title">Booking System</h3>
            <p class="feature-card-desc">Streamlined booking management with automated confirmations, real-time notifications, traveler communication, and calendar sync.</p>
          </div>

          <!-- Analytics Dashboard -->
          <div class="feature-card">
            <div class="feature-icon green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h3 class="feature-card-title">Analytics Dashboard</h3>
            <p class="feature-card-desc">Track performance with detailed insights into bookings, revenue, customer behavior, and market trends to make data-driven decisions.</p>
          </div>

          <!-- Verified Trust -->
          <div class="feature-card">
            <div class="feature-icon purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 class="feature-card-title">Verified Trust</h3>
            <p class="feature-card-desc">Build credibility with our verified agency badge powered by KYC verification. Gain traveler trust and stand out from the competition.</p>
          </div>

          <!-- Payment Processing -->
          <div class="feature-card">
            <div class="feature-icon amber">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h3 class="feature-card-title">Payment Processing</h3>
            <p class="feature-card-desc">Secure payment processing with support for multiple currencies, automated invoicing, split payments, and seamless refund management.</p>
          </div>

          <!-- Multi-Channel Distribution -->
          <div class="feature-card">
            <div class="feature-icon teal">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3 class="feature-card-title">Multi-Channel Distribution</h3>
            <p class="feature-card-desc">Reach travelers everywhere by distributing your packages across multiple channels, social platforms, and partner networks from one place.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Detailed Features Section -->
    <section class="detailed-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">In Depth</p>
          <h2 class="section-title">Built for the Way You Work</h2>
          <p class="section-description">Discover how each feature is designed to save you time and help your agency thrive.</p>
        </div>

        <!-- Feature Detail 1 -->
        <div class="feature-detail">
          <div class="feature-detail-image">
            <div class="image-placeholder">
              <div class="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <span class="placeholder-label">Package Management</span>
            </div>
          </div>
          <div class="feature-detail-content">
            <h3 class="detail-title">Create Packages That Sell</h3>
            <p class="detail-description">Build beautiful, detailed travel packages with our intuitive editor. Add rich descriptions, high-quality images, day-by-day itineraries, and flexible pricing options that convert browsers into buyers.</p>
            <ul class="detail-list">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Drag-and-drop itinerary builder</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Multi-image gallery with captions</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Dynamic pricing and seasonal rates</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Real-time availability management</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Feature Detail 2 -->
        <div class="feature-detail reverse">
          <div class="feature-detail-image">
            <div class="image-placeholder">
              <div class="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <span class="placeholder-label">Analytics Dashboard</span>
            </div>
          </div>
          <div class="feature-detail-content">
            <h3 class="detail-title">Data-Driven Growth</h3>
            <p class="detail-description">Understand your business at a glance with our comprehensive analytics dashboard. Track key metrics, identify trends, and make informed decisions that drive revenue growth.</p>
            <ul class="detail-list">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Real-time booking and revenue tracking</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Customer behavior insights</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Package performance comparisons</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Exportable reports and forecasts</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Feature Detail 3 -->
        <div class="feature-detail">
          <div class="feature-detail-image">
            <div class="image-placeholder">
              <div class="placeholder-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span class="placeholder-label">Trust &amp; Security</span>
            </div>
          </div>
          <div class="feature-detail-content">
            <h3 class="detail-title">Built-In Trust &amp; Security</h3>
            <p class="detail-description">Earn traveler confidence with our comprehensive verification system and secure payment infrastructure. Every transaction is protected, and verified agencies see higher conversion rates.</p>
            <ul class="detail-list">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>KYC-powered agency verification</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>PCI-compliant payment processing</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Verified badge on your profile</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Traveler review and rating system</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Get Started?</h2>
          <p>Join thousands of travel agencies already using AirHoppers to publish packages, manage bookings, and grow their revenue.</p>
          <div class="cta-buttons">
            <a routerLink="/auth/signup" class="btn btn-cta-white btn-lg">
              Sign Up Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/pricing" class="btn btn-cta-outline btn-lg">View Pricing</a>
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

    .btn-primary {
      background: var(--primary);
      color: white;
    }

    .btn-primary:hover {
      background: var(--coral-700);
    }

    .btn-outline {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text-primary);
    }

    .btn-outline:hover {
      background: var(--bg-secondary);
    }

    .btn-lg {
      padding: 14px 28px;
      font-size: var(--font-size-lg);
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
      max-width: 720px;
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
      line-height: 1.15;
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
       FEATURES GRID SECTION
       ============================= */
    .features-grid-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .feature-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      transition: all var(--transition-normal);
    }

    .feature-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .feature-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .feature-icon.coral {
      background: var(--coral-100, #fff1f2);
      color: var(--primary);
    }

    .feature-icon.blue {
      background: #eff6ff;
      color: #3b82f6;
    }

    .feature-icon.green {
      background: #f0fdf4;
      color: #22c55e;
    }

    .feature-icon.purple {
      background: #f5f3ff;
      color: #8b5cf6;
    }

    .feature-icon.amber {
      background: #fffbeb;
      color: #f59e0b;
    }

    .feature-icon.teal {
      background: #f0fdfa;
      color: #14b8a6;
    }

    .feature-card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .feature-card-desc {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    /* =============================
       DETAILED FEATURES SECTION
       ============================= */
    .detailed-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .feature-detail {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      margin-bottom: 80px;
    }

    .feature-detail:last-child {
      margin-bottom: 0;
    }

    .feature-detail.reverse {
      direction: rtl;
    }

    .feature-detail.reverse > * {
      direction: ltr;
    }

    .feature-detail-image {
      width: 100%;
    }

    .image-placeholder {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 60px 40px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      min-height: 320px;
    }

    .placeholder-icon {
      width: 80px;
      height: 80px;
      border-radius: 20px;
      background: var(--coral-100, #fff1f2);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .placeholder-label {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    .feature-detail-content {
      width: 100%;
    }

    .detail-title {
      font-size: 28px;
      font-weight: 700;
      color: var(--text-primary);
      margin: 0 0 16px;
    }

    .detail-description {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0 0 24px;
    }

    .detail-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .detail-list li {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }

    .detail-list li svg {
      flex-shrink: 0;
    }

    /* =============================
       CTA SECTION
       ============================= */
    .cta-section {
      padding: 80px 0;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
    }

    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
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

      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .feature-detail {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .feature-detail.reverse {
        direction: ltr;
      }

      .section-title {
        font-size: 28px;
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

      .features-grid-section,
      .detailed-section,
      .cta-section {
        padding: 60px 0;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .section-title {
        font-size: 24px;
      }

      .detail-title {
        font-size: 24px;
      }

      .feature-detail {
        gap: 32px;
        margin-bottom: 60px;
      }

      .image-placeholder {
        min-height: 240px;
        padding: 40px 24px;
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
export class PublicFeaturesComponent {}
