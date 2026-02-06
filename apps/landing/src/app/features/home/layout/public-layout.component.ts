import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Header -->
    <header class="header">
      <div class="header-container">
        <div class="header-left">
          <a routerLink="/" class="logo">
            <div class="logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <span class="logo-text">AirHoppers</span>
          </a>
          <nav class="nav">
            <a routerLink="/" class="nav-link" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
            <a routerLink="/pricing" class="nav-link" routerLinkActive="active">Pricing</a>
            <a routerLink="/support" class="nav-link" routerLinkActive="active">Support</a>
          </nav>
        </div>
        <div class="header-right">
          <a routerLink="/auth/login" class="btn btn-outline">Sign In</a>
          <a routerLink="/auth/signup" class="btn btn-primary">Create Agency Account</a>
        </div>
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            @if (mobileMenuOpen()) {
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            } @else {
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            }
          </svg>
        </button>
      </div>
      <!-- Mobile Menu -->
      @if (mobileMenuOpen()) {
        <div class="mobile-menu active">
          <nav class="mobile-nav">
            <a routerLink="/" class="mobile-nav-link" (click)="closeMobileMenu()">Home</a>
            <a routerLink="/pricing" class="mobile-nav-link" (click)="closeMobileMenu()">Pricing</a>
            <a routerLink="/support" class="mobile-nav-link" (click)="closeMobileMenu()">Support</a>
            <div class="mobile-nav-buttons">
              <a routerLink="/auth/login" class="btn btn-outline btn-full" (click)="closeMobileMenu()">Sign In</a>
              <a routerLink="/auth/signup" class="btn btn-primary btn-full" (click)="closeMobileMenu()">Create Agency Account</a>
            </div>
          </nav>
        </div>
      }
    </header>

    <!-- Page Content -->
    <main>
      <router-outlet></router-outlet>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-main">
          <div class="footer-brand">
            <a routerLink="/" class="footer-logo">
              <div class="footer-logo-icon">A</div>
              <span class="footer-logo-text">AirHoppers</span>
            </a>
            <p class="footer-description">The leading platform for travel agencies to publish packages, manage bookings, and grow their business with verified trust.</p>
            <div class="social-links">
              <a href="#" class="social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="#" class="social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
          <div class="footer-links">
            <div class="footer-column">
              <h4>Product</h4>
              <ul>
                <li><a routerLink="/features">Features</a></li>
                <li><a routerLink="/pricing">Pricing</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a routerLink="/documentation">Documentation</a></li>
                <li><a routerLink="/guides">Guides</a></li>
                <li><a routerLink="/blog">Blog</a></li>
                <li><a routerLink="/support">Support</a></li>
              </ul>
            </div>
            <div class="footer-column">
              <h4>Company</h4>
              <ul>
                <li><a routerLink="/about">About Us</a></li>
                <li><a routerLink="/careers">Careers</a></li>
                <li><a routerLink="/press">Press</a></li>
                <li><a routerLink="/contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p class="copyright">&copy; {{ currentYear }} AirHoppers. All rights reserved.</p>
          <div class="footer-legal">
            <a routerLink="/privacy-policy">Privacy Policy</a>
            <a routerLink="/terms-of-service">Terms of Service</a>
            <a routerLink="/cookie-policy">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
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

    /* Buttons */
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
      color: var(--primary-foreground);
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

    .btn-full {
      width: 100%;
    }

    /* Header */
    .header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border);
      z-index: 1000;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 var(--spacing-lg);
      height: 64px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 40px;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      text-decoration: none;
      color: var(--text-primary);
    }

    .logo-icon {
      width: 32px;
      height: 32px;
      background: var(--primary);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .logo-text {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
    }

    .nav {
      display: flex;
      align-items: center;
      gap: var(--spacing-xl);
    }

    .nav-link {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      transition: color var(--transition-normal);
      padding: 4px 0;
      border-bottom: 2px solid transparent;
    }

    .nav-link:hover {
      color: var(--text-primary);
    }

    .nav-link.active {
      color: var(--primary);
      border-bottom-color: var(--primary);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .mobile-menu-btn {
      display: none;
      background: none;
      border: none;
      padding: var(--spacing-sm);
      cursor: pointer;
      color: var(--text-primary);
    }

    .mobile-menu {
      position: absolute;
      top: 64px;
      left: 0;
      right: 0;
      background: var(--bg-primary);
      border-bottom: 1px solid var(--border);
      padding: var(--spacing-md) var(--spacing-lg);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .mobile-nav-link {
      color: var(--text-primary);
      text-decoration: none;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-medium);
      padding: var(--spacing-sm) 0;
    }

    .mobile-nav-buttons {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border);
    }

    /* Footer */
    .footer {
      background: #0f172a;
      padding: 60px 0 0;
    }

    .footer-main {
      display: grid;
      grid-template-columns: 1.2fr 2fr;
      gap: 80px;
      padding-bottom: 48px;
    }

    .footer-logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      text-decoration: none;
      margin-bottom: var(--spacing-lg);
    }

    .footer-logo-icon {
      width: 40px;
      height: 40px;
      background: var(--primary);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
    }

    .footer-logo-text {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: white;
    }

    .footer-description {
      font-size: var(--font-size-base);
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.7;
      margin: 0 0 var(--spacing-xl);
      max-width: 400px;
    }

    .social-links {
      display: flex;
      gap: var(--spacing-sm);
    }

    .social-link {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      background: rgba(255, 255, 255, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: all var(--transition-normal);
    }

    .social-link:hover {
      background: rgba(255, 255, 255, 0.15);
      color: white;
    }

    .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-xl);
    }

    .footer-column h4 {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: white;
      margin: 0 0 var(--spacing-lg);
    }

    .footer-column ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .footer-column li {
      margin-bottom: var(--spacing-md);
    }

    .footer-column a {
      font-size: var(--font-size-base);
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color var(--transition-normal);
    }

    .footer-column a:hover {
      color: white;
    }

    .footer-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-lg) 0;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-bottom .copyright {
      font-size: var(--font-size-sm);
      color: rgba(255, 255, 255, 0.5);
      margin: 0;
    }

    .footer-legal {
      display: flex;
      gap: var(--spacing-xl);
    }

    .footer-legal a {
      font-size: var(--font-size-sm);
      color: rgba(255, 255, 255, 0.5);
      text-decoration: none;
      transition: color var(--transition-normal);
    }

    .footer-legal a:hover {
      color: white;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .nav {
        display: none;
      }

      .header-right {
        display: none;
      }

      .mobile-menu-btn {
        display: block;
      }

      .footer-main {
        grid-template-columns: 1fr;
        gap: 40px;
      }
    }

    @media (max-width: 768px) {
      .footer-links {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .footer-bottom {
        flex-direction: column;
        gap: var(--spacing-md);
        text-align: center;
      }

      .footer-legal {
        gap: var(--spacing-md);
      }
    }
  `]
})
export class PublicLayoutComponent {
  mobileMenuOpen = signal(false);
  currentYear = new Date().getFullYear();

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
