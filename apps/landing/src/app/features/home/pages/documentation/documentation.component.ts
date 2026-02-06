import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-documentation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Documentation
          </div>
          <h1 class="hero-title">Learn How to Use AirHoppers</h1>
          <p class="hero-description">
            Comprehensive guides, tutorials, and API references to help you get the most out of the AirHoppers platform for your travel agency.
          </p>
        </div>
      </div>
    </section>

    <!-- Documentation Categories Section -->
    <section class="docs-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Browse by Topic</p>
          <h2 class="section-title">Documentation Categories</h2>
          <p class="section-description">Find everything you need organized by topic. Select a category to explore in-depth guides and tutorials.</p>
        </div>
        <div class="docs-grid">
          <!-- Getting Started -->
          <div class="doc-card">
            <div class="doc-card-icon blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 class="doc-card-title">Getting Started</h3>
            <p class="doc-card-desc">Setup guide, first steps, and account configuration to get your agency up and running quickly.</p>
            <a href="javascript:void(0)" class="doc-card-link">
              Explore
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Package Management -->
          <div class="doc-card">
            <div class="doc-card-icon green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
            </div>
            <h3 class="doc-card-title">Package Management</h3>
            <p class="doc-card-desc">Create, edit, and publish travel packages with detailed itineraries, pricing, and media uploads.</p>
            <a href="javascript:void(0)" class="doc-card-link">
              Explore
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Booking Management -->
          <div class="doc-card">
            <div class="doc-card-icon purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3 class="doc-card-title">Booking Management</h3>
            <p class="doc-card-desc">Handle bookings, process payments, manage refunds, and communicate with travelers effectively.</p>
            <a href="javascript:void(0)" class="doc-card-link">
              Explore
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Analytics & Reporting -->
          <div class="doc-card">
            <div class="doc-card-icon orange">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h3 class="doc-card-title">Analytics &amp; Reporting</h3>
            <p class="doc-card-desc">Track performance metrics, generate detailed reports, and gain insights to grow your business.</p>
            <a href="javascript:void(0)" class="doc-card-link">
              Explore
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- API Reference -->
          <div class="doc-card">
            <div class="doc-card-icon red">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <h3 class="doc-card-title">API Reference</h3>
            <p class="doc-card-desc">Explore endpoints, authentication methods, rate limits, and SDKs for seamless integrations.</p>
            <a href="javascript:void(0)" class="doc-card-link">
              Explore
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Account & Settings -->
          <div class="doc-card">
            <div class="doc-card-icon teal">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
            </div>
            <h3 class="doc-card-title">Account &amp; Settings</h3>
            <p class="doc-card-desc">Manage your profile, invite team members, configure billing, and customize your preferences.</p>
            <a href="javascript:void(0)" class="doc-card-link">
              Explore
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Popular Articles Section -->
    <section class="articles-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Quick Reads</p>
          <h2 class="section-title">Popular Articles</h2>
          <p class="section-description">The most-read guides and tutorials from our documentation.</p>
        </div>
        <div class="articles-list">
          <a href="javascript:void(0)" class="article-item">
            <div class="article-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="article-content">
              <h4 class="article-title">How to Create Your First Travel Package</h4>
              <p class="article-meta">Getting Started &middot; 8 min read</p>
            </div>
            <svg class="article-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="javascript:void(0)" class="article-item">
            <div class="article-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="article-content">
              <h4 class="article-title">Setting Up Agency Verification (KYC)</h4>
              <p class="article-meta">Account &amp; Settings &middot; 5 min read</p>
            </div>
            <svg class="article-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="javascript:void(0)" class="article-item">
            <div class="article-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="article-content">
              <h4 class="article-title">Understanding the Analytics Dashboard</h4>
              <p class="article-meta">Analytics &amp; Reporting &middot; 10 min read</p>
            </div>
            <svg class="article-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="javascript:void(0)" class="article-item">
            <div class="article-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="article-content">
              <h4 class="article-title">Processing Bookings and Managing Payments</h4>
              <p class="article-meta">Booking Management &middot; 12 min read</p>
            </div>
            <svg class="article-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="javascript:void(0)" class="article-item">
            <div class="article-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
            </div>
            <div class="article-content">
              <h4 class="article-title">Authenticating with the AirHoppers API</h4>
              <p class="article-meta">API Reference &middot; 6 min read</p>
            </div>
            <svg class="article-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Can't Find What You're Looking For?</h2>
          <p>Our support team and community are ready to help you find answers to any questions about the AirHoppers platform.</p>
          <div class="cta-buttons">
            <a routerLink="/support" class="btn btn-cta-white btn-lg">
              Contact Support
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="javascript:void(0)" class="btn btn-cta-outline btn-lg">Join Community</a>
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
      font-weight: var(--font-weight-bold);
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
       DOCUMENTATION CATEGORIES
       ============================= */
    .docs-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .docs-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .doc-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      transition: all var(--transition-normal);
    }

    .doc-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .doc-card-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .doc-card-icon.blue {
      background: #eff6ff;
      color: #3b82f6;
    }

    .doc-card-icon.green {
      background: #f0fdf4;
      color: #22c55e;
    }

    .doc-card-icon.purple {
      background: #f5f3ff;
      color: #8b5cf6;
    }

    .doc-card-icon.orange {
      background: #fff7ed;
      color: #f97316;
    }

    .doc-card-icon.red {
      background: #fef2f2;
      color: #ef4444;
    }

    .doc-card-icon.teal {
      background: #f0fdfa;
      color: #14b8a6;
    }

    .doc-card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .doc-card-desc {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 20px;
    }

    .doc-card-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--primary);
      text-decoration: none;
      transition: gap var(--transition-normal);
    }

    .doc-card-link:hover {
      gap: 10px;
    }

    /* =============================
       POPULAR ARTICLES
       ============================= */
    .articles-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .articles-list {
      max-width: 760px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .article-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 20px 24px;
      text-decoration: none;
      transition: all var(--transition-normal);
    }

    .article-item:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
      transform: translateY(-1px);
    }

    .article-item:hover .article-arrow {
      transform: translateX(4px);
    }

    .article-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      background: var(--coral-100, #fff1f2);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .article-content {
      flex: 1;
      min-width: 0;
    }

    .article-title {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 4px;
    }

    .article-meta {
      font-size: var(--font-size-sm, 13px);
      color: var(--text-secondary);
      margin: 0;
    }

    .article-arrow {
      color: var(--text-secondary);
      flex-shrink: 0;
      transition: transform var(--transition-normal);
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
      line-height: 1.2;
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
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    }

    .btn-cta-white:hover {
      background: #fff5f7;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
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

      .docs-grid {
        grid-template-columns: repeat(2, 1fr);
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

      .docs-section,
      .articles-section,
      .cta-section {
        padding: 60px 0;
      }

      .docs-grid {
        grid-template-columns: 1fr;
        max-width: 480px;
        margin: 0 auto;
      }

      .section-title {
        font-size: 24px;
      }

      .article-item {
        padding: 16px 20px;
      }

      .article-icon {
        display: none;
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
export class PublicDocumentationComponent {}
