import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-terms-of-service',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Legal
          </div>
          <h1 class="hero-title">Terms of Service</h1>
          <p class="hero-description">
            Last updated: January 1, {{ currentYear }}
          </p>
        </div>
      </div>
    </section>

    <!-- Content Section -->
    <section class="content-section">
      <div class="container">
        <div class="legal-content">

          <div class="legal-block">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using AirHoppers ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our services.</p>
            <p>These Terms apply to all users of the Platform, including travel agencies, administrators, and visitors.</p>
          </div>

          <div class="legal-block">
            <h2>2. Description of Service</h2>
            <p>AirHoppers provides a platform for travel agencies to:</p>
            <ul>
              <li>Create and manage agency profiles</li>
              <li>Publish and manage travel packages</li>
              <li>Process bookings and payments</li>
              <li>Access analytics and reporting tools</li>
              <li>Connect with travelers and manage customer relationships</li>
            </ul>
            <p>We reserve the right to modify, suspend, or discontinue any part of the service at any time with reasonable notice.</p>
          </div>

          <div class="legal-block">
            <h2>3. Account Registration</h2>
            <p>To use certain features of the Platform, you must create an account. You agree to:</p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p>You must be at least 18 years old to create an account and use our services.</p>
          </div>

          <div class="legal-block">
            <h2>4. Agency Verification</h2>
            <p>Travel agencies using our Platform may be required to complete a verification process, which includes:</p>
            <ul>
              <li>Submitting valid business registration documents</li>
              <li>Completing identity verification (KYC) checks</li>
              <li>Providing proof of relevant licenses and permits</li>
            </ul>
            <p>We reserve the right to reject or revoke verification at our discretion if provided information is found to be inaccurate or fraudulent.</p>
          </div>

          <div class="legal-block">
            <h2>5. User Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Platform for any unlawful purpose</li>
              <li>Post false, misleading, or fraudulent content</li>
              <li>Interfere with or disrupt the Platform's infrastructure</li>
              <li>Attempt to gain unauthorized access to other accounts or systems</li>
              <li>Collect or harvest user data without consent</li>
              <li>Use automated systems (bots, scrapers) without permission</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </div>

          <div class="legal-block">
            <h2>6. Content and Intellectual Property</h2>
            <p>You retain ownership of content you upload to the Platform (including package descriptions, images, and agency information). By uploading content, you grant AirHoppers a non-exclusive, worldwide license to use, display, and distribute your content in connection with the services.</p>
            <p>The Platform, including its design, logos, and software, is the property of AirHoppers and is protected by intellectual property laws. You may not copy, modify, or distribute our proprietary content without written permission.</p>
          </div>

          <div class="legal-block">
            <h2>7. Payments and Fees</h2>
            <p>Certain features of the Platform require payment. By subscribing to a paid plan, you agree to:</p>
            <ul>
              <li>Pay all applicable fees as described on our <a routerLink="/pricing" class="inline-link">Pricing</a> page</li>
              <li>Provide valid payment information</li>
              <li>Authorize recurring charges for subscription plans</li>
            </ul>
            <p>All fees are non-refundable except as expressly stated in our refund policy or required by law. We reserve the right to change pricing with 30 days' advance notice.</p>
          </div>

          <div class="legal-block">
            <h2>8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, AirHoppers shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform, including but not limited to loss of profits, data, or business opportunities.</p>
            <p>Our total liability for any claim shall not exceed the amount you paid to us in the twelve (12) months preceding the event giving rise to the claim.</p>
          </div>

          <div class="legal-block">
            <h2>9. Disclaimers</h2>
            <p>The Platform is provided "as is" and "as available" without warranties of any kind, whether express or implied. We do not guarantee that the Platform will be uninterrupted, error-free, or secure at all times.</p>
            <p>AirHoppers does not endorse or guarantee the quality, safety, or legality of travel packages published by agencies on the Platform.</p>
          </div>

          <div class="legal-block">
            <h2>10. Termination</h2>
            <p>We may suspend or terminate your account at any time for violation of these Terms or for any other reason at our discretion, with or without notice. Upon termination:</p>
            <ul>
              <li>Your right to access the Platform will immediately cease</li>
              <li>Outstanding payments remain due</li>
              <li>Provisions that by their nature should survive termination will remain in effect</li>
            </ul>
            <p>You may terminate your account at any time by contacting our support team.</p>
          </div>

          <div class="legal-block">
            <h2>11. Governing Law</h2>
            <p>These Terms shall be governed by and construed in accordance with the laws of the State of New York, United States, without regard to its conflict of law provisions.</p>
            <p>Any disputes arising from these Terms shall be resolved in the courts located in New York County, New York.</p>
          </div>

          <div class="legal-block">
            <h2>12. Changes to Terms</h2>
            <p>We reserve the right to modify these Terms at any time. We will provide notice of material changes by posting the updated Terms on this page and updating the "Last updated" date. Continued use of the Platform after changes constitutes acceptance of the revised Terms.</p>
          </div>

          <div class="legal-block">
            <h2>13. Contact Us</h2>
            <p>If you have questions about these Terms, please contact us:</p>
            <ul>
              <li>Email: <a href="mailto:legal&#64;airhoppers.com" class="inline-link">legal&#64;airhoppers.com</a></li>
              <li>Address: AirHoppers HQ, 123 Travel Street, New York, NY 10001</li>
            </ul>
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

    .content-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .legal-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .legal-block {
      margin-bottom: 40px;
    }

    .legal-block:last-child {
      margin-bottom: 0;
    }

    .legal-block h2 {
      font-size: 22px;
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 16px;
    }

    .legal-block h3 {
      font-size: var(--font-size-lg);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 24px 0 12px;
    }

    .legal-block p {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.8;
      margin: 0 0 16px;
    }

    .legal-block ul {
      padding-left: 24px;
      margin: 0 0 16px;
    }

    .legal-block li {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.8;
      margin-bottom: 8px;
    }

    .legal-block li strong {
      color: var(--text-primary);
    }

    .inline-link {
      color: var(--primary);
      text-decoration: none;
      font-weight: var(--font-weight-medium);
      transition: color var(--transition-normal);
    }

    .inline-link:hover {
      color: var(--coral-700);
    }

    @media (max-width: 1024px) {
      .hero-title {
        font-size: 36px;
      }
    }

    @media (max-width: 768px) {
      .hero {
        padding: 100px 0 48px;
      }

      .hero-title {
        font-size: 28px;
      }

      .content-section {
        padding: 60px 0;
      }

      .legal-block h2 {
        font-size: 20px;
      }
    }
  `]
})
export class PublicTermsOfServiceComponent {
  currentYear = new Date().getFullYear();
}
