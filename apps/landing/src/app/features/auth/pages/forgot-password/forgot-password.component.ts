import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { ButtonComponent, InputComponent, CardComponent, ToastService } from '@workspace/shared-ui';
import { AuthService } from '@workspace/core';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthLayoutComponent,
    ButtonComponent,
    InputComponent,
    CardComponent
  ],
  template: `
    <app-auth-layout>
      <div class="forgot-container">
        <app-card>
          @if (!emailSent()) {
            <div class="forgot-header">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <h2>Forgot password?</h2>
              <p>No worries, we'll send you reset instructions</p>
            </div>

            <form [formGroup]="forgotForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <app-input
                  label="Email"
                  type="email"
                  placeholder="Enter your email address"
                  formControlName="email"
                  [error]="getFieldError('email')"
                  autocomplete="email"
                ></app-input>
              </div>

              <app-button
                type="submit"
                [block]="true"
                [loading]="isLoading()"
                [disabled]="forgotForm.invalid"
                size="lg"
              >
                Reset Password
              </app-button>
            </form>
          } @else {
            <div class="success-state">
              <div class="icon-wrapper success">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2>Check your email</h2>
              <p>We sent a password reset link to<br/><strong>{{ submittedEmail() }}</strong></p>

              <div class="resend-section">
                <span>Didn't receive the email?</span>
                <button type="button" (click)="resendEmail()" [disabled]="isLoading()">
                  Click to resend
                </button>
              </div>
            </div>
          }

          <div class="back-link">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            <a routerLink="/auth/login">Back to login</a>
          </div>
        </app-card>
      </div>
    </app-auth-layout>
  `,
  styles: [`
    .forgot-container {
      width: 100%;
      max-width: 440px;
    }

    .forgot-header,
    .success-state {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .icon-wrapper {
      width: 56px;
      height: 56px;
      background-color: var(--color-primary-100);
      color: var(--color-primary-600);
      border-radius: var(--radius-full);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto var(--spacing-md);

      &.success {
        background-color: var(--color-success-light);
        color: var(--color-success);
      }
    }

    h2 {
      font-size: var(--font-size-2xl);
      font-weight: var(--font-weight-bold);
      color: var(--text-primary);
      margin: 0 0 var(--spacing-xs) 0;
    }

    p {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      margin: 0;
      line-height: var(--line-height-normal);
    }

    .form-group {
      margin-bottom: var(--spacing-lg);
    }

    .resend-section {
      margin-top: var(--spacing-lg);
      font-size: var(--font-size-sm);
      color: var(--text-secondary);

      button {
        background: none;
        border: none;
        color: var(--color-primary-600);
        font-weight: var(--font-weight-medium);
        cursor: pointer;
        padding: 0;
        margin-left: var(--spacing-xs);

        &:hover:not(:disabled) {
          text-decoration: underline;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }

    .back-link {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid var(--border-light);

      a {
        font-size: var(--font-size-sm);
        color: var(--text-secondary);
        font-weight: var(--font-weight-medium);

        &:hover {
          color: var(--text-primary);
        }
      }

      svg {
        color: var(--text-tertiary);
      }
    }
  `]
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  isLoading = signal(false);
  emailSent = signal(false);
  submittedEmail = signal('');

  forgotForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  getFieldError(field: string): string | undefined {
    const control = this.forgotForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'Email is required';
      if (control.errors['email']) return 'Please enter a valid email';
    }
    return undefined;
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const email = this.forgotForm.value.email;

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.submittedEmail.set(email);
        this.emailSent.set(true);
      },
      error: (error) => {
        this.isLoading.set(false);
        // Still show success to prevent email enumeration
        this.submittedEmail.set(email);
        this.emailSent.set(true);
      }
    });
  }

  resendEmail(): void {
    this.isLoading.set(true);

    this.authService.forgotPassword(this.submittedEmail()).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.toast.success('Reset link sent again', 'Email Sent');
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.success('Reset link sent again', 'Email Sent');
      }
    });
  }
}
