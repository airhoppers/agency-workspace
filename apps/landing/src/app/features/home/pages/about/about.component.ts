import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-about',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Our Story
          </div>
          <h1 class="hero-title">Empowering Travel Agencies Worldwide</h1>
          <p class="hero-description">
            AirHoppers is on a mission to revolutionize how travel agencies operate, connect, and grow. We provide the tools, technology, and trust that agencies need to thrive in a digital-first world.
          </p>
        </div>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="mission-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Our Mission</p>
          <h2 class="section-title">Helping Travel Agencies Thrive in the Digital Age</h2>
        </div>
        <div class="mission-content">
          <p>
            At AirHoppers, we believe that every travel agency — whether a boutique startup or a seasoned enterprise — deserves access to world-class technology. Our platform was built from the ground up to eliminate the friction of managing packages, bookings, and payments, so agencies can focus on what they do best: creating unforgettable travel experiences.
          </p>
          <p>
            We combine cutting-edge technology with deep industry expertise to deliver a platform that is intuitive, powerful, and secure. From automated verification to real-time booking management, every feature is designed to save you time and help you grow your revenue.
          </p>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-number">10,000+</span>
            <span class="stat-label">Agencies</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">50+</span>
            <span class="stat-label">Countries</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">1M+</span>
            <span class="stat-label">Bookings</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">99.9%</span>
            <span class="stat-label">Uptime</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">What We Stand For</p>
          <h2 class="section-title">Our Core Values</h2>
          <p class="section-description">The principles that guide everything we build and every decision we make.</p>
        </div>
        <div class="values-grid">
          <!-- Innovation -->
          <div class="value-card">
            <div class="value-icon blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
              </svg>
            </div>
            <h3 class="value-title">Innovation</h3>
            <p class="value-description">We continuously push the boundaries of travel technology, delivering smart solutions that keep our agencies ahead of the curve and ready for what's next.</p>
          </div>
          <!-- Trust -->
          <div class="value-card">
            <div class="value-icon green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3 class="value-title">Trust</h3>
            <p class="value-description">Security and transparency are at the heart of our platform. From verified agency profiles to secure payments, we build trust at every touchpoint.</p>
          </div>
          <!-- Community -->
          <div class="value-card">
            <div class="value-icon purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 class="value-title">Community</h3>
            <p class="value-description">We are more than a platform — we are a global community of travel professionals who support, inspire, and grow together.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">The People Behind AirHoppers</p>
          <h2 class="section-title">Meet Our Team</h2>
          <p class="section-description">A passionate team of travel enthusiasts and technologists dedicated to transforming the travel industry.</p>
        </div>
        <div class="team-grid">
          <div class="team-card">
            <div class="team-avatar">
              <span class="avatar-initials">AR</span>
            </div>
            <h4 class="team-name">Alex Rodriguez</h4>
            <p class="team-role">Co-Founder & CEO</p>
          </div>
          <div class="team-card">
            <div class="team-avatar">
              <span class="avatar-initials">SL</span>
            </div>
            <h4 class="team-name">Sarah Lin</h4>
            <p class="team-role">Co-Founder & CTO</p>
          </div>
          <div class="team-card">
            <div class="team-avatar">
              <span class="avatar-initials">MK</span>
            </div>
            <h4 class="team-name">Marcus Kim</h4>
            <p class="team-role">Head of Product</p>
          </div>
          <div class="team-card">
            <div class="team-avatar">
              <span class="avatar-initials">EP</span>
            </div>
            <h4 class="team-name">Elena Petrova</h4>
            <p class="team-role">Head of Partnerships</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Join Our Growing Community</h2>
          <p>Become part of a worldwide network of travel agencies that are building the future of travel together.</p>
          <div class="cta-buttons">
            <a routerLink="/auth/signup" class="btn btn-cta-white btn-lg">
              Create Agency Account
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
       MISSION SECTION
       ============================= */
    .mission-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .mission-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .mission-content p {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      line-height: 1.8;
      margin: 0 0 var(--spacing-lg);
    }

    .mission-content p:last-child {
      margin-bottom: 0;
    }

    /* =============================
       STATS SECTION
       ============================= */
    .stats-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-lg);
    }

    .stat-card {
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      transition: all var(--transition-normal);
    }

    .stat-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .stat-number {
      display: block;
      font-size: 36px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: var(--spacing-sm);
      line-height: 1.2;
    }

    .stat-label {
      display: block;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
    }

    /* =============================
       VALUES SECTION
       ============================= */
    .values-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .values-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .value-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      transition: all var(--transition-normal);
    }

    .value-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .value-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .value-icon.blue {
      background: #eff6ff;
      color: #3b82f6;
    }

    .value-icon.green {
      background: #f0fdf4;
      color: #22c55e;
    }

    .value-icon.purple {
      background: #f5f3ff;
      color: #8b5cf6;
    }

    .value-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 12px;
    }

    .value-description {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
    }

    /* =============================
       TEAM SECTION
       ============================= */
    .team-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .team-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--spacing-lg);
    }

    .team-card {
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      transition: all var(--transition-normal);
    }

    .team-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .team-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--coral-50) 0%, var(--coral-100) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
      border: 2px solid var(--border);
    }

    .avatar-initials {
      font-size: 22px;
      font-weight: 700;
      color: var(--primary);
      letter-spacing: 1px;
    }

    .team-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 6px;
    }

    .team-role {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
    }

    /* =============================
       CTA SECTION
       ============================= */
    .cta-section {
      padding: 100px 0;
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
      max-width: 700px;
      margin: 0 auto;
      position: relative;
      z-index: 1;
    }

    .cta-content h2 {
      font-size: 42px;
      font-weight: 700;
      color: white;
      margin: 0 0 var(--spacing-md);
      line-height: 1.2;
    }

    .cta-content p {
      font-size: var(--font-size-xl);
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
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
    }

    .btn-cta-white:hover {
      background: #fff5f7;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .btn-cta-outline {
      background: transparent;
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.4);
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-lg);
    }

    .btn-cta-outline:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(255, 255, 255, 0.6);
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

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .values-grid {
        grid-template-columns: 1fr;
        max-width: 480px;
        margin: 0 auto;
      }

      .team-grid {
        grid-template-columns: repeat(2, 1fr);
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

      .mission-section,
      .stats-section,
      .values-section,
      .team-section,
      .cta-section {
        padding: 60px 0;
      }

      .section-title {
        font-size: 24px;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: var(--spacing-md);
      }

      .stat-number {
        font-size: 28px;
      }

      .stat-card {
        padding: 24px;
      }

      .values-grid {
        grid-template-columns: 1fr;
        max-width: 480px;
        margin: 0 auto;
      }

      .team-grid {
        grid-template-columns: 1fr;
        max-width: 360px;
        margin: 0 auto;
      }

      .cta-content h2 {
        font-size: 28px;
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
export class PublicAboutComponent {}
