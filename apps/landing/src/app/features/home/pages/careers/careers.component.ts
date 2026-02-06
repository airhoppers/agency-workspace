import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-careers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Join Our Team
          </div>
          <h1 class="hero-title">Build the Future of Travel Technology</h1>
          <p class="hero-description">
            At AirHoppers, we're on a mission to transform how travel agencies connect with the world. Join a passionate team of builders, dreamers, and innovators shaping the next generation of travel technology.
          </p>
        </div>
      </div>
    </section>

    <!-- Perks Section -->
    <section class="perks-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Why AirHoppers</p>
          <h2 class="section-title">Perks &amp; Benefits</h2>
          <p class="section-description">We believe great work happens when people feel supported, empowered, and valued.</p>
        </div>
        <div class="perks-grid">
          <!-- Remote-First -->
          <div class="perk-card">
            <div class="perk-icon blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
            </div>
            <h3 class="perk-title">Remote-First</h3>
            <p class="perk-description">Work from anywhere in the world. We're a distributed team that values results over location. Your home office, a co-working space, or a beach — you decide.</p>
          </div>

          <!-- Health & Wellness -->
          <div class="perk-card">
            <div class="perk-icon green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <h3 class="perk-title">Health &amp; Wellness</h3>
            <p class="perk-description">Comprehensive health, dental, and vision insurance for you and your family. Plus a monthly wellness stipend for gym, therapy, or whatever keeps you healthy.</p>
          </div>

          <!-- Growth Budget -->
          <div class="perk-card">
            <div class="perk-icon purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
              </svg>
            </div>
            <h3 class="perk-title">Growth Budget</h3>
            <p class="perk-description">$2,000 annual learning budget for courses, conferences, and books. We invest in your growth because your development is our development.</p>
          </div>

          <!-- Flexible Hours -->
          <div class="perk-card">
            <div class="perk-icon coral">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 class="perk-title">Flexible Hours</h3>
            <p class="perk-description">We trust you to manage your own schedule. Work when you're most productive with flexible hours and generous PTO — because balance matters.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Don't See Your Role?</h2>
          <p>We're always looking for talented people to join our team. Send us your resume and tell us how you'd like to contribute to AirHoppers.</p>
          <div class="cta-buttons">
            <a href="mailto:careers&#64;airhoppers.com" class="btn btn-cta-white btn-lg">
              Send General Application
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/support" class="btn btn-cta-outline btn-lg">Contact Us</a>
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
       PERKS SECTION
       ============================= */
    .perks-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .perks-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
    }

    .perk-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      transition: all var(--transition-normal);
    }

    .perk-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .perk-icon {
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
    }

    .perk-icon.blue {
      background: #eff6ff;
      color: #3b82f6;
    }

    .perk-icon.green {
      background: #f0fdf4;
      color: #22c55e;
    }

    .perk-icon.purple {
      background: #f5f3ff;
      color: #8b5cf6;
    }

    .perk-icon.coral {
      background: var(--coral-100, #fff1f2);
      color: var(--primary);
    }

    .perk-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 10px;
    }

    .perk-description {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
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
      line-height: 1.2;
    }

    .cta-content p {
      font-size: var(--font-size-lg);
      color: rgba(255, 255, 255, 0.9);
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

      .perks-grid {
        grid-template-columns: 1fr;
        max-width: 560px;
        margin: 0 auto;
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

      .perks-section,
      .cta-section {
        padding: 60px 0;
      }

      .section-title {
        font-size: 24px;
      }

      .perk-card {
        padding: 24px;
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
export class PublicCareersComponent {}
