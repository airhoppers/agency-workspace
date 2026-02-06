import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-privacy-policy',
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
          <h1 class="hero-title">Privacy Policy</h1>
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
            <h2>1. Introduction</h2>
            <p>Welcome to AirHoppers. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>
            <p>By accessing or using our services, you agree to the collection and use of information in accordance with this policy.</p>
          </div>

          <div class="legal-block">
            <h2>2. Information We Collect</h2>
            <h3>Personal Information</h3>
            <p>We may collect the following personal information when you register for an account or use our services:</p>
            <ul>
              <li>Name, email address, and phone number</li>
              <li>Business name and registration details</li>
              <li>Billing and payment information</li>
              <li>Identity verification documents (for agency verification)</li>
              <li>Profile photos and agency logos</li>
            </ul>
            <h3>Usage Information</h3>
            <p>We automatically collect certain information when you use our platform:</p>
            <ul>
              <li>IP address and browser type</li>
              <li>Pages visited and time spent on pages</li>
              <li>Device information and operating system</li>
              <li>Referring URLs and search terms</li>
            </ul>
          </div>

          <div class="legal-block">
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve our services</li>
              <li>Process transactions and send related information</li>
              <li>Verify agency identities and business credentials</li>
              <li>Send promotional communications (with your consent)</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues and fraud</li>
              <li>Comply with legal obligations</li>
            </ul>
          </div>

          <div class="legal-block">
            <h2>4. Information Sharing</h2>
            <p>We do not sell your personal information. We may share your information in the following circumstances:</p>
            <ul>
              <li><strong>Service Providers:</strong> With third-party vendors who assist in operating our platform (payment processors, cloud hosting, analytics)</li>
              <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
              <li><strong>With Your Consent:</strong> When you have given explicit permission</li>
            </ul>
          </div>

          <div class="legal-block">
            <h2>5. Data Security</h2>
            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, secure servers, and regular security audits.</p>
            <p>However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>
          </div>

          <div class="legal-block">
            <h2>6. Data Retention</h2>
            <p>We retain your personal information for as long as your account is active or as needed to provide you services. We may also retain and use your information to comply with legal obligations, resolve disputes, and enforce our agreements.</p>
          </div>

          <div class="legal-block">
            <h2>7. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul>
              <li>Access and receive a copy of your personal data</li>
              <li>Rectify inaccurate or incomplete data</li>
              <li>Request deletion of your personal data</li>
              <li>Object to or restrict processing of your data</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time</li>
            </ul>
            <p>To exercise any of these rights, please contact us at <a href="mailto:privacy&#64;airhoppers.com" class="inline-link">privacy&#64;airhoppers.com</a>.</p>
          </div>

          <div class="legal-block">
            <h2>8. Cookies</h2>
            <p>We use cookies and similar tracking technologies to enhance your experience on our platform. For more information, please refer to our <a routerLink="/cookie-policy" class="inline-link">Cookie Policy</a>.</p>
          </div>

          <div class="legal-block">
            <h2>9. Children's Privacy</h2>
            <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it.</p>
          </div>

          <div class="legal-block">
            <h2>10. Changes to This Policy</h2>
            <p>We may update this privacy policy from time to time. We will notify you of any material changes by posting the updated policy on this page and updating the "Last updated" date.</p>
          </div>

          <div class="legal-block">
            <h2>11. Contact Us</h2>
            <p>If you have questions or concerns about this privacy policy, please contact us:</p>
            <ul>
              <li>Email: <a href="mailto:privacy&#64;airhoppers.com" class="inline-link">privacy&#64;airhoppers.com</a></li>
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
       CONTENT SECTION
       ============================= */
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

    /* =============================
       RESPONSIVE
       ============================= */
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
export class PublicPrivacyPolicyComponent {
  currentYear = new Date().getFullYear();
}
