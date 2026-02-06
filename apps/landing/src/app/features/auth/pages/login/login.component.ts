import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { ButtonComponent, InputComponent, ToastService } from '@workspace/shared-ui';
import { AuthService, APP_ENVIRONMENT } from '@workspace/core';

type LoginMethod = 'password' | 'magic-link';
type LoginStep = 'choose-method' | 'password-form' | 'magic-email' | 'verification-code';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthLayoutComponent,
    ButtonComponent,
    InputComponent
  ],
  template: `
    <app-auth-layout>
      <div class="login-container">
        <!-- Progress indicator -->
        @if (currentStep() !== 'choose-method') {
          <div class="progress-bar">
            <div class="progress-fill" [style.width]="progressWidth()"></div>
          </div>
          <button class="back-btn" (click)="goBack()">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Back
          </button>
        }

        <!-- Step: Choose Method -->
        @if (currentStep() === 'choose-method') {
          <div class="step-content animate-in">
            <div class="login-header">
              <h1>Sign in to your account</h1>
              <p>Enter your email to access your travel agency dashboard</p>
            </div>

            <div class="method-cards">
              <button class="method-card recommended" (click)="selectMethod('magic-link')">
                <div class="method-icon magic">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div class="method-content">
                  <div class="method-header">
                    <span class="method-title">Sign in with Email</span>
                    <span class="recommended-badge">Recommended</span>
                  </div>
                  <span class="method-desc">We'll send a verification code to your email. No password needed!</span>
                </div>
                <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>

              <button class="method-card" (click)="selectMethod('password')">
                <div class="method-icon password">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <div class="method-content">
                  <span class="method-title">Sign in with Password</span>
                  <span class="method-desc">Use your email and password to sign in</span>
                </div>
                <svg class="arrow-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </div>

            <div class="divider">
              <span>Or continue with</span>
            </div>

            <div class="social-buttons-grid">
              <button type="button" class="social-btn" (click)="socialLogin('google')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button type="button" class="social-btn" (click)="socialLogin('microsoft')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#F25022" d="M1 1h10v10H1z"/>
                  <path fill="#00A4EF" d="M1 13h10v10H1z"/>
                  <path fill="#7FBA00" d="M13 1h10v10H13z"/>
                  <path fill="#FFB900" d="M13 13h10v10H13z"/>
                </svg>
              </button>
              <button type="button" class="social-btn" (click)="socialLogin('apple')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
              </button>
              <button type="button" class="social-btn" (click)="socialLogin('github')">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>
            </div>

            <div class="signup-prompt">
              <span>Don't have an account?</span>
              <a routerLink="/auth/signup">Sign up for free</a>
            </div>
          </div>
        }

        <!-- Step: Password Form -->
        @if (currentStep() === 'password-form') {
          <div class="step-content animate-in">
            <div class="login-header">
              <div class="header-icon lock-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h1>Sign in with password</h1>
              <p>Enter your email and password to continue</p>
            </div>

            <form [formGroup]="loginForm" (ngSubmit)="onPasswordSubmit()">
              <div class="form-group">
                <label class="field-label">Email Address <span class="required">*</span></label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    type="email"
                    formControlName="email"
                    placeholder="your.email@company.com"
                    class="form-input"
                    autocomplete="email"
                  />
                </div>
                @if (getFieldError('email')) {
                  <span class="field-error">{{ getFieldError('email') }}</span>
                }
              </div>

              <div class="form-group">
                <label class="field-label">Password <span class="required">*</span></label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    [type]="showPassword() ? 'text' : 'password'"
                    formControlName="password"
                    placeholder="Enter your password"
                    class="form-input has-toggle"
                    autocomplete="current-password"
                  />
                  <button type="button" class="toggle-password" (click)="togglePassword()">
                    @if (showPassword()) {
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    } @else {
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    }
                  </button>
                </div>
                @if (getFieldError('password')) {
                  <span class="field-error">{{ getFieldError('password') }}</span>
                }
              </div>

              <div class="forgot-password-link">
                <a routerLink="/auth/forgot-password">Forgot your password?</a>
              </div>

              <button type="submit" class="submit-btn" [disabled]="loginForm.invalid || isLoading()">
                @if (isLoading()) {
                  <div class="spinner"></div>
                  Signing in...
                } @else {
                  Sign In
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                }
              </button>
            </form>
          </div>
        }

        <!-- Step: Magic Link - Enter Email -->
        @if (currentStep() === 'magic-email') {
          <div class="step-content animate-in">
            <div class="login-header">
              <div class="header-icon email-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <h1>What's your email?</h1>
              <p>We'll send you a verification code to sign in</p>
            </div>

            <form [formGroup]="emailForm" (ngSubmit)="submitEmail()">
              <div class="form-group">
                <label class="field-label">Email Address</label>
                <div class="input-wrapper">
                  <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="4" width="20" height="16" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                  <input
                    type="email"
                    formControlName="email"
                    placeholder="your.email@company.com"
                    class="form-input"
                    autocomplete="email"
                  />
                </div>
                @if (getEmailError()) {
                  <span class="field-error">{{ getEmailError() }}</span>
                }
              </div>

              <button type="submit" class="submit-btn" [disabled]="emailForm.invalid || isLoading()">
                @if (isLoading()) {
                  <div class="spinner"></div>
                  Sending code...
                } @else {
                  Send Verification Code
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                }
              </button>
            </form>
          </div>
        }

        <!-- Step: Verification Code -->
        @if (currentStep() === 'verification-code') {
          <div class="step-content animate-in">
            <div class="login-header">
              <div class="header-icon verify-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h1>Check your inbox</h1>
              <p>We sent a 6-character code to <strong>{{ submittedEmail() }}</strong></p>
            </div>

            <div class="verification-form">
              <div class="form-group">
                <label class="field-label">Verification Code</label>
                <div class="code-inputs">
                  @for (i of [0, 1, 2, 3, 4, 5]; track i) {
                    <input
                      type="text"
                      maxlength="1"
                      class="code-input"
                      [class.has-error]="codeError()"
                      [attr.data-index]="i"
                      (input)="onCodeInput($event, i)"
                      (keydown)="onCodeKeydown($event, i)"
                      (paste)="onCodePaste($event)"
                      autocomplete="one-time-code"
                    />
                  }
                </div>
                @if (codeError()) {
                  <span class="field-error">{{ codeError() }}</span>
                }
              </div>

              <button type="button" class="submit-btn" (click)="submitCode()" [disabled]="isLoading()">
                @if (isLoading()) {
                  <div class="spinner"></div>
                  Signing in...
                } @else {
                  Sign In
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  </svg>
                }
              </button>

              <div class="resend-section">
                <span>Didn't receive the code?</span>
                <button type="button" class="resend-btn" (click)="resendCode()" [disabled]="resendCooldown() > 0">
                  @if (resendCooldown() > 0) {
                    Resend in {{ resendCooldown() }}s
                  } @else {
                    Resend Code
                  }
                </button>
              </div>
            </div>
          </div>
        }

        <!-- Footer for non-choose-method steps -->
        @if (currentStep() !== 'choose-method') {
          <div class="signup-prompt">
            <span>Don't have an account?</span>
            <a routerLink="/auth/signup">Sign up for free</a>
          </div>
        }

        <div class="footer-links">
          <a href="#">Privacy Policy</a>
          <span class="dot"></span>
          <a href="#">Terms of Service</a>
          <span class="dot"></span>
          <a href="#">Help Center</a>
        </div>

        <div class="security-badge">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <path d="m9 12 2 2 4-4"/>
          </svg>
          <div class="security-text">
            <strong>Secure Login</strong>
            <span>Your data is protected with enterprise-grade encryption and security measures.</span>
          </div>
        </div>
      </div>
    </app-auth-layout>
  `,
  styles: [`
    .login-container {
      width: 100%;
      max-width: 480px;
    }

    .progress-bar {
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      margin-bottom: 24px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .back-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 12px;
      margin-bottom: 16px;
      background: transparent;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: #f3f4f6;
        color: #374151;
      }
    }

    .step-content {
      animation: slideIn 0.3s ease;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 32px;

      .header-icon {
        width: 64px;
        height: 64px;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 16px;
        color: white;

        &.email-icon {
          background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
        }

        &.verify-icon {
          background: linear-gradient(135deg, #34d399 0%, #10b981 100%);
        }

        &.lock-icon {
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        }
      }

      h1 {
        font-size: 26px;
        font-weight: 700;
        color: #111827;
        margin: 0 0 8px 0;
      }

      p {
        font-size: 15px;
        color: #6b7280;
        margin: 0;
        line-height: 1.5;

        strong {
          color: #374151;
        }
      }
    }

    .method-cards {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }

    .method-card {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 18px 20px;
      background: white;
      border: 2px solid #e5e7eb;
      border-radius: 14px;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;

      &:hover {
        border-color: #FF4E78;
        background: #fff5f7;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 78, 120, 0.15);
      }

      &.recommended {
        border-color: #FF4E78;
        background: linear-gradient(135deg, rgba(255, 147, 112, 0.08) 0%, rgba(255, 78, 120, 0.08) 100%);
      }

      .method-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        flex-shrink: 0;

        &.magic {
          background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
          color: white;
        }

        &.password {
          background: #f3f4f6;
          color: #6b7280;
        }
      }

      .method-content {
        flex: 1;
        display: flex;
        flex-direction: column;

        .method-header {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .method-title {
          display: block;
          font-size: 15px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }

        .recommended-badge {
          font-size: 11px;
          font-weight: 600;
          color: #FF4E78;
          background: rgba(255, 78, 120, 0.1);
          padding: 2px 8px;
          border-radius: 20px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .method-desc {
          display: block;
          font-size: 13px;
          color: #6b7280;
          line-height: 1.4;
        }
      }

      .arrow-icon {
        color: #9ca3af;
        flex-shrink: 0;
        transition: transform 0.2s;
      }

      &:hover .arrow-icon {
        transform: translateX(4px);
        color: #FF4E78;
      }
    }

    .form-group {
      margin-bottom: 20px;
    }

    .field-label {
      display: block;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      margin-bottom: 8px;

      .required {
        color: #ef4444;
      }
    }

    .input-wrapper {
      position: relative;

      .input-icon {
        position: absolute;
        left: 14px;
        top: 50%;
        transform: translateY(-50%);
        color: #9ca3af;
        pointer-events: none;
      }

      .form-input {
        width: 100%;
        padding: 14px 14px 14px 44px;
        border: 1px solid #e5e7eb;
        border-radius: 10px;
        font-size: 15px;
        color: #111827;
        background: white;
        transition: border-color 0.2s, box-shadow 0.2s;
        box-sizing: border-box;

        &.has-toggle {
          padding-right: 48px;
        }

        &::placeholder {
          color: #9ca3af;
        }

        &:focus {
          outline: none;
          border-color: #FF4E78;
          box-shadow: 0 0 0 3px rgba(255, 78, 120, 0.1);
        }
      }

      .toggle-password {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        padding: 4px;
        cursor: pointer;
        color: #9ca3af;
        transition: color 0.2s;

        &:hover {
          color: #6b7280;
        }
      }
    }

    .field-error {
      display: block;
      font-size: 13px;
      color: #ef4444;
      margin-top: 6px;
    }

    .forgot-password-link {
      text-align: right;
      margin-bottom: 24px;
      margin-top: -12px;

      a {
        font-size: 13px;
        color: #FF4E78;
        text-decoration: none;
        font-weight: 500;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .code-inputs {
      display: flex;
      gap: 10px;
      justify-content: center;

      .code-input {
        width: 52px;
        height: 60px;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
        border: 2px solid #e5e7eb;
        border-radius: 12px;
        background: white;
        color: #111827;
        transition: all 0.2s;
        text-transform: uppercase;

        &:focus {
          outline: none;
          border-color: #FF4E78;
          box-shadow: 0 0 0 3px rgba(255, 78, 120, 0.1);
        }

        &:not(:placeholder-shown) {
          border-color: #10b981;
          background: #f0fdf4;
        }

        &.has-error {
          border-color: #ef4444;
          background: #fef2f2;
        }
      }
    }

    .submit-btn {
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border: none;
      border-radius: 10px;
      font-size: 15px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: opacity 0.2s, transform 0.2s;

      &:hover:not(:disabled) {
        opacity: 0.95;
        transform: translateY(-1px);
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .spinner {
        width: 18px;
        height: 18px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .resend-section {
      margin-top: 20px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;

      .resend-btn {
        background: none;
        border: none;
        color: #FF4E78;
        font-weight: 500;
        cursor: pointer;
        margin-left: 4px;

        &:hover:not(:disabled) {
          text-decoration: underline;
        }

        &:disabled {
          color: #9ca3af;
          cursor: not-allowed;
        }
      }
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 24px 0;

      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #e5e7eb;
      }

      span {
        padding: 0 16px;
        font-size: 13px;
        color: #9ca3af;
      }
    }

    .social-buttons-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }

    .social-btn {
      width: 100%;
      padding: 14px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s, border-color 0.2s, transform 0.2s;

      &:hover {
        background: #f9fafb;
        border-color: #d1d5db;
        transform: translateY(-2px);
      }
    }

    .signup-prompt {
      margin-top: 24px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;

      a {
        color: #FF4E78;
        font-weight: 500;
        margin-left: 4px;
        text-decoration: none;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .footer-links {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 24px;

      a {
        font-size: 13px;
        color: #6b7280;
        text-decoration: none;

        &:hover {
          color: #374151;
        }
      }

      .dot {
        width: 3px;
        height: 3px;
        background: #d1d5db;
        border-radius: 50%;
      }
    }

    .security-badge {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      margin-top: 32px;
      padding: 16px;
      background: #e8f4fc;
      border-radius: 10px;

      svg {
        color: #2563eb;
        flex-shrink: 0;
        margin-top: 2px;
      }

      .security-text {
        strong {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #1e3a5f;
          margin-bottom: 2px;
        }

        span {
          font-size: 13px;
          color: #475569;
          line-height: 1.4;
        }
      }
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);
  private env = inject(APP_ENVIRONMENT);

  constructor() {
    // Clear stale tokens from this origin when arriving from cross-app logout
    if (this.route.snapshot.queryParams['logout'] === 'true') {
      this.authService.clearTokens();
    }
  }

  // State
  currentStep = signal<LoginStep>('choose-method');
  selectedMethod = signal<LoginMethod | null>(null);
  isLoading = signal(false);
  showPassword = signal(false);
  submittedEmail = signal('');
  leadId = signal('');
  verificationCode = signal('');
  codeError = signal<string | null>(null);
  resendCooldown = signal(0);

  // Progress calculation
  progressWidth = computed(() => {
    const step = this.currentStep();
    if (step === 'choose-method') return '0%';
    if (step === 'password-form' || step === 'magic-email') return '50%';
    if (step === 'verification-code') return '100%';
    return '0%';
  });

  // Forms
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  selectMethod(method: LoginMethod): void {
    this.selectedMethod.set(method);
    if (method === 'magic-link') {
      this.currentStep.set('magic-email');
    } else {
      this.currentStep.set('password-form');
    }
  }

  goBack(): void {
    const step = this.currentStep();
    if (step === 'password-form' || step === 'magic-email') {
      this.currentStep.set('choose-method');
    } else if (step === 'verification-code') {
      this.currentStep.set('magic-email');
    }
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  getFieldError(field: string): string | undefined {
    const control = this.loginForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) {
        return field === 'email' ? 'Email is required' : 'Password is required';
      }
      if (control.errors['email']) return 'Please enter a valid email';
      if (control.errors['minlength']) return 'Password must be at least 6 characters';
    }
    return undefined;
  }

  getEmailError(): string | undefined {
    const control = this.emailForm.get('email');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email';
    }
    return undefined;
  }

  // Password login
  onPasswordSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.toast.success('Welcome back!', 'Login Successful');
        this.redirectToDashboard();
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toast.error(error.message || 'Invalid email or password', 'Login Failed');
      }
    });
  }

  // Magic link: Submit email
  submitEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const email = this.emailForm.value.email;
    this.submittedEmail.set(email);

    this.authService.createLead(email).subscribe({
      next: (response) => {
        this.leadId.set(response.leadId);
        this.isLoading.set(false);
        this.currentStep.set('verification-code');
        this.startResendCooldown();
        this.toast.success('Verification code sent to your email', 'Check your inbox');
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toast.error(error.error?.message || 'Failed to send verification code', 'Error');
      }
    });
  }

  // Code input handling
  isCodeComplete(): boolean {
    const code = this.verificationCode();
    return code.replace(/\s/g, '').length === 6;
  }

  onCodeInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.toUpperCase();

    if (!/^[A-Z0-9]*$/.test(value)) {
      input.value = '';
      this.updateCodeAtIndex(index, ' ');
      return;
    }

    input.value = value;
    this.updateCodeAtIndex(index, value || ' ');
    this.codeError.set(null);

    if (value && index < 5) {
      const nextInput = document.querySelector(`[data-index="${index + 1}"]`) as HTMLInputElement;
      nextInput?.focus();
    }
  }

  private updateCodeAtIndex(index: number, char: string): void {
    let currentCode = this.verificationCode().padEnd(6, ' ');
    const codeArray = currentCode.split('');
    codeArray[index] = char;
    this.verificationCode.set(codeArray.join(''));
  }

  onCodeKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      const input = event.target as HTMLInputElement;
      if (input.value) {
        this.updateCodeAtIndex(index, ' ');
      } else if (index > 0) {
        const prevInput = document.querySelector(`[data-index="${index - 1}"]`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          prevInput.value = '';
          this.updateCodeAtIndex(index - 1, ' ');
        }
      }
    }
  }

  onCodePaste(event: ClipboardEvent): void {
    event.preventDefault();
    const paste = event.clipboardData?.getData('text') || '';
    const code = paste.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6);

    if (code.length > 0) {
      const paddedCode = code.padEnd(6, ' ');
      this.verificationCode.set(paddedCode);
      this.codeError.set(null);

      for (let i = 0; i < 6; i++) {
        const input = document.querySelector(`[data-index="${i}"]`) as HTMLInputElement;
        if (input) {
          input.value = code[i] || '';
        }
      }

      const focusIndex = Math.min(code.length, 5);
      const focusInput = document.querySelector(`[data-index="${focusIndex}"]`) as HTMLInputElement;
      focusInput?.focus();
    }
  }

  // Submit verification code - calls leadLogin
  submitCode(): void {
    const code = this.verificationCode().replace(/\s/g, '').toUpperCase();
    const leadId = this.leadId();

    if (code.length !== 6) {
      this.codeError.set('Please enter the complete verification code');
      return;
    }

    if (!leadId) {
      this.codeError.set('Session expired. Please start over.');
      return;
    }

    this.isLoading.set(true);
    this.codeError.set(null);

    this.authService.leadLogin({ leadId, code }).subscribe({
      next: () => {
        this.toast.success('Welcome back!', 'Login Successful');
        this.redirectToDashboard();
      },
      error: (error) => {
        this.isLoading.set(false);
        if (error.status === 401 || error.status === 400) {
          this.codeError.set('Invalid or expired verification code. Please try again.');
          this.clearCodeInputs();
        } else {
          this.codeError.set(error.error?.message || 'Failed to sign in');
        }
      }
    });
  }

  // Resend code
  startResendCooldown(): void {
    this.resendCooldown.set(60);
    const interval = setInterval(() => {
      this.resendCooldown.update(v => {
        if (v <= 1) {
          clearInterval(interval);
          return 0;
        }
        return v - 1;
      });
    }, 1000);
  }

  resendCode(): void {
    if (this.resendCooldown() > 0) return;

    this.isLoading.set(true);
    this.authService.createLead(this.submittedEmail()).subscribe({
      next: (response) => {
        this.leadId.set(response.leadId);
        this.isLoading.set(false);
        this.startResendCooldown();
        this.toast.success('New verification code sent', 'Check your inbox');
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toast.error(error.error?.message || 'Failed to resend code', 'Error');
      }
    });
  }

  private clearCodeInputs(): void {
    this.verificationCode.set('      ');
    for (let i = 0; i < 6; i++) {
      const input = document.querySelector(`[data-index="${i}"]`) as HTMLInputElement;
      if (input) input.value = '';
    }
    const firstInput = document.querySelector(`[data-index="0"]`) as HTMLInputElement;
    firstInput?.focus();
  }

  private redirectToDashboard(): void {
    const token = this.authService.getAccessToken();
    const refreshToken = this.authService.getRefreshToken();
    window.location.href = `${this.env.dashboardUrl}/select-agency?token=${encodeURIComponent(token || '')}&refreshToken=${encodeURIComponent(refreshToken || '')}`;
  }

  socialLogin(provider: string): void {
    this.toast.info(`${provider} login coming soon`, 'Social Login');
  }
}
