import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-text">
            <div class="hero-badge">
              <span class="badge-dot"></span>
              Trusted by 1,200+ Travel Agencies
            </div>
            <h1 class="hero-title">Launch Your Travel Agency in Minutes</h1>
            <p class="hero-description">
              Join the leading platform for travel agencies. Publish packages, manage bookings, and get paid seamlessly—all with built-in verification and trust.
            </p>
            <div class="hero-buttons">
              <a routerLink="/auth/signup" class="btn btn-primary btn-lg">
                Create Agency Account
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
              <a href="#how-it-works" class="btn btn-outline btn-lg">Learn More</a>
            </div>
            <div class="hero-features">
              <div class="hero-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>No setup fees</span>
              </div>
              <div class="hero-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>Free verification</span>
              </div>
              <div class="hero-feature">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>5-min setup</span>
              </div>
            </div>
          </div>
          <div class="hero-visual">
            <div class="quick-setup-card">
              <div class="setup-header">
                <div class="setup-header-left">
                  <div class="setup-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="4" width="18" height="18" rx="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div>
                    <span class="setup-title">Quick Setup</span>
                    <span class="setup-subtitle">3 Simple Steps</span>
                  </div>
                </div>
                <div class="secure-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Secure
                </div>
              </div>
              <div class="setup-steps">
                <div class="setup-step completed">
                  <div class="step-number">1</div>
                  <div class="step-info">
                    <span class="step-name">Business Information</span>
                    <span class="step-desc">Legal name, registration number, address</span>
                  </div>
                  <div class="step-status completed">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>
                <div class="setup-step">
                  <div class="step-number">2</div>
                  <div class="step-info">
                    <span class="step-name">Owner Verification</span>
                    <span class="step-desc">Secure identity verification (KYC)</span>
                  </div>
                  <div class="step-status pending">
                    <div class="empty-circle"></div>
                  </div>
                </div>
                <div class="setup-step">
                  <div class="step-number">3</div>
                  <div class="step-info">
                    <span class="step-name">Start Publishing</span>
                    <span class="step-desc">Create and manage travel packages</span>
                  </div>
                  <div class="step-status pending">
                    <div class="empty-circle"></div>
                  </div>
                </div>
              </div>
              <div class="setup-footer">
                <span class="setup-time-label">Average setup time</span>
                <span class="setup-time-value">5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section">
      <div class="container">
        <div class="stats-grid">
          <div class="stat-item">
            <span class="stat-number">1,200+</span>
            <span class="stat-label">Verified Agencies</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">50K+</span>
            <span class="stat-label">Packages Published</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">99.8%</span>
            <span class="stat-label">Uptime</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">24/7</span>
            <span class="stat-label">Support</span>
          </div>
          <div class="stat-item">
            <span class="stat-number">4.9/5</span>
            <span class="stat-label">Agency Rating</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Section -->
    <section class="why-choose">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Everything You Need</p>
          <h2 class="section-title">Why Travel Agencies Choose AirHoppers</h2>
          <p class="section-description">A complete platform to grow your travel business with powerful tools, secure payments, and built-in trust.</p>
        </div>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon green">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <path d="M3 9h18"/>
                <path d="M9 21V9"/>
              </svg>
            </div>
            <h3 class="feature-title">Publish Unlimited Packages</h3>
            <p class="feature-description">Create and publish unlimited travel packages with rich media, detailed itineraries, and flexible pricing options.</p>
            <ul class="feature-list">
              <li>Rich media galleries</li>
              <li>Drag and drop package builder</li>
              <li>Dynamic pricing rules</li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-icon blue">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3 class="feature-title">Manage All Bookings</h3>
            <p class="feature-description">Streamline your booking management with real-time notifications, automated confirmations, and customer communication.</p>
            <ul class="feature-list">
              <li>Real-time notifications</li>
              <li>Automated confirmations</li>
              <li>Customer messaging</li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-icon purple">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2"/>
                <line x1="1" y1="10" x2="23" y2="10"/>
              </svg>
            </div>
            <h3 class="feature-title">Payments Ready Platform</h3>
            <p class="feature-description">Accept payments instantly with our integrated payment processing. Support for multiple currencies and payout options.</p>
            <ul class="feature-list">
              <li>Instant payment processing</li>
              <li>Multi-currency support</li>
              <li>Flexible payout options</li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-icon orange">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="M9 12l2 2 4-4"/>
              </svg>
            </div>
            <h3 class="feature-title">Built-in Verification</h3>
            <p class="feature-description">Build trust with customers through our verification badge. We verify your business identity and operating credentials.</p>
            <ul class="feature-list">
              <li>Business verification (KYB)</li>
              <li>Owner identity check (KYC)</li>
              <li>Verification badge display</li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-icon teal">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <h3 class="feature-title">Analytics & Insights</h3>
            <p class="feature-description">Make data-driven decisions with comprehensive analytics. Track bookings, revenue, customer behavior, and more.</p>
            <ul class="feature-list">
              <li>Revenue tracking reports</li>
              <li>Booking analytics</li>
              <li>Customer demographics</li>
            </ul>
          </div>
          <div class="feature-card">
            <div class="feature-icon red">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 class="feature-title">24/7 Support</h3>
            <p class="feature-description">Get help whenever you need it. Our dedicated support team is available around the clock to assist you.</p>
            <ul class="feature-list">
              <li>Live chat support</li>
              <li>Email & phone support</li>
              <li>Dedicated account manager</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Why We Verify Section -->
    <section class="verify-section">
      <div class="container">
        <div class="verify-badge-top">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          Secure & Compliant
        </div>
        <div class="verify-grid">
          <div class="verify-content">
            <h2 class="verify-title">Why We Verify Agencies</h2>
            <p class="verify-description">We verify all agencies to create a trusted marketplace where customers can book with confidence and agencies can build their reputation.</p>

            <div class="verify-reasons">
              <div class="verify-item">
                <div class="verify-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="7" height="7"/>
                    <rect x="14" y="3" width="7" height="7"/>
                    <rect x="14" y="14" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/>
                  </svg>
                </div>
                <div class="verify-text">
                  <h4>Business Verification (KYB)</h4>
                  <p>We verify your business registration, legal documents, and operating status to ensure you're a legitimate travel agency. This includes checking your business registration number, articles of incorporation, and business address.</p>
                </div>
              </div>
              <div class="verify-item">
                <div class="verify-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                    <path d="M16 11l2 2 4-4"/>
                  </svg>
                </div>
                <div class="verify-text">
                  <h4>Identity Verification (KYC)</h4>
                  <p>We verify the identity of business owners and authorized representatives through a secure, government-grade verification process. This typically involves uploading a government-issued ID and completing a quick selfie verification.</p>
                </div>
              </div>
              <div class="verify-item">
                <div class="verify-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="verify-text">
                  <h4>Fast & Automated Process</h4>
                  <p>Most verifications are completed within 24 hours. Our automated system powered by Persona makes the process quick and seamless, so you can start publishing packages right away.</p>
                </div>
              </div>
            </div>
          </div>
          <div class="verify-visual">
            <div class="verification-steps-card">
              <div class="steps-card-header">
                <h3>Verification Steps</h3>
                <div class="secure-process-badge">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Secure Process
                </div>
              </div>
              <div class="steps-timeline">
                <div class="timeline-step">
                  <div class="timeline-indicator">
                    <span class="step-circle">1</span>
                    <div class="timeline-line"></div>
                  </div>
                  <div class="step-content">
                    <h4>Submit Business Info</h4>
                    <p>Provide your business registration details and documents</p>
                    <div class="step-tags">
                      <span class="step-tag">Registration #</span>
                      <span class="step-tag">Legal Name</span>
                      <span class="step-tag">Address</span>
                    </div>
                  </div>
                </div>
                <div class="timeline-step">
                  <div class="timeline-indicator">
                    <span class="step-circle">2</span>
                    <div class="timeline-line"></div>
                  </div>
                  <div class="step-content">
                    <h4>Identity Verification</h4>
                    <p>Quick ID check via secure Persona platform</p>
                    <div class="step-tags">
                      <span class="step-tag">Government ID</span>
                      <span class="step-tag">Selfie</span>
                      <span class="step-tag">2-3 min</span>
                    </div>
                  </div>
                </div>
                <div class="timeline-step last">
                  <div class="timeline-indicator">
                    <span class="step-circle">3</span>
                  </div>
                  <div class="step-content">
                    <h4>Get Verified Badge</h4>
                    <p>Start publishing with verified status</p>
                    <div class="verified-badge-preview">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      Verified Agency Badge
                    </div>
                  </div>
                </div>
              </div>
              <div class="steps-card-footer">
                <div class="footer-left">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span>Typical verification time</span>
                </div>
                <span class="footer-time">Under 24 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Security Section -->
    <section class="security-section">
      <div class="container">
        <div class="security-card">
          <div class="security-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          </div>
          <div class="security-content">
            <h2>Your Data is Safe & Secure</h2>
            <p>We take privacy and security seriously. All verification data is encrypted, stored securely, and handled in compliance with international data protection regulations.</p>
            <div class="security-features">
              <div class="security-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <span>Bank-Grade Encryption</span>
              </div>
              <div class="security-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>Secure Data Storage</span>
              </div>
              <div class="security-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                <span>GDPR Compliant</span>
              </div>
              <div class="security-feature">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 16v-4M12 8h.01"/>
                </svg>
                <span>Secure Review Process</span>
              </div>
            </div>
            <div class="security-badges">
              <span class="security-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                What We Collect
              </span>
              <span class="security-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Privacy Policy
              </span>
              <span class="security-badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works" id="how-it-works">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Getting Started</p>
          <h2 class="section-title">How It Works</h2>
          <p class="section-description">Get verified and start publishing packages in three simple steps. The entire process takes about 10 minutes.</p>
        </div>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number-large">1</div>
            <h3>Create Account</h3>
            <p>Sign up with your email and basic information. Create your agency profile in minutes.</p>
          </div>
          <div class="step-card">
            <div class="step-number-large">2</div>
            <h3>Complete Verification</h3>
            <p>Submit your business documents and complete identity verification. Most verifications are approved within 24 hours.</p>
          </div>
          <div class="step-card">
            <div class="step-number-large">3</div>
            <h3>Start Publishing</h3>
            <p>Once verified, start creating and publishing your travel packages. Reach thousands of potential customers instantly.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Verified Badge Section -->
    <section class="badge-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Build Trust</p>
          <h2 class="section-title">Stand Out with a Verified Badge</h2>
          <p class="section-description">Once verified, your agency profile displays a verification badge that builds trust and increases bookings.</p>
        </div>
        <div class="badge-comparison">
          <div class="comparison-card admin">
            <div class="comparison-header">
              <span class="comparison-label">Admin Portal</span>
            </div>
            <div class="comparison-content">
              <div class="mock-profile">
                <div class="mock-header">
                  <div class="mock-avatar">
                    <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop" alt="Agency">
                  </div>
                  <div class="mock-info">
                    <div class="mock-name">
                      <span>Paradise Travel Co.</span>
                      <span class="verified-badge green">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      </span>
                    </div>
                    <span class="mock-type">Verified Agency</span>
                  </div>
                </div>
                <div class="mock-stats">
                  <div class="mock-stat">
                    <span class="mock-stat-value">89</span>
                    <span class="mock-stat-label">Active Packages</span>
                  </div>
                  <div class="mock-stat">
                    <span class="mock-stat-value">$124K</span>
                    <span class="mock-stat-label">Total Revenue</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="comparison-card public">
            <div class="comparison-header">
              <span class="comparison-label">Public Profile</span>
            </div>
            <div class="comparison-content">
              <div class="public-profile">
                <div class="public-header">
                  <img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop" alt="Cover" class="public-cover">
                  <div class="public-avatar">
                    <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=80&h=80&fit=crop" alt="Agency">
                  </div>
                </div>
                <div class="public-body">
                  <div class="public-name">
                    <span>Adventure Travelers</span>
                    <span class="verified-badge green">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </span>
                  </div>
                  <p class="public-location">San Francisco, California</p>
                  <p class="public-desc">Premium adventure tours and experiences worldwide. Trusted by 10,000+ travelers.</p>
                  <div class="public-rating">
                    <div class="stars">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    </div>
                    <span>4.9 (2,847 reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Success Stories</p>
          <h2 class="section-title">Trusted by Travel Agencies Worldwide</h2>
          <p class="section-description">See what agency owners say about AirHoppers.</p>
        </div>
        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="testimonial-rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <p class="testimonial-text">"The verification process was smooth and the verified badge has increased our bookings by 40%. Customers trust us more now."</p>
            <div class="testimonial-author">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face" alt="Sarah Johnson">
              <div>
                <span class="author-name">Sarah Johnson</span>
                <span class="author-role">CEO, Wanderlust Tours</span>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <p class="testimonial-text">"AirHoppers's platform is incredibly easy to use and the analytics help me grow my business. Highly recommended!"</p>
            <div class="testimonial-author">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face" alt="Michael Chen">
              <div>
                <span class="author-name">Michael Chen</span>
                <span class="author-role">Founder, Asia Explorer</span>
              </div>
            </div>
          </div>
          <div class="testimonial-card">
            <div class="testimonial-rating">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <p class="testimonial-text">"As a new agency, the verified badge was crucial in building trust with customers. We've seen a 60% increase in inquiries."</p>
            <div class="testimonial-author">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face" alt="Emily Rodriguez">
              <div>
                <span class="author-name">Emily Rodriguez</span>
                <span class="author-role">Owner, Sunset Voyages</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Help Center</p>
          <h2 class="section-title">Frequently Asked Questions</h2>
          <p class="section-description">Everything you need to know about agency verification.</p>
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

    <!-- Help Section -->
    <section class="help-section">
      <div class="container">
        <div class="help-card">
          <div class="help-left">
            <h2>Need Help with Verification?</h2>
            <p class="help-desc">Our support team is here to guide you through the verification process and answer any questions.</p>
            <div class="support-options">
              <div class="support-option">
                <div class="support-icon chat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <div>
                  <h4>Live Chat Support</h4>
                  <p>Available 24/7 for instant help</p>
                </div>
              </div>
              <div class="support-option">
                <div class="support-icon email">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </div>
                <div>
                  <h4>Email Support</h4>
                  <p>support&#64;AirHoppers.com</p>
                </div>
              </div>
              <div class="support-option">
                <div class="support-icon phone">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div>
                  <h4>Phone Support</h4>
                  <p>+1 (555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>
          <div class="help-right">
            <div class="quick-links-card">
              <h3>Quick Links</h3>
              <div class="quick-links-list">
                <a href="#" class="quick-link-item">
                  <span>Verification Guide</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <a href="#" class="quick-link-item">
                  <span>Document Requirements</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <a href="#" class="quick-link-item">
                  <span>Troubleshooting</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
                <a href="#" class="quick-link-item">
                  <span>Contact Support</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <div class="cta-badge">
            <span class="cta-dot"></span>
            Join 1,200+ Verified Agencies
          </div>
          <h2>Ready to Grow Your Travel Business?</h2>
          <p>Create your agency account today and start publishing packages in minutes. No setup fees, no hidden costs.</p>
          <div class="cta-buttons">
            <a routerLink="/auth/signup" class="btn btn-cta-primary btn-lg">
              Create Agency Account
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#" class="btn btn-cta-outline btn-lg">Schedule a Demo</a>
          </div>
          <div class="cta-features">
            <div class="cta-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>Free verification</span>
            </div>
            <div class="cta-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>5-minute setup</span>
            </div>
            <div class="cta-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>24/7 support</span>
            </div>
            <div class="cta-feature">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" fill="#22c55e"/>
                <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>No credit card required</span>
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

    .btn-white {
      background: white;
      color: var(--primary);
    }

    .btn-white:hover {
      background: var(--coral-100);
    }

    .btn-outline-white {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.3);
      color: white;
    }

    .btn-outline-white:hover {
      background: rgba(255,255,255,0.1);
    }

    .btn-lg {
      padding: 14px 28px;
      font-size: var(--font-size-lg);
    }

    .btn-sm {
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
    }

    .btn-full {
      width: 100%;
    }

    /* Hero Section */
    .hero {
      padding: 120px 0 80px;
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
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
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
      font-size: 52px;
      font-weight: var(--font-weight-bold);
      line-height: 1.1;
      color: var(--text-primary);
      margin: 0 0 20px;
    }

    .hero-description {
      font-size: var(--font-size-xl);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0 0 var(--spacing-xl);
    }

    .hero-buttons {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
    }

    .hero-features {
      display: flex;
      gap: var(--spacing-lg);
      flex-wrap: wrap;
    }

    .hero-feature {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }

    .hero-visual {
      position: relative;
      display: flex;
      justify-content: flex-end;
    }

    .quick-setup-card {
      background: var(--bg-primary);
      border-radius: var(--radius-2xl);
      box-shadow: var(--shadow-xl);
      width: 420px;
      overflow: hidden;
    }

    .setup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px var(--spacing-lg);
      border-bottom: 1px solid var(--border);
    }

    .setup-header-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .setup-icon {
      width: 44px;
      height: 44px;
      background: var(--coral-100);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
    }

    .setup-title {
      display: block;
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }

    .setup-subtitle {
      display: block;
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .secure-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px var(--spacing-md);
      background: var(--color-success-light);
      color: var(--color-success);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .setup-steps {
      padding: var(--spacing-sm) var(--spacing-lg);
    }

    .setup-step {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md) 0;
      border-bottom: 1px solid var(--border);
    }

    .setup-step:last-child {
      border-bottom: none;
    }

    .step-number {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      flex-shrink: 0;
    }

    .step-info {
      flex: 1;
    }

    .step-name {
      display: block;
      font-size: 15px;
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin-bottom: 2px;
    }

    .step-desc {
      display: block;
      font-size: var(--font-size-sm);
      color: var(--text-tertiary);
    }

    .step-status {
      flex-shrink: 0;
    }

    .empty-circle {
      width: 20px;
      height: 20px;
      border-radius: var(--radius-full);
      border: 2px solid var(--border);
    }

    .setup-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md) var(--spacing-lg);
      background: var(--bg-secondary);
    }

    .setup-time-label {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }

    .setup-time-value {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    /* Stats Section */
    .stats-section {
      padding: var(--spacing-2xl) 0;
      background: var(--bg-primary);
      border-top: 1px solid var(--border);
    }

    .stats-grid {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .stat-item {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 40px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .stat-label {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }

    /* Section Styles */
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

    /* Why Choose Section */
    .why-choose {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .features-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .feature-card {
      background: var(--bg-primary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
      border: 1px solid var(--border);
      transition: box-shadow var(--transition-normal);
    }

    .feature-card:hover {
      box-shadow: var(--shadow-lg);
    }

    .feature-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: var(--spacing-md);
    }

    .feature-icon.green {
      background: var(--coral-100);
      color: var(--primary);
    }

    .feature-icon.blue {
      background: var(--color-info-light);
      color: var(--color-info);
    }

    .feature-icon.purple {
      background: #f3e8ff;
      color: #9333ea;
    }

    .feature-icon.orange {
      background: var(--color-warning-light);
      color: var(--color-warning);
    }

    .feature-icon.teal {
      background: #ccfbf1;
      color: #0d9488;
    }

    .feature-icon.red {
      background: var(--coral-100);
      color: var(--primary);
    }

    .feature-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-sm);
    }

    .feature-description {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 var(--spacing-md);
    }

    .feature-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .feature-list li {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      padding: var(--spacing-xs) 0;
      padding-left: 20px;
      position: relative;
    }

    .feature-list li::before {
      content: '\\2713';
      position: absolute;
      left: 0;
      color: var(--primary);
      font-weight: var(--font-weight-semibold);
    }

    /* Verify Section */
    .verify-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .verify-badge-top {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      background: var(--bg-primary);
      border: 1px solid var(--border);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: var(--spacing-lg);
    }

    .verify-badge-top svg {
      color: var(--text-secondary);
    }

    .verify-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: flex-start;
    }

    .verify-title {
      font-size: 42px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-md);
      line-height: 1.1;
    }

    .verify-description {
      font-size: var(--font-size-lg);
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-xl);
      line-height: 1.6;
      max-width: 540px;
    }

    .verify-reasons {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xl);
    }

    .verify-item {
      display: flex;
      gap: var(--spacing-md);
      align-items: flex-start;
    }

    .verify-icon {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-lg);
      background: var(--coral-100);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .verify-text h4 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-sm);
    }

    .verify-text p {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.7;
    }

    .verification-steps-card {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      overflow: hidden;
    }

    .steps-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-lg) var(--spacing-xl);
      border-bottom: 1px solid var(--border);
    }

    .steps-card-header h3 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0;
    }

    .secure-process-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px var(--spacing-md);
      background: var(--color-success-light);
      color: var(--color-success);
      border-radius: var(--radius-full);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
    }

    .steps-timeline {
      padding: var(--spacing-lg) var(--spacing-xl);
    }

    .timeline-step {
      display: flex;
      gap: var(--spacing-md);
    }

    .timeline-indicator {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .step-circle {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: #f87171;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      flex-shrink: 0;
    }

    .timeline-line {
      width: 2px;
      flex: 1;
      background: var(--border);
      margin: var(--spacing-sm) 0;
      min-height: 40px;
    }

    .timeline-step.last .timeline-indicator {
      align-items: center;
    }

    .step-content {
      flex: 1;
      padding-bottom: var(--spacing-lg);
    }

    .timeline-step.last .step-content {
      padding-bottom: 0;
    }

    .step-content h4 {
      font-size: 15px;
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-xs);
    }

    .step-content > p {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-sm);
    }

    .step-tags {
      display: flex;
      gap: var(--spacing-sm);
      flex-wrap: wrap;
    }

    .step-tag {
      display: inline-block;
      padding: var(--spacing-xs) var(--spacing-sm);
      background: var(--bg-secondary);
      border: 1px solid var(--border);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    .verified-badge-preview {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      background: var(--color-success-light);
      border: 1px solid rgba(16, 185, 129, 0.2);
      border-radius: var(--radius-md);
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--color-success);
    }

    .steps-card-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--spacing-md) var(--spacing-xl);
      border-top: 1px solid var(--border);
      background: var(--bg-secondary);
    }

    .footer-left {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
    }

    .footer-left svg {
      color: var(--text-tertiary);
    }

    .footer-time {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    /* Security Section */
    .security-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .security-card {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      padding: var(--spacing-2xl);
      display: flex;
      gap: 40px;
      align-items: flex-start;
      box-shadow: var(--shadow-md);
    }

    .security-icon {
      width: 80px;
      height: 80px;
      background: var(--coral-100);
      border-radius: var(--radius-xl);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
      flex-shrink: 0;
    }

    .security-content h2 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-md);
    }

    .security-content > p {
      font-size: 15px;
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 var(--spacing-lg);
    }

    .security-features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-lg);
    }

    .security-feature {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-size: var(--font-size-base);
      color: var(--text-primary);
    }

    .security-feature svg {
      color: var(--primary);
    }

    .security-badges {
      display: flex;
      gap: var(--spacing-md);
      flex-wrap: wrap;
    }

    .security-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      cursor: pointer;
    }

    .security-badge:hover {
      color: var(--text-primary);
    }

    /* How It Works Section */
    .how-it-works {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .steps-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-xl);
    }

    .step-card {
      text-align: center;
      padding: var(--spacing-xl) var(--spacing-lg);
      background: var(--bg-secondary);
      border-radius: var(--radius-xl);
      position: relative;
    }

    .step-number-large {
      width: 48px;
      height: 48px;
      background: var(--primary);
      color: white;
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      font-weight: var(--font-weight-bold);
      margin: 0 auto 20px;
    }

    .step-card h3 {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-md);
    }

    .step-card p {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.6;
    }

    /* Badge Section */
    .badge-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .badge-comparison {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-xl);
    }

    .comparison-card {
      background: var(--bg-primary);
      border-radius: var(--radius-xl);
      overflow: hidden;
      box-shadow: var(--shadow-md);
    }

    .comparison-header {
      padding: var(--spacing-md) var(--spacing-lg);
      border-bottom: 1px solid var(--border);
    }

    .comparison-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-semibold);
      color: var(--text-secondary);
    }

    .comparison-content {
      padding: var(--spacing-lg);
    }

    .mock-profile {
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      padding: 20px;
    }

    .mock-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
    }

    .mock-avatar {
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      overflow: hidden;
    }

    .mock-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .mock-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .mock-type {
      font-size: var(--font-size-xs);
      color: var(--primary);
    }

    .mock-stats {
      display: flex;
      gap: var(--spacing-xl);
    }

    .mock-stat-value {
      display: block;
      font-size: 20px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
    }

    .mock-stat-label {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    .public-profile {
      border: 1px solid var(--border);
      border-radius: var(--radius-lg);
      overflow: hidden;
    }

    .public-header {
      position: relative;
      height: 100px;
    }

    .public-cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .public-avatar {
      position: absolute;
      bottom: -24px;
      left: 20px;
      width: 48px;
      height: 48px;
      border-radius: var(--radius-md);
      overflow: hidden;
      border: 3px solid white;
    }

    .public-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .public-body {
      padding: var(--spacing-xl) 20px 20px;
    }

    .public-name {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: var(--spacing-xs);
    }

    .public-location {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      margin: 0 0 var(--spacing-sm);
    }

    .public-desc {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-md);
      line-height: 1.5;
    }

    .public-rating {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .stars {
      display: flex;
      gap: 2px;
    }

    .public-rating span {
      font-size: var(--font-size-xs);
      color: var(--text-secondary);
    }

    /* Testimonials Section */
    .testimonials {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .testimonial-card {
      background: var(--bg-secondary);
      border-radius: var(--radius-lg);
      padding: var(--spacing-lg);
    }

    .testimonial-rating {
      display: flex;
      gap: 2px;
      margin-bottom: var(--spacing-md);
    }

    .testimonial-text {
      font-size: var(--font-size-base);
      color: var(--text-primary);
      line-height: 1.6;
      margin: 0 0 20px;
    }

    .testimonial-author {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .testimonial-author img {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-full);
      object-fit: cover;
    }

    .author-name {
      display: block;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .author-role {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }

    /* FAQ Section */
    .faq-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .faq-list {
      max-width: 700px;
      margin: 0 auto;
    }

    .faq-item {
      background: var(--bg-primary);
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

    /* Help Section */
    .help-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .help-card {
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-radius: var(--radius-2xl);
      padding: var(--spacing-2xl);
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-2xl);
    }

    .help-left h2 {
      font-size: var(--font-size-3xl);
      font-weight: var(--font-weight-bold);
      color: white;
      margin: 0 0 var(--spacing-md);
    }

    .help-desc {
      font-size: 15px;
      color: rgba(255,255,255,0.7);
      margin: 0 0 var(--spacing-xl);
      line-height: 1.6;
    }

    .support-options {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .support-option {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-md);
    }

    .support-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .support-icon.chat {
      background: rgba(255, 78, 120, 0.2);
      color: var(--coral-400);
    }

    .support-icon.email {
      background: rgba(255, 78, 120, 0.2);
      color: var(--coral-400);
    }

    .support-icon.phone {
      background: rgba(255, 78, 120, 0.2);
      color: var(--coral-400);
    }

    .support-option h4 {
      font-size: 15px;
      font-weight: var(--font-weight-semibold);
      color: white;
      margin: 0 0 var(--spacing-xs);
    }

    .support-option p {
      font-size: var(--font-size-sm);
      color: rgba(255,255,255,0.6);
      margin: 0;
    }

    .help-right {
      display: flex;
      align-items: center;
    }

    .quick-links-card {
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: var(--radius-xl);
      padding: var(--spacing-lg);
      width: 100%;
    }

    .quick-links-card h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: white;
      margin: 0 0 var(--spacing-md);
    }

    .quick-links-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
    }

    .quick-link-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px var(--spacing-md);
      background: rgba(255,255,255,0.05);
      border-radius: var(--radius-md);
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      font-size: var(--font-size-base);
      transition: all var(--transition-normal);
    }

    .quick-link-item:hover {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .quick-link-item svg {
      opacity: 0.5;
    }

    .quick-link-item:hover svg {
      opacity: 1;
    }

    /* CTA Section */
    .cta-section {
      padding: 100px 0;
      background: linear-gradient(180deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%);
    }

    .cta-content {
      text-align: center;
      max-width: 700px;
      margin: 0 auto;
    }

    .cta-badge {
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

    .cta-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--primary);
    }

    .cta-content h2 {
      font-size: 42px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-md);
      line-height: 1.2;
    }

    .cta-content > p {
      font-size: var(--font-size-xl);
      color: var(--text-secondary);
      margin: 0 0 var(--spacing-xl);
      line-height: 1.6;
    }

    .cta-buttons {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
    }

    .btn-cta-primary {
      background: var(--primary-gradient);
      color: white;
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-lg);
      box-shadow: 0 4px 14px rgba(255, 78, 120, 0.4);
    }

    .btn-cta-primary:hover {
      background: linear-gradient(135deg, var(--primary) 0%, var(--coral-700) 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(255, 78, 120, 0.5);
    }

    .btn-cta-outline {
      background: var(--bg-primary);
      color: var(--text-primary);
      border: 1px solid var(--border);
      padding: var(--spacing-md) var(--spacing-xl);
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      border-radius: var(--radius-lg);
    }

    .btn-cta-outline:hover {
      background: var(--bg-secondary);
      border-color: var(--border-medium);
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
      color: var(--text-secondary);
    }

    .cta-feature svg {
      flex-shrink: 0;
    }

    /* Responsive Styles */
    @media (max-width: 1024px) {
      .hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
      }

      .hero-title {
        font-size: 36px;
      }

      .hero-visual {
        display: flex;
        justify-content: center;
      }

      .quick-setup-card {
        width: 100%;
        max-width: 420px;
      }

      .stats-grid {
        flex-wrap: wrap;
        gap: 32px;
        justify-content: center;
      }

      .features-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .verify-grid {
        grid-template-columns: 1fr;
      }

      .security-card {
        flex-direction: column;
      }

      .steps-grid {
        grid-template-columns: 1fr;
        gap: 24px;
      }

      .badge-comparison {
        grid-template-columns: 1fr;
      }

      .testimonials-grid {
        grid-template-columns: 1fr;
      }

      .help-card {
        grid-template-columns: 1fr;
        gap: 32px;
      }

    }

    @media (max-width: 768px) {
      .hero {
        padding: 100px 0 60px;
      }

      .hero-title {
        font-size: 28px;
      }

      .hero-buttons {
        flex-direction: column;
      }

      .hero-features {
        justify-content: center;
      }

      .quick-setup-card {
        max-width: 100%;
      }

      .features-grid {
        grid-template-columns: 1fr;
      }

      .stat-number {
        font-size: 28px;
      }

      .section-title {
        font-size: 28px;
      }

      .verify-title {
        font-size: 28px;
      }

      .steps-card-header {
        padding: var(--spacing-md);
      }

      .steps-timeline {
        padding: var(--spacing-md);
      }

      .steps-card-footer {
        padding: var(--spacing-md);
      }

      .security-features {
        grid-template-columns: 1fr;
      }

      .help-card {
        padding: 32px 24px;
      }

      .help-left h2 {
        font-size: 22px;
      }

      .cta-buttons {
        flex-direction: column;
        align-items: center;
      }

      .cta-content h2 {
        font-size: 28px;
      }

      .cta-features {
        flex-direction: column;
        gap: 16px;
        align-items: center;
      }

    }
  `]
})
export class HomepageComponent {
  openFaq = signal<number | null>(null);

  faqs = [
    {
      question: 'How long does verification take?',
      answer: 'Most verifications are completed within 24 hours. The process includes KYB (Know Your Business) and KYC (Know Your Customer) checks. Once you submit all required documents, our team reviews them promptly.'
    },
    {
      question: 'What documents do I need for verification?',
      answer: 'You\'ll need your business registration documents, a valid government-issued ID for the business owner, proof of business address, and any relevant travel industry licenses or certifications.'
    },
    {
      question: 'Is my data secure during verification?',
      answer: 'Yes, absolutely. All verification data is encrypted using bank-grade encryption, stored securely, and handled in compliance with GDPR and international data protection regulations.'
    },
    {
      question: 'What happens if my verification is rejected?',
      answer: 'If your verification is rejected, we\'ll provide detailed feedback on why and what additional information is needed. You can resubmit your application once you\'ve addressed the issues.'
    },
    {
      question: 'How much does verification cost?',
      answer: 'Basic verification is included free with your AirHoppers account. There are no hidden fees for the standard verification process.'
    },
    {
      question: 'Can I modify my info after verification?',
      answer: 'Yes, you can update your business information at any time. Some changes may require re-verification, but our team will guide you through the process if needed.'
    }
  ];

  toggleFaq(index: number) {
    this.openFaq.update(current => current === index ? null : index);
  }
}
