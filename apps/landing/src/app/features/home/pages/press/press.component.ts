import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-press',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Press &amp; Media
          </div>
          <h1 class="hero-title">AirHoppers in the News</h1>
          <p class="hero-description">
            Discover the latest media coverage, press releases, and resources about AirHoppers. Get everything you need to tell our story.
          </p>
        </div>
      </div>
    </section>

    <!-- Press Highlights Section -->
    <section class="highlights-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Featured Coverage</p>
          <h2 class="section-title">Press Highlights</h2>
          <p class="section-description">See what leading publications are saying about AirHoppers and the future of travel.</p>
        </div>
        <div class="highlights-grid">
          <!-- TechCrunch -->
          <div class="highlight-card">
            <div class="highlight-publication">
              <div class="publication-icon techcrunch">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                </svg>
              </div>
              <span class="publication-name">TechCrunch</span>
            </div>
            <h3 class="highlight-headline">AirHoppers Raises $12M to Revolutionize How Travel Agencies Go Digital</h3>
            <p class="highlight-date">January 15, 2025</p>
            <a href="#" class="highlight-link">
              Read Article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Travel Weekly -->
          <div class="highlight-card">
            <div class="highlight-publication">
              <div class="publication-icon travelweekly">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="2" y1="12" x2="22" y2="12"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
              </div>
              <span class="publication-name">Travel Weekly</span>
            </div>
            <h3 class="highlight-headline">How AirHoppers Is Empowering Small Travel Agencies to Compete with Industry Giants</h3>
            <p class="highlight-date">December 8, 2024</p>
            <a href="#" class="highlight-link">
              Read Article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Forbes -->
          <div class="highlight-card">
            <div class="highlight-publication">
              <div class="publication-icon forbes">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <span class="publication-name">Forbes</span>
            </div>
            <h3 class="highlight-headline">The Top 10 Travel Tech Startups to Watch in 2025 — AirHoppers Leads the Pack</h3>
            <p class="highlight-date">November 22, 2024</p>
            <a href="#" class="highlight-link">
              Read Article
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Company Facts Section -->
    <section class="facts-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">At a Glance</p>
          <h2 class="section-title">Company Facts</h2>
          <p class="section-description">Key information about AirHoppers for your coverage.</p>
        </div>
        <div class="facts-grid">
          <div class="fact-card">
            <div class="fact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <p class="fact-label">Founded</p>
            <p class="fact-value">2022</p>
          </div>
          <div class="fact-card">
            <div class="fact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <p class="fact-label">Headquarters</p>
            <p class="fact-value">New York, NY</p>
          </div>
          <div class="fact-card">
            <div class="fact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <p class="fact-label">Team Size</p>
            <p class="fact-value">85+ employees</p>
          </div>
          <div class="fact-card">
            <div class="fact-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <p class="fact-label">Agencies Served</p>
            <p class="fact-value">2,500+</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Brand Assets Section -->
    <section class="brand-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Brand Resources</p>
          <h2 class="section-title">Brand Assets</h2>
          <p class="section-description">Download our official logos, brand guidelines, and media assets for your publications.</p>
        </div>
        <div class="brand-card">
          <div class="brand-card-content">
            <div class="brand-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
            </div>
            <h3 class="brand-card-title">AirHoppers Press Kit</h3>
            <p class="brand-card-description">
              Our press kit includes the AirHoppers logo in multiple formats (SVG, PNG, EPS), brand color palette, typography guidelines, product screenshots, and executive headshots. Please follow our brand guidelines when using these assets.
            </p>
            <button class="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Press Kit
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Press Contact Section -->
    <section class="contact-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Get in Touch</p>
          <h2 class="section-title">Press Contact</h2>
          <p class="section-description">For media inquiries, interview requests, or additional information.</p>
        </div>
        <div class="contact-card">
          <div class="contact-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <h3 class="contact-card-title">Media Inquiries</h3>
          <p class="contact-card-email">press&#64;airhoppers.com</p>
          <p class="contact-card-description">
            Our communications team typically responds within 24 hours on business days.
            For urgent requests, please include "URGENT" in your subject line.
          </p>
          <a href="mailto:press@airhoppers.com" class="contact-card-link">
            Send Email
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
          <h2>Want to Feature AirHoppers?</h2>
          <p>We'd love to work with you. Download our press kit for ready-to-use assets or reach out to our communications team for interviews, quotes, and more.</p>
          <div class="cta-buttons">
            <button class="btn btn-cta-white btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download Press Kit
            </button>
            <a href="mailto:press@airhoppers.com" class="btn btn-cta-outline btn-lg">Contact Press Team</a>
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
       PRESS HIGHLIGHTS
       ============================= */
    .highlights-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .highlights-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .highlight-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      transition: all var(--transition-normal);
    }

    .highlight-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .highlight-publication {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .publication-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .publication-icon.techcrunch {
      background: #f0fdf4;
      color: #22c55e;
    }

    .publication-icon.travelweekly {
      background: #eff6ff;
      color: #3b82f6;
    }

    .publication-icon.forbes {
      background: #f5f3ff;
      color: #8b5cf6;
    }

    .publication-name {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
    }

    .highlight-headline {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      line-height: 1.4;
      margin: 0 0 12px;
    }

    .highlight-date {
      font-size: var(--font-size-sm, 14px);
      color: var(--text-secondary);
      margin: 0 0 20px;
    }

    .highlight-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--primary);
      text-decoration: none;
      transition: gap var(--transition-normal);
    }

    .highlight-link:hover {
      gap: 10px;
    }

    /* =============================
       COMPANY FACTS
       ============================= */
    .facts-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .facts-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-lg);
    }

    .fact-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 28px;
      text-align: center;
      transition: all var(--transition-normal);
    }

    .fact-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .fact-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--coral-100, #fff1f2);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 16px;
    }

    .fact-label {
      font-size: var(--font-size-sm, 14px);
      color: var(--text-secondary);
      margin: 0 0 4px;
    }

    .fact-value {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold, 700);
      color: var(--text-primary);
      margin: 0;
    }

    /* =============================
       BRAND ASSETS
       ============================= */
    .brand-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .brand-card {
      max-width: 720px;
      margin: 0 auto;
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    }

    .brand-card-content {
      text-align: center;
    }

    .brand-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: var(--coral-100, #fff1f2);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .brand-card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 12px;
    }

    .brand-card-description {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0 0 24px;
      max-width: 560px;
      margin-left: auto;
      margin-right: auto;
    }

    /* =============================
       PRESS CONTACT
       ============================= */
    .contact-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .contact-card {
      max-width: 540px;
      margin: 0 auto;
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      text-align: center;
    }

    .contact-card-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: #eff6ff;
      color: #3b82f6;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .contact-card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .contact-card-email {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--primary);
      margin: 0 0 12px;
    }

    .contact-card-description {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0 0 24px;
    }

    .contact-card-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--primary);
      text-decoration: none;
      transition: gap var(--transition-normal);
    }

    .contact-card-link:hover {
      gap: 10px;
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
      max-width: 650px;
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

      .highlights-grid {
        grid-template-columns: 1fr;
        max-width: 480px;
        margin: 0 auto;
      }

      .facts-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .section-title {
        font-size: 28px;
      }

      .brand-card {
        padding: 32px 24px;
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

      .highlights-section,
      .facts-section,
      .brand-section,
      .contact-section,
      .cta-section {
        padding: 60px 0;
      }

      .section-title {
        font-size: 24px;
      }

      .facts-grid {
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-md);
      }

      .fact-card {
        padding: 20px;
      }

      .brand-card {
        padding: 24px 20px;
        border-radius: 12px;
      }

      .contact-card {
        padding: 24px 20px;
        border-radius: 12px;
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
export class PublicPressComponent {}
