import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-public-cookie-policy',
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
          <h1 class="hero-title">Cookie Policy</h1>
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
            <h2>1. What Are Cookies?</h2>
            <p>Cookies are small text files that are stored on your device (computer, tablet, or mobile) when you visit a website. They help the website recognize your device and remember information about your visit, such as your preferences and settings.</p>
          </div>

          <div class="legal-block">
            <h2>2. How We Use Cookies</h2>
            <p>AirHoppers uses cookies and similar technologies for the following purposes:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the Platform to function properly. They enable basic features like page navigation, secure access to your account, and session management. Without these cookies, the Platform cannot operate.</li>
              <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with the Platform by collecting anonymous information about page visits, load times, and error messages. This data helps us improve the Platform's performance.</li>
              <li><strong>Functionality Cookies:</strong> Allow the Platform to remember choices you make (such as your language preference, region, or display settings) and provide enhanced, personalized features.</li>
              <li><strong>Analytics Cookies:</strong> Used to collect information about how visitors use the Platform, including the number of visitors, the pages they visit, and the time spent on each page. We use this data to improve the Platform and measure the effectiveness of our content.</li>
            </ul>
          </div>

          <div class="legal-block">
            <h2>3. Types of Cookies We Use</h2>
            <div class="cookie-table">
              <div class="cookie-row header">
                <span class="cookie-col">Cookie Type</span>
                <span class="cookie-col">Purpose</span>
                <span class="cookie-col">Duration</span>
              </div>
              <div class="cookie-row">
                <span class="cookie-col"><strong>Session Cookies</strong></span>
                <span class="cookie-col">Maintain your login state and session data</span>
                <span class="cookie-col">Until browser is closed</span>
              </div>
              <div class="cookie-row">
                <span class="cookie-col"><strong>Authentication</strong></span>
                <span class="cookie-col">Keep you signed in securely</span>
                <span class="cookie-col">30 days</span>
              </div>
              <div class="cookie-row">
                <span class="cookie-col"><strong>Preferences</strong></span>
                <span class="cookie-col">Remember your settings and display preferences</span>
                <span class="cookie-col">1 year</span>
              </div>
              <div class="cookie-row">
                <span class="cookie-col"><strong>Analytics</strong></span>
                <span class="cookie-col">Track anonymous usage data for improvements</span>
                <span class="cookie-col">2 years</span>
              </div>
              <div class="cookie-row">
                <span class="cookie-col"><strong>Security</strong></span>
                <span class="cookie-col">Detect fraud and protect your account</span>
                <span class="cookie-col">6 months</span>
              </div>
            </div>
          </div>

          <div class="legal-block">
            <h2>4. Third-Party Cookies</h2>
            <p>Some cookies on our Platform are set by third-party services that appear on our pages. We use the following third-party services that may set cookies:</p>
            <ul>
              <li><strong>Google Analytics:</strong> For website traffic analysis and reporting</li>
              <li><strong>Stripe:</strong> For secure payment processing</li>
              <li><strong>Persona:</strong> For identity verification services</li>
            </ul>
            <p>We do not control these third-party cookies. Please refer to the respective third-party privacy policies for more information.</p>
          </div>

          <div class="legal-block">
            <h2>5. Managing Cookies</h2>
            <p>You can control and manage cookies in several ways:</p>
            <h3>Browser Settings</h3>
            <p>Most web browsers allow you to manage cookies through their settings. You can typically find these in the "Options," "Settings," or "Preferences" menu of your browser. You can:</p>
            <ul>
              <li>View cookies stored on your device</li>
              <li>Delete all or specific cookies</li>
              <li>Block all cookies or only third-party cookies</li>
              <li>Set preferences for certain websites</li>
            </ul>
            <p>Please note that blocking essential cookies may affect the functionality of the Platform.</p>
          </div>

          <div class="legal-block">
            <h2>6. Do Not Track</h2>
            <p>Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to be tracked. Currently, there is no universal standard for how websites should respond to DNT signals. We will update this policy if a standard is established.</p>
          </div>

          <div class="legal-block">
            <h2>7. Changes to This Policy</h2>
            <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will post the updated policy on this page and update the "Last updated" date.</p>
          </div>

          <div class="legal-block">
            <h2>8. Contact Us</h2>
            <p>If you have questions about our use of cookies, please contact us:</p>
            <ul>
              <li>Email: <a href="mailto:privacy&#64;airhoppers.com" class="inline-link">privacy&#64;airhoppers.com</a></li>
              <li>Address: AirHoppers HQ, 123 Travel Street, New York, NY 10001</li>
            </ul>
            <p>For more information about how we handle your personal data, please see our <a routerLink="/privacy-policy" class="inline-link">Privacy Policy</a>.</p>
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

    /* Cookie Table */
    .cookie-table {
      border: 1px solid var(--border);
      border-radius: 12px;
      overflow: hidden;
      margin: 16px 0;
    }

    .cookie-row {
      display: grid;
      grid-template-columns: 1fr 2fr 1fr;
      gap: 0;
    }

    .cookie-row.header {
      background: var(--bg-secondary);
    }

    .cookie-row.header .cookie-col {
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    .cookie-row:not(:last-child) {
      border-bottom: 1px solid var(--border);
    }

    .cookie-col {
      padding: 14px 16px;
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }

    .cookie-col strong {
      color: var(--text-primary);
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

      .cookie-row {
        grid-template-columns: 1fr;
      }

      .cookie-row.header {
        display: none;
      }

      .cookie-col {
        padding: 10px 16px;
      }

      .cookie-col:first-child {
        padding-top: 14px;
      }

      .cookie-col:last-child {
        padding-bottom: 14px;
      }
    }
  `]
})
export class PublicCookiePolicyComponent {
  currentYear = new Date().getFullYear();
}
