import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-contact',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="badge-dot"></span>
            Get in Touch
          </div>
          <h1 class="hero-title">We'd Love to Hear From You</h1>
          <p class="hero-description">
            Whether you have a question about our platform, need help with your agency, or just want to say hello — our team is ready to help.
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Info Cards Section -->
    <section class="contact-info-section">
      <div class="container">
        <div class="contact-info-grid">
          <!-- Email -->
          <div class="contact-info-card">
            <div class="contact-info-icon blue">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <h3 class="contact-info-title">Email Us</h3>
            <p class="contact-info-highlight">hello&#64;airhoppers.com</p>
            <p class="contact-info-desc">Send us an email and we'll get back to you within 24 hours.</p>
            <a href="mailto:hello@airhoppers.com" class="contact-info-link">
              Send Email
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Phone -->
          <div class="contact-info-card">
            <div class="contact-info-icon green">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3 class="contact-info-title">Call Us</h3>
            <p class="contact-info-highlight">+1 (555) 123-4567</p>
            <p class="contact-info-desc">Available Monday to Friday, 9:00 AM - 6:00 PM EST.</p>
            <a href="tel:+15551234567" class="contact-info-link">
              Call Now
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>

          <!-- Office -->
          <div class="contact-info-card">
            <div class="contact-info-icon purple">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </div>
            <h3 class="contact-info-title">Visit Us</h3>
            <p class="contact-info-highlight">123 Travel Street</p>
            <p class="contact-info-desc">New York, NY 10001, United States.</p>
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" class="contact-info-link">
              Get Directions
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Form Section -->
    <section class="contact-form-section">
      <div class="container">
        <div class="section-header">
          <p class="section-tag">Contact Form</p>
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

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2>Looking for Support Instead?</h2>
          <p>Visit our support page for FAQs, live chat, and detailed documentation to help you get the most out of AirHoppers.</p>
          <div class="cta-buttons">
            <a routerLink="/support" class="btn btn-cta-white btn-lg">
              Visit Support
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a routerLink="/resources" class="btn btn-cta-outline btn-lg">Browse Docs</a>
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
       CONTACT INFO CARDS
       ============================= */
    .contact-info-section {
      padding: 80px 0;
      background: var(--bg-primary);
    }

    .contact-info-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--spacing-lg);
    }

    .contact-info-card {
      background: white;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 32px;
      text-align: center;
      transition: all var(--transition-normal);
    }

    .contact-info-card:hover {
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .contact-info-icon {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px;
    }

    .contact-info-icon.blue {
      background: #eff6ff;
      color: #3b82f6;
    }

    .contact-info-icon.green {
      background: #f0fdf4;
      color: #22c55e;
    }

    .contact-info-icon.purple {
      background: #f5f3ff;
      color: #8b5cf6;
    }

    .contact-info-title {
      font-size: var(--font-size-xl);
      font-weight: var(--font-weight-semibold);
      color: var(--text-primary);
      margin: 0 0 8px;
    }

    .contact-info-highlight {
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-medium);
      color: var(--primary);
      margin: 0 0 8px;
    }

    .contact-info-desc {
      font-size: var(--font-size-base);
      color: var(--text-secondary);
      line-height: 1.6;
      margin: 0 0 20px;
    }

    .contact-info-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-base);
      font-weight: var(--font-weight-semibold);
      color: var(--primary);
      text-decoration: none;
      transition: gap var(--transition-normal);
    }

    .contact-info-link:hover {
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
       CONTACT FORM SECTION
       ============================= */
    .contact-form-section {
      padding: 80px 0;
      background: var(--bg-secondary);
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

      .contact-info-grid {
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

      .contact-info-section,
      .contact-form-section,
      .cta-section {
        padding: 60px 0;
      }

      .section-title {
        font-size: 24px;
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
export class PublicContactComponent {
  private fb = inject(FormBuilder);

  formSubmitted = signal(false);

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    subject: ['', [Validators.required]],
    message: ['', [Validators.required]]
  });

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
