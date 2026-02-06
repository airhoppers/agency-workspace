import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-support',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            We're Here to Help
          </div>
          <h1 class="hero-title">How Can We Help?</h1>
          <p class="hero-description">
            Get in touch with our team or find answers in our help center
          </p>
        </div>
      </div>
    </section>

    <!-- Quick Help Cards Section -->
    <section class="quick-help-section">
      <div class="container">
        <div class="quick-help-grid">
          <!-- Email Support -->
          <div class="quick-help-card">
            <div class="quick-help-icon blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3 class="quick-help-title">Email Support</h3>
            <p class="quick-help-email">support&#64;airhoppers.com</p>
            <p class="quick-help-desc">Send us an email and we'll respond within 24 hours.</p>
            <a href="mailto:support@airhoppers.com" class="quick-help-link">
              Send Email
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Help Center -->
          <div class="quick-help-card">
            <div class="quick-help-icon purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
            </div>
            <h3 class="quick-help-title">Help Center</h3>
            <p class="quick-help-email">24/7 Self-Service</p>
            <p class="quick-help-desc">Browse our knowledge base for instant answers to common questions.</p>
            <a routerLink="/resources" class="quick-help-link">
              Visit Help Center
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
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
          <p class="section-description">Find quick answers to common questions</p>
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

    <!-- Contact Form Section -->
    <section class="contact-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Get in Touch</p>
          <h2 class="section-title">Send Us a Message</h2>
          <p class="section-description">Fill out the form below and we'll get back to you within 24 hours</p>
        </div>

        <div class="contact-form-card">
          @if (formSubmitted()) {
            <div class="success-message">
              <div class="success-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3 class="success-title">Your message has been sent!</h3>
              <p class="success-desc">We'll get back to you within 24 hours.</p>
              <button type="button" class="btn btn-outline" (click)="resetForm()">Send Another Message</button>
            </div>
          } @else {
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
              <div class="form-row">
                <div class="form-group">
                  <label for="name">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    formControlName="name"
                    placeholder="Your full name"
                    [class.error]="contactForm.get('name')?.invalid && contactForm.get('name')?.touched"
                  />
                  @if (contactForm.get('name')?.invalid && contactForm.get('name')?.touched) {
                    <span class="error-text">Full name is required</span>
                  }
                </div>
                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    formControlName="email"
                    placeholder="your@email.com"
                    [class.error]="contactForm.get('email')?.invalid && contactForm.get('email')?.touched"
                  />
                  @if (contactForm.get('email')?.touched && contactForm.get('email')?.hasError('required')) {
                    <span class="error-text">Email address is required</span>
                  }
                  @if (contactForm.get('email')?.touched && contactForm.get('email')?.hasError('email') && !contactForm.get('email')?.hasError('required')) {
                    <span class="error-text">Please enter a valid email address</span>
                  }
                </div>
              </div>

              <div class="form-group">
                <label for="subject">Subject</label>
                <select
                  id="subject"
                  formControlName="subject"
                  [class.error]="contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched"
                  [class.placeholder]="contactForm.get('subject')?.value === ''"
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing Question</option>
                  <option value="partnership">Partnership Inquiry</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
                @if (contactForm.get('subject')?.invalid && contactForm.get('subject')?.touched) {
                  <span class="error-text">Please select a subject</span>
                }
              </div>

              <div class="form-group">
                <label for="message">Message</label>
                <textarea
                  id="message"
                  formControlName="message"
                  placeholder="How can we help you?"
                  rows="5"
                  [class.error]="contactForm.get('message')?.invalid && contactForm.get('message')?.touched"
                ></textarea>
                @if (contactForm.get('message')?.invalid && contactForm.get('message')?.touched) {
                  <span class="error-text">Message is required</span>
                }
              </div>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary btn-lg btn-submit" [disabled]="contactForm.invalid">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="22" y1="2" x2="11" y2="13"/>
                    <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                  Send Message
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </section>

    <!-- Business Hours & Info Section -->
    <section class="info-section">
      <div class="container">
        <div class="info-grid">
          <!-- Business Hours -->
          <div class="info-card">
            <div class="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <h3 class="info-card-title">Business Hours</h3>
            <div class="info-card-content">
              <div class="info-row">
                <span class="info-label">Mon - Fri</span>
                <span class="info-value">9:00 AM - 6:00 PM EST</span>
              </div>
              <div class="info-row">
                <span class="info-label">Saturday</span>
                <span class="info-value">10:00 AM - 2:00 PM EST</span>
              </div>
              <div class="info-row">
                <span class="info-label">Sunday</span>
                <span class="info-value closed">Closed</span>
              </div>
            </div>
          </div>

          <!-- Response Times -->
          <div class="info-card">
            <div class="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h3 class="info-card-title">Response Times</h3>
            <div class="info-card-content">
              <div class="info-row">
                <span class="info-label">Email</span>
                <span class="info-value">Within 24 hours</span>
              </div>
              <div class="info-row">
                <span class="info-label">Live Chat</span>
                <span class="info-value">Under 5 minutes</span>
              </div>
              <div class="info-row">
                <span class="info-label">Phone</span>
                <span class="info-value">Under 2 minutes</span>
              </div>
            </div>
          </div>

          <!-- Office Location -->
          <div class="info-card">
            <div class="info-card-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 class="info-card-title">Office Location</h3>
            <div class="info-card-content">
              <p class="info-address">AirHoppers HQ</p>
              <p class="info-address">123 Travel Street</p>
              <p class="info-address">New York, NY 10001</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Still Need Help?</h2>
          <p>Our team is always ready to assist you. Browse our resources or check our pricing plans for more information about our platform.</p>
          <div class="cta-buttons">
            <a routerLink="/resources" class="btn btn-cta-white btn-lg">
              Browse Resources
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/pricing" class="btn btn-cta-outline btn-lg">View Pricing</a>
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
      color: white;
    }

    .btn-primary:hover {
      background: var(--coral-700);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary:disabled:hover {
      background: var(--primary);
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
       QUICK HELP CARDS
       ============================= */
    .quick-help-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .quick-help-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--spacing-lg);
      max-width: 800px;
      margin: 0 auto;
    }

    .quick-help-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      transition: all var(--transition-normal);
    }

    .quick-help-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .quick-help-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .quick-help-icon.blue {
      background: #eff6ff;
      color: #3b82f6;
    }

    .quick-help-icon.green {
      background: #f0fdf4;
      color: #22c55e;
    }

    .quick-help-icon.purple {
      background: #f5f3ff;
      color: #8b5cf6;
    }

    .quick-help-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .quick-help-email {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--primary);
      margin: 0 0 8px;
    }

    .quick-help-desc {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 20px;
    }

    .quick-help-link,
    .quick-help-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--primary);
      text-decoration: none;
      background: none;
      border: none;
      cursor: pointer;
      transition: gap var(--transition-normal);
    }

    .quick-help-link:hover,
    .quick-help-btn:hover {
      gap: 10px;
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
       FAQ SECTION
       ============================= */
    .faq-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .faq-list {
      max-width: 760px;
      margin: 0 auto;
    }

    .faq-item {
      background: white;
      border-radius: 12px;
      border: 1px solid var(--border);
      margin-bottom: 12px;
      overflow: hidden;
    }

    .faq-question {
      width: 100%;
      padding: 20px 24px;
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
      gap: var(--spacing-md);
    }

    .faq-question:hover {
      color: var(--primary);
    }

    .faq-icon {
      transition: transform var(--transition-normal);
      color: var(--text-secondary);
      flex-shrink: 0;
    }

    .faq-item.open .faq-icon {
      transform: rotate(180deg);
    }

    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height var(--transition-slow, 0.3s ease);
    }

    .faq-item.open .faq-answer {
      max-height: 300px;
    }

    .faq-answer p {
      padding: 0 24px 20px;
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
    }

    /* =============================
       CONTACT FORM SECTION
       ============================= */
    .contact-section {
      padding: 80px 0;
      background: white;
    }

    .contact-form-card {
      max-width: 720px;
      margin: 0 auto;
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 40px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-lg);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .form-group label {
      display: block;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: 8px;
    }

    .form-group input,
    .form-group textarea,
    .form-group select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      font-size: 15px;
      color: #111827;
      background: white;
      transition: all 0.2s;
      font-family: inherit;
    }

    .form-group input::placeholder,
    .form-group textarea::placeholder {
      color: #9ca3af;
    }

    .form-group select.placeholder {
      color: #9ca3af;
    }

    .form-group input:focus,
    .form-group textarea:focus,
    .form-group select:focus {
      outline: none;
      border-color: #FF4E78;
      box-shadow: 0 0 0 3px rgba(255, 78, 120, 0.1);
    }

    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
      border-color: #ef4444;
    }

    .form-group input.error:focus,
    .form-group textarea.error:focus,
    .form-group select.error:focus {
      border-color: #ef4444;
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }

    .form-group textarea {
      resize: vertical;
      min-height: 120px;
    }

    .form-group select {
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 16px center;
      padding-right: 44px;
    }

    .error-text {
      display: block;
      font-size: 13px;
      color: #ef4444;
      margin-top: 6px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
    }

    .btn-submit {
      padding: 14px 32px;
    }

    /* Success Message */
    .success-message {
      text-align: center;
      padding: 40px 20px;
    }

    .success-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: #f0fdf4;
      color: #22c55e;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .success-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .success-desc {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      margin: 0 0 24px;
    }

    /* =============================
       BUSINESS HOURS & INFO
       ============================= */
    .info-section {
      padding: 80px 0;
      background: var(--bg-secondary);
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .info-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 24px;
    }

    .info-card-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      background: var(--coral-100, #fff1f2);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
    }

    .info-card-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 16px;
    }

    .info-card-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-label {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
    }

    .info-value {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
    }

    .info-value.closed {
      color: #ef4444;
    }

    .info-address {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.7;
      margin: 0;
    }

    .info-address:first-child {
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
    }

    /* =============================
       CTA SECTION
       ============================= */
    .cta-section {
      padding: 80px 0;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
    }

    .cta-content {
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
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
    }

    .btn-cta-white:hover {
      background: #fff1f2;
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

      .quick-help-grid {
        grid-template-columns: 1fr;
        max-width: 480px;
        margin: 0 auto;
      }

      .info-grid {
        grid-template-columns: 1fr;
        max-width: 480px;
        margin: 0 auto;
      }

      .section-title {
        font-size: 28px;
      }

      .form-row {
        grid-template-columns: 1fr;
        gap: 0;
      }

      .contact-form-card {
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

      .quick-help-section,
      .faq-section,
      .contact-section,
      .info-section,
      .cta-section {
        padding: 60px 0;
      }

      .section-title {
        font-size: 24px;
      }

      .faq-question {
        font-size: 14px;
        padding: 16px 20px;
      }

      .faq-answer p {
        padding: 0 20px 16px;
        font-size: var(--font-size-sm);
      }

      .contact-form-card {
        padding: 24px 20px;
        border-radius: 12px;
      }

      .form-actions {
        justify-content: stretch;
      }

      .btn-submit {
        width: 100%;
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
export class PublicSupportComponent {
  private fb = inject(FormBuilder);

  openFaq = signal<number | null>(null);
  formSubmitted = signal(false);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]]
  });

  faqs = [
    {
      question: 'How do I create a travel package?',
      answer: 'To create a travel package, navigate to your agency dashboard and click on "Packages" in the sidebar. Then click "Create Package" and fill in the details including title, description, itinerary, pricing, and images. Once you\'re satisfied, publish the package to make it visible to travelers.'
    },
    {
      question: 'How long does agency verification take?',
      answer: 'Most agency verifications are completed within 24 hours. The process involves submitting your business registration documents and completing an identity verification (KYC) check. Our automated system powered by Persona makes the process quick and seamless.'
    },
    {
      question: 'How do I manage bookings?',
      answer: 'You can manage all your bookings from the "Bookings" section in your agency dashboard. Here you can view new booking requests, confirm or decline bookings, communicate with travelers, and track payment status. You\'ll also receive real-time notifications for new bookings.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'AirHoppers supports multiple payment methods including credit/debit cards (Visa, Mastercard, Amex), bank transfers, and digital wallets. Payments are processed securely through our integrated payment system with support for multiple currencies.'
    },
    {
      question: 'How do I update my agency profile?',
      answer: 'To update your agency profile, go to Settings in your dashboard and select "Agency Profile." From there, you can update your agency name, description, logo, cover image, contact information, and social media links. Changes are reflected immediately on your public profile.'
    },
    {
      question: 'Can I have multiple agency profiles?',
      answer: 'Currently, each account is associated with one agency profile. If you operate multiple travel brands, you would need separate accounts for each. Contact our support team if you have special requirements, and we\'ll be happy to discuss solutions.'
    },
    {
      question: 'How do I contact customer support?',
      answer: 'You can reach our support team through multiple channels: live chat (available Mon-Fri, 9AM-6PM EST), email at support@airhoppers.com, or by filling out the contact form on this page. For urgent issues, live chat provides the fastest response time.'
    },
    {
      question: 'What are the platform fees?',
      answer: 'AirHoppers charges a small commission on each booking processed through the platform. The exact fee depends on your subscription plan. We offer competitive rates starting from 5% for our Basic plan, with lower rates available on Professional and Enterprise plans. Visit our Pricing page for full details.'
    }
  ];

  toggleFaq(index: number): void {
    this.openFaq.update(current => current === index ? null : index);
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.formSubmitted.set(true);
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        const control = this.contactForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.contactForm.reset({ name: '', email: '', subject: '', message: '' });
    this.formSubmitted.set(false);
  }
}
