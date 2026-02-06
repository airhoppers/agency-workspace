import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthLayoutComponent } from '../../components/auth-layout/auth-layout.component';
import { ButtonComponent, InputComponent, CardComponent, ToastService, LoadingComponent } from '@workspace/shared-ui';
import { AuthService } from '@workspace/core';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    AuthLayoutComponent,
    ButtonComponent,
    InputComponent,
    CardComponent,
    LoadingComponent
  ],
  template: `
    <app-auth-layout>
      <div class="reset-container">
        <app-card>
          @if (isValidating()) {
            <div class="loading-state">
              <app-loading size="lg" text="Validating your link..."></app-loading>
            </div>
          } @else if (invalidToken()) {
            <div class="error-state">
              <div class="icon-wrapper error">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <h2>Invalid or Expired Link</h2>
              <p>This password reset link is invalid or has expired. Please request a new one.</p>

              <app-button
                [block]="true"
                size="lg"
                routerLink="/auth/forgot-password"
              >
                Request New Link
              </app-button>
            </div>
          } @else if (resetSuccess()) {
            <div class="success-state">
              <div class="icon-wrapper success">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2>Password Reset!</h2>
              <p>Your password has been successfully reset. You can now sign in with your new password.</p>

              <app-button
                [block]="true"
                size="lg"
                routerLink="/auth/login"
              >
                Continue to Login
              </app-button>
            </div>
          } @else {
            <div class="reset-header">
              <div class="icon-wrapper">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
                </svg>
              </div>
              <h2>Set new password</h2>
              <p>Your new password must be different from previously used passwords</p>
            </div>

            <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
              <div class="form-group">
                <app-input
                  label="New Password"
                  type="password"
                  placeholder="Enter new password"
                  formControlName="password"
                  [error]="getFieldError('password')"
                  autocomplete="new-password"
                ></app-input>
              </div>

              <div class="form-group">
                <app-input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm new password"
                  formControlName="confirmPassword"
                  [error]="getFieldError('confirmPassword')"
                  autocomplete="new-password"
                ></app-input>
              </div>

              <app-button
                type="submit"
                [block]="true"
                [loading]="isLoading()"
                [disabled]="resetForm.invalid"
                size="lg"
              >
                Reset Password
              </app-button>
            </form>
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
    .reset-container {
      width: 100%;
      max-width: 440px;
    }

    .reset-header,
    .success-state,
    .error-state,
    .loading-state {
      text-align: center;
      margin-bottom: var(--spacing-xl);
    }

    .loading-state {
      padding: var(--spacing-2xl) 0;
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

      &.error {
        background-color: var(--color-error-light);
        color: var(--color-error);
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
      margin: 0 0 var(--spacing-lg) 0;
      line-height: var(--line-height-normal);
    }

    .form-group {
      margin-bottom: var(--spacing-md);
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
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private toast = inject(ToastService);

  isLoading = signal(false);
  isValidating = signal(true);
  invalidToken = signal(false);
  resetSuccess = signal(false);
  token = '';

  resetForm: FormGroup = this.fb.group({
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParams['token'] || '';

    if (!this.token) {
      this.isValidating.set(false);
      this.invalidToken.set(true);
      return;
    }

    this.authService.validateResetToken(this.token).subscribe({
      next: (response) => {
        this.isValidating.set(false);
        if (!response.valid) {
          this.invalidToken.set(true);
        }
      },
      error: () => {
        this.isValidating.set(false);
        this.invalidToken.set(true);
      }
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  getFieldError(field: string): string | undefined {
    const control = this.resetForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return `${field === 'password' ? 'Password' : 'Confirm password'} is required`;
      if (control.errors['minlength']) return 'Password must be at least 8 characters';
      if (control.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return undefined;
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);

    this.authService.resetPassword(this.token, this.resetForm.value.password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.resetSuccess.set(true);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toast.error(error.message || 'Failed to reset password', 'Reset Failed');
      }
    });
  }
}
