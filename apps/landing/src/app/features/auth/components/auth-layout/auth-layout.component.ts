import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="auth-layout">
      <div class="auth-sidebar">
        <a routerLink="/" class="brand">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
          </div>
          <div class="brand-text">
            <h1>AirHoppers</h1>
            <p>Agency Management Portal</p>
          </div>
        </a>
        <a routerLink="/" class="back-to-home">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Home
        </a>

        <div class="hero-section">
          <h2>Welcome Back to Your Travel Dashboard</h2>
          <p class="hero-description">
            Manage your travel agencies, create amazing packages, and deliver unforgettable experiences to your customers.
          </p>
        </div>

        <div class="features">
          <div class="feature">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
                <line x1="8" y1="21" x2="16" y2="21"/>
                <line x1="12" y1="17" x2="12" y2="21"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3>Multi-Agency Management</h3>
              <p>Manage multiple travel agencies from a single dashboard with ease</p>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3>Package Creation</h3>
              <p>Design comprehensive travel packages with flights, hotels, and activities</p>
            </div>
          </div>

          <div class="feature">
            <div class="feature-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <div class="feature-content">
              <h3>Analytics & Insights</h3>
              <p>Track performance metrics and make data-driven decisions</p>
            </div>
          </div>
        </div>

        <div class="stats">
          <div class="stat">
            <span class="stat-value">2,500+</span>
            <span class="stat-label">Active Agencies</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">50K+</span>
            <span class="stat-label">Travel Packages</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-value">98%</span>
            <span class="stat-label">Satisfaction Rate</span>
          </div>
        </div>
      </div>

      <div class="auth-content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    .auth-layout {
      display: flex;
      min-height: 100vh;
    }

    .auth-sidebar {
      width: 50%;
      max-width: 640px;
      min-width: 480px;
      background: linear-gradient(180deg, #FF9370 0%, #FF4E78 50%, #e6335a 100%);
      padding: 48px;
      display: flex;
      flex-direction: column;
      color: white;

      @media (max-width: 1024px) {
        display: none;
      }
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      text-decoration: none;
      color: white;

      .logo {
        width: 48px;
        height: 48px;
        background-color: rgba(255, 255, 255, 0.25);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .brand-text {
        h1 {
          font-size: 20px;
          font-weight: 700;
          margin: 0;
          line-height: 1.2;
          color: white;
        }

        p {
          font-size: 14px;
          opacity: 0.9;
          margin: 0;
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }

    .back-to-home {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 64px;
      transition: color 0.2s ease;
    }

    .back-to-home:hover {
      color: white;
    }

    .hero-section {
      margin-bottom: 48px;

      h2 {
        font-size: 36px;
        font-weight: 700;
        line-height: 1.2;
        margin: 0 0 16px 0;
        max-width: 400px;
        color: white;
      }

      .hero-description {
        font-size: 16px;
        line-height: 1.6;
        margin: 0;
        max-width: 480px;
        color: rgba(255, 255, 255, 0.9);
      }
    }

    .features {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .feature {
      display: flex;
      gap: 16px;
      align-items: flex-start;
    }

    .feature-icon {
      width: 44px;
      height: 44px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .feature-content {
      h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 4px 0;
        color: white;
      }

      p {
        font-size: 14px;
        margin: 0;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.85);
      }
    }

    .stats {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-top: 48px;
      padding-top: 32px;
    }

    .stat {
      display: flex;
      flex-direction: column;

      .stat-value {
        font-size: 28px;
        font-weight: 700;
        line-height: 1;
        color: white;
      }

      .stat-label {
        font-size: 13px;
        margin-top: 4px;
        color: rgba(255, 255, 255, 0.85);
      }
    }

    .stat-divider {
      width: 1px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.3);
    }

    .auth-content {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px;
      background-color: #f8f9fa;
    }
  `]
})
export class AuthLayoutComponent {}
