import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-pricing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Simple &amp; Transparent
          </div>
          <h1 class="hero-title">Choose the Right Plan for Your Agency</h1>
          <p class="hero-description">
            Flexible pricing plans designed to scale with your travel business. Start free and upgrade as you grow — no hidden fees, no surprises.
          </p>
        </div>
      </div>
    </section>

    <!-- Billing Toggle -->
    <section class="billing-toggle-section">
      <div class="container">
        <div class="billing-toggle-wrapper">
          <span class="toggle-label" [class.active]="!isAnnual()">Monthly</span>
          <button class="toggle-switch" (click)="toggleBilling()" [class.active]="isAnnual()" aria-label="Toggle annual billing">
            <span class="toggle-knob"></span>
          </button>
          <span class="toggle-label" [class.active]="isAnnual()">
            Annual
            <span class="save-badge">Save 20%</span>
          </span>
        </div>
      </div>
    </section>

    <!-- Pricing Cards -->
    <section class="pricing-cards-section">
      <div class="container">
        <div class="pricing-grid">
          <!-- Starter Plan -->
          <div class="pricing-card">
            <div class="card-header">
              <h3 class="plan-name">Starter</h3>
              <p class="plan-tagline">For new agencies getting started</p>
            </div>
            <div class="card-price">
              <span class="price-amount">Free</span>
              <span class="price-period">forever</span>
            </div>
            <a routerLink="/auth/signup" class="btn btn-outline btn-full btn-lg">Get Started Free</a>
            <div class="card-divider"></div>
            <ul class="feature-checklist">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>1 agency profile</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>5 travel packages</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Basic analytics</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Email support</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Standard verification</span>
              </li>
            </ul>
          </div>

          <!-- Professional Plan -->
          <div class="pricing-card highlighted">
            <div class="popular-badge">Most Popular</div>
            <div class="card-header">
              <h3 class="plan-name">Professional</h3>
              <p class="plan-tagline">For growing travel agencies</p>
            </div>
            <div class="card-price">
              <span class="price-currency">$</span>
              <span class="price-amount">{{ isAnnual() ? '39' : '49' }}</span>
              <span class="price-period">/month</span>
            </div>
            @if (isAnnual()) {
              <p class="billed-note">Billed annually at $468/year</p>
            }
            <a routerLink="/auth/signup" class="btn btn-primary btn-full btn-lg">Start Free Trial</a>
            <div class="card-divider"></div>
            <ul class="feature-checklist">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>3 agency profiles</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Unlimited packages</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Advanced analytics</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Priority support</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Verified badge</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>API access</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Custom branding</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Booking management</span>
              </li>
            </ul>
          </div>

          <!-- Enterprise Plan -->
          <div class="pricing-card">
            <div class="card-header">
              <h3 class="plan-name">Enterprise</h3>
              <p class="plan-tagline">For established agencies</p>
            </div>
            <div class="card-price">
              <span class="price-currency">$</span>
              <span class="price-amount">{{ isAnnual() ? '119' : '149' }}</span>
              <span class="price-period">/month</span>
            </div>
            @if (isAnnual()) {
              <p class="billed-note">Billed annually at $1,428/year</p>
            }
            <a href="#" class="btn btn-outline btn-full btn-lg">Contact Sales</a>
            <div class="card-divider"></div>
            <ul class="feature-checklist">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Unlimited agencies</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Unlimited packages</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Enterprise analytics</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>24/7 dedicated support</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Premium verification</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Full API access</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>White-label solution</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Custom integrations</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>SLA guarantee</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Dedicated account manager</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Feature Comparison Section -->
    <section class="comparison-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Detailed Breakdown</p>
          <h2 class="section-title">Compare Plan Features</h2>
          <p class="section-description">See exactly what each plan includes so you can make the best decision for your agency.</p>
        </div>
        <div class="table-wrapper">
          <table class="comparison-table">
            <thead>
              <tr>
                <th class="feature-col">Features</th>
                <th class="plan-col">Starter</th>
                <th class="plan-col highlight-col">Professional</th>
                <th class="plan-col">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <!-- Core Features -->
              <tr class="category-row">
                <td colspan="4">Core Features</td>
              </tr>
              <tr>
                <td class="feature-name">Agency profiles</td>
                <td class="plan-value">1</td>
                <td class="plan-value highlight-col">3</td>
                <td class="plan-value">Unlimited</td>
              </tr>
              <tr>
                <td class="feature-name">Travel packages</td>
                <td class="plan-value">5</td>
                <td class="plan-value highlight-col">Unlimited</td>
                <td class="plan-value">Unlimited</td>
              </tr>
              <tr>
                <td class="feature-name">Image uploads</td>
                <td class="plan-value">10 per package</td>
                <td class="plan-value highlight-col">50 per package</td>
                <td class="plan-value">Unlimited</td>
              </tr>
              <tr>
                <td class="feature-name">Booking management</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>

              <!-- Analytics -->
              <tr class="category-row">
                <td colspan="4">Analytics</td>
              </tr>
              <tr>
                <td class="feature-name">Basic dashboard</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="feature-name">Advanced reports</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="feature-name">Revenue analytics</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="feature-name">Custom reports</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>

              <!-- Support -->
              <tr class="category-row">
                <td colspan="4">Support</td>
              </tr>
              <tr>
                <td class="feature-name">Email support</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="feature-name">Priority support</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="feature-name">Phone support</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="feature-name">Dedicated manager</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>

              <!-- Platform -->
              <tr class="category-row">
                <td colspan="4">Platform</td>
              </tr>
              <tr>
                <td class="feature-name">API access</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="feature-name">Custom branding</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="feature-name">White-label</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
              <tr>
                <td class="feature-name">Custom integrations</td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value highlight-col">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" stroke="#d1d5db" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                </td>
                <td class="plan-value">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                    <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Help Center</p>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-description">Everything you need to know about our pricing and plans.</p>
        </div>
        <div class="faq-list">
          @for (faq of faqs; track faq.question; let i = $index) {
            <div class="faq-item" [class.open]="openFaq() === i">
              <button class="faq-question" (click)="toggleFaq(i)">
                <span>{{ faq.question }}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="faq-icon">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <div class="faq-answer">
                <p>{{ faq.answer }}</p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Ready to Grow Your Travel Business?</h2>
          <p>Join thousands of travel agencies already using AirHoppers to publish packages, manage bookings, and grow their revenue.</p>
          <div class="cta-buttons">
            <a routerLink="/auth/signup" class="btn btn-cta-white btn-lg">
              Start Free Trial
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#" class="btn btn-cta-outline btn-lg">Contact Sales</a>
          </div>
          <div class="cta-features">
            <div class="cta-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.3)"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>14-day free trial</span>
            </div>
            <div class="cta-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.3)"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>No credit card required</span>
            </div>
            <div class="cta-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.3)"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Cancel anytime</span>
            </div>
            <div class="cta-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.3)"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>24/7 support</span>
            </div>
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

    /* ========================================
       Buttons
       ======================================== */
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

    .btn-full {
      width: 100%;
    }

    /* ========================================
       Section Shared Styles
       ======================================== */
    .section-header {
      text-align: center;
      margin-bottom: var(--spacing-2xl);
    }

    .section-tag {
      display: inline-block;
      background: var(--coral-100);
      color: var(--primary);
      padding: var(--spacing-xs) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
      margin-bottom: var(--spacing-md);
    }

    .section-title {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-md);
    }

    .section-description {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto;
    }

    /* ========================================
       Hero Section
       ======================================== */
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

    /* ========================================
       Billing Toggle
       ======================================== */
    .billing-toggle-section {
      padding: 40px 0 0;
      background: white;
    }

    .billing-toggle-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-md);
    }

    .toggle-label {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      transition: color var(--transition-normal);
    }

    .toggle-label.active {
      color: var(--text-primary);
      font-weight: var(--font-weight-semibold);
    }

    .save-badge {
      display: inline-block;
      background: var(--coral-100);
      color: var(--primary);
      padding: 2px 10px;
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-weight: var(--font-weight-semibold);
    }

    .toggle-switch {
      position: relative;
      width: 52px;
      height: 28px;
      background: var(--border);
      border-radius: 14px;
      border: none;
      cursor: pointer;
      transition: background var(--transition-normal);
      padding: 0;
      flex-shrink: 0;
    }

    .toggle-switch.active {
      background: var(--primary);
    }

    .toggle-knob {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      background: white;
      border-radius: 50%;
      transition: transform var(--transition-normal);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
    }

    .toggle-switch.active .toggle-knob {
      transform: translateX(24px);
    }

    /* ========================================
       Pricing Cards
       ======================================== */
    .pricing-cards-section {
      padding: 40px 0 80px;
      background: white;
    }

    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
      align-items: start;
    }

    .pricing-card {
      background: var(--bg-primary);
      border: 1px solid var(--border);
      border-radius: var(--radius-xl);
      padding: 32px;
      position: relative;
      transition: box-shadow var(--transition-normal);
    }

    .pricing-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
    }

    .pricing-card.highlighted {
      border: 2px solid var(--primary);
      box-shadow: 0 8px 30px rgba(255, 78, 120, 0.12);
      padding: 40px 32px 32px;
    }

    .pricing-card.highlighted:hover {
      box-shadow: 0 12px 40px rgba(255, 78, 120, 0.18);
    }

    .popular-badge {
      position: absolute;
      top: -1px;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      background: var(--primary);
      color: white;
      padding: 6px 20px;
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      white-space: nowrap;
    }

    .card-header {
      margin-bottom: var(--spacing-lg);
    }

    .plan-name {
      font-size: 22px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-xs);
    }

    .plan-tagline {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
    }

    .card-price {
      display: flex;
      align-items: baseline;
      gap: 2px;
      margin-bottom: var(--spacing-sm);
    }

    .price-currency {
      font-size: 24px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      line-height: 1;
    }

    .price-amount {
      font-size: 48px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      line-height: 1;
    }

    .price-period {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin-left: 4px;
    }

    .billed-note {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-md);
    }

    .card-divider {
      height: 1px;
      background: var(--border);
      margin: var(--spacing-lg) 0;
    }

    .feature-checklist {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .feature-checklist li {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }

    .feature-checklist li svg {
      flex-shrink: 0;
    }

    /* ========================================
       Feature Comparison Section
       ======================================== */
    .comparison-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .table-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border-radius: var(--radius-lg);
      border: 1px solid var(--border);
      background: var(--bg-primary);
    }

    .comparison-table {
      width: 100%;
      border-collapse: collapse;
      min-width: 640px;
    }

    .comparison-table thead {
      position: sticky;
      top: 0;
      z-index: 2;
    }

    .comparison-table thead tr {
      background: var(--bg-primary);
      border-bottom: 2px solid var(--border);
    }

    .comparison-table th {
      padding: 20px var(--spacing-lg);
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      text-align: center;
      white-space: nowrap;
    }

    .comparison-table th.feature-col {
      text-align: left;
      width: 30%;
    }

    .comparison-table th.plan-col {
      width: 23.33%;
    }

    .comparison-table th.highlight-col {
      color: var(--primary);
      position: relative;
    }

    .category-row td {
      padding: 14px var(--spacing-lg);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      background: var(--bg-secondary);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .comparison-table tbody tr {
      border-bottom: 1px solid var(--border);
    }

    .comparison-table tbody tr:last-child {
      border-bottom: none;
    }

    .feature-name {
      padding: 14px var(--spacing-lg);
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }

    .plan-value {
      padding: 14px var(--spacing-lg);
      text-align: center;
      font-size: var(--font-size-base);
      color: var(--text-primary);
      font-weight: var(--font-weight-medium);
    }

    .plan-value svg {
      display: inline-block;
      vertical-align: middle;
    }

    td.highlight-col {
      background: rgba(255, 78, 120, 0.03);
    }

    th.highlight-col::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: var(--primary);
    }

    /* ========================================
       FAQ Section
       ======================================== */
    .faq-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .faq-list {
      max-width: 700px;
      margin: 0 auto;
    }

    .faq-item {
      background: var(--bg-secondary);
      border-radius: var(--radius-md);
      margin-bottom: var(--spacing-md);
      overflow: hidden;
    }

    .faq-question {
      width: 100%;
      padding: 20px var(--spacing-lg);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 15px;
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      text-align: left;
    }

    .faq-icon {
      transition: transform var(--transition-normal);
      color: var(--text-secondary);
      flex-shrink: 0;
      margin-left: var(--spacing-md);
    }

    .faq-item.open .faq-icon {
      transform: rotate(180deg);
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height var(--transition-slow);
    }

    .faq-item.open .faq-answer {
      max-height: 200px;
    }

    .faq-answer p {
      padding: 0 var(--spacing-lg) 20px;
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0;
    }

    /* ========================================
       CTA Section
       ======================================== */
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
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--spacing-md);
      line-height: 1.2;
    }

    .cta-content > p {
      font-size: var(--font-size-xl);
      color: rgba(255, 255, 255, 0.9);
      margin: 0 0 var(--spacing-xl);
      line-height: 1.6;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
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

    .cta-features {
      display: flex;
      justify-content: center;
      gap: var(--spacing-xl);
      flex-wrap: wrap;
    }

    .cta-feature {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-base);
      color: rgba(255, 255, 255, 0.9);
    }

    .cta-feature svg {
      flex-shrink: 0;
    }

    /* ========================================
       Responsive Styles
       ======================================== */
    @media (max-width: 1024px) {
      .pricing-grid {
        grid-template-columns: 1fr;
        max-width: 480px;
        margin: 0 auto;
      }

      .pricing-card.highlighted {
        order: -1;
      }

      .section-title {
        font-size: 28px;
      }

      .comparison-table th,
      .comparison-table td {
        padding: 12px var(--spacing-md);
      }
    }

    @media (max-width: 768px) {
      .hero {
        padding: 100px 0 40px;
      }

      .hero-title {
        font-size: 28px;
      }

      .hero-description {
        font-size: var(--font-size-lg);
      }

      .billing-toggle-section {
        padding: 32px 0 0;
      }

      .pricing-cards-section {
        padding: 32px 0 60px;
      }

      .pricing-card {
        padding: 24px;
      }

      .pricing-card.highlighted {
        padding: 32px 24px 24px;
      }

      .price-amount {
        font-size: 40px;
      }

      .comparison-section {
        padding: 60px 0;
      }

      .faq-section {
        padding: 60px 0;
      }

      .cta-section {
        padding: 60px 0;
      }

      .cta-content h2 {
        font-size: 28px;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .cta-features {
        flex-direction: column;
        gap: 16px;
        align-items: center;
      }

      .faq-question {
        font-size: 14px;
        padding: 16px var(--spacing-md);
      }

      .faq-answer p {
        padding: 0 var(--spacing-md) 16px;
      }
    }
  `]
})
export class PublicPricingComponent {
  isAnnual = signal(false);
  openFaq = signal<number | null>(null);

  faqs = [
    {
      question: "What's included in the free plan?",
      answer: 'The Starter plan includes 1 agency profile, up to 5 travel packages, basic analytics dashboard, email support, and standard business verification. It\'s completely free forever with no credit card required.'
    },
    {
      question: 'Can I switch plans at any time?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. When upgrading, you\'ll get immediate access to new features. When downgrading, the change takes effect at the end of your current billing period.'
    },
    {
      question: 'Is there a free trial for paid plans?',
      answer: 'Absolutely! Both the Professional and Enterprise plans come with a 14-day free trial. You get full access to all features during the trial period with no credit card required to start.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, Mastercard, American Express), debit cards, and bank transfers. For Enterprise plans, we also support invoicing and purchase orders.'
    },
    {
      question: 'Do you offer refunds?',
      answer: 'Yes, we offer a 30-day money-back guarantee on all paid plans. If you\'re not satisfied within the first 30 days, contact our support team for a full refund, no questions asked.'
    },
    {
      question: 'What happens when I exceed my plan limits?',
      answer: 'We\'ll notify you when you\'re approaching your plan limits. You can upgrade to a higher plan at any time to increase your limits. We never cut off access to your existing content.'
    }
  ];

  toggleBilling() {
    this.isAnnual.update(v => !v);
  }

  toggleFaq(index: number) {
    this.openFaq.update(current => current === index ? null : index);
  }
}
