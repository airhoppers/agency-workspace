import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CardComponent, ButtonComponent, InputComponent, AvatarComponent, LoadingComponent, ModalComponent, ToastService } from '@workspace/shared-ui';
import { AuthService } from '@workspace/core';
import { User } from '@workspace/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CardComponent, ButtonComponent, InputComponent, AvatarComponent, LoadingComponent, ModalComponent],
  template: `
    <div class="profile-page">
      <div class="page-header">
        <div>
          <h1>My Profile</h1>
          <p>Manage your personal information and security settings</p>
        </div>
      </div>

      @if (isLoading()) {
        <div class="loading-container">
          <app-loading size="lg" text="Loading profile..."></app-loading>
        </div>
      } @else {
        <div class="profile-layout">
          <!-- Profile Information -->
          <app-card title="Personal Information" [showHeader]="true">
            <div class="profile-header">
              <div class="avatar-section">
                <app-avatar
                  [name]="user()?.firstName + ' ' + user()?.lastName"
                  [src]="user()?.profileImageUrl"
                  size="xl"
                ></app-avatar>
                <div class="avatar-actions">
                  <input type="file" accept="image/*" (change)="onAvatarSelected($event)" id="avatarInput" hidden />
                  <label for="avatarInput" class="upload-btn">Change Photo</label>
                  @if (user()?.profileImageUrl) {
                    <button class="remove-btn" (click)="removeAvatar()">Remove</button>
                  }
                </div>
              </div>
              <div class="user-meta">
                <span class="email">{{ user()?.email }}</span>
                <span class="joined">Member since {{ formatDate(user()?.createdAt) }}</span>
              </div>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
              <div class="form-row">
                <div class="form-group">
                  <app-input
                    label="First Name"
                    placeholder="Your first name"
                    formControlName="firstName"
                    [error]="getProfileError('firstName')"
                    [required]="true"
                  ></app-input>
                </div>
                <div class="form-group">
                  <app-input
                    label="Last Name"
                    placeholder="Your last name"
                    formControlName="lastName"
                    [error]="getProfileError('lastName')"
                    [required]="true"
                  ></app-input>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <app-input
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    formControlName="phoneNumber"
                  ></app-input>
                </div>
                <div class="form-group">
                  <label class="input-label">Language Preference</label>
                  <select formControlName="language" class="select-field">
                    <option value="en">English</option>
                    <option value="sq">Albanian</option>
                    <option value="de">German</option>
                    <option value="fr">French</option>
                    <option value="it">Italian</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
              </div>

              <div class="form-actions">
                <app-button type="submit" [loading]="isSavingProfile()" [disabled]="profileForm.invalid || profileForm.pristine">
                  Save Changes
                </app-button>
              </div>
            </form>
          </app-card>

          <!-- Email Settings -->
          <app-card title="Email Address" [showHeader]="true">
            <div class="email-section">
              <div class="current-email">
                <div class="email-info">
                  <span class="label">Current Email</span>
                  <span class="value">{{ user()?.email }}</span>
                </div>
                @if (user()?.emailVerified) {
                  <span class="verified-badge">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    Verified
                  </span>
                } @else {
                  <app-button size="sm" variant="ghost" (onClick)="resendVerification()">
                    Verify Email
                  </app-button>
                }
              </div>

              <app-button variant="secondary" (onClick)="openChangeEmailModal()">
                Change Email Address
              </app-button>
            </div>
          </app-card>

          <!-- Security Settings -->
          <app-card title="Security" [showHeader]="true">
            <div class="security-section">
              <div class="security-item">
                <div class="security-info">
                  <h4>Password</h4>
                  <p>Change your password to keep your account secure</p>
                </div>
                <app-button variant="secondary" (onClick)="openChangePasswordModal()">
                  Change Password
                </app-button>
              </div>

              <div class="security-item">
                <div class="security-info">
                  <h4>Two-Factor Authentication</h4>
                  <p>Add an extra layer of security to your account</p>
                </div>
                <app-button variant="secondary" [disabled]="true">
                  Coming Soon
                </app-button>
              </div>

              <div class="security-item">
                <div class="security-info">
                  <h4>Active Sessions</h4>
                  <p>Manage devices where you're currently logged in</p>
                </div>
                <app-button variant="ghost" (onClick)="viewSessions()">
                  View Sessions
                </app-button>
              </div>
            </div>
          </app-card>

          <!-- Notifications -->
          <app-card title="Notifications" [showHeader]="true">
            <div class="notifications-section">
              <div class="notification-item">
                <div class="notification-info">
                  <span class="title">Email Notifications</span>
                  <span class="description">Receive email updates about your bookings</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" [checked]="emailNotifications()" (change)="toggleEmailNotifications()" />
                  <span class="slider"></span>
                </label>
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <span class="title">Marketing Emails</span>
                  <span class="description">Receive news and promotional offers</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" [checked]="marketingEmails()" (change)="toggleMarketingEmails()" />
                  <span class="slider"></span>
                </label>
              </div>

              <div class="notification-item">
                <div class="notification-info">
                  <span class="title">New Booking Alerts</span>
                  <span class="description">Get notified when you receive a new booking</span>
                </div>
                <label class="toggle">
                  <input type="checkbox" [checked]="bookingAlerts()" (change)="toggleBookingAlerts()" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </app-card>

          <!-- Danger Zone -->
          <app-card title="Account" [showHeader]="true" class="danger-card">
            <div class="danger-section">
              <div class="danger-item">
                <div class="danger-info">
                  <h4>Delete Account</h4>
                  <p>Permanently delete your account and all associated data. This action cannot be undone.</p>
                </div>
                <app-button variant="danger" (onClick)="confirmDeleteAccount()">
                  Delete Account
                </app-button>
              </div>
            </div>
          </app-card>
        </div>
      }
    </div>

    <!-- Change Password Modal -->
    <app-modal
      [isOpen]="showPasswordModal()"
      title="Change Password"
      size="sm"
      [showFooter]="true"
      (closed)="closePasswordModal()"
    >
      <form [formGroup]="passwordForm">
        <div class="form-group">
          <app-input
            label="Current Password"
            type="password"
            placeholder="Enter current password"
            formControlName="currentPassword"
            [error]="getPasswordError('currentPassword')"
            [required]="true"
          ></app-input>
        </div>
        <div class="form-group">
          <app-input
            label="New Password"
            type="password"
            placeholder="Enter new password"
            formControlName="newPassword"
            [error]="getPasswordError('newPassword')"
            [required]="true"
          ></app-input>
        </div>
        <div class="form-group">
          <app-input
            label="Confirm New Password"
            type="password"
            placeholder="Confirm new password"
            formControlName="confirmPassword"
            [error]="getPasswordError('confirmPassword')"
            [required]="true"
          ></app-input>
        </div>
      </form>

      <div modal-footer>
        <app-button variant="ghost" (onClick)="closePasswordModal()">Cancel</app-button>
        <app-button [loading]="isChangingPassword()" [disabled]="passwordForm.invalid" (onClick)="changePassword()">
          Update Password
        </app-button>
      </div>
    </app-modal>

    <!-- Change Email Modal -->
    <app-modal
      [isOpen]="showEmailModal()"
      title="Change Email Address"
      size="sm"
      [showFooter]="true"
      (closed)="closeEmailModal()"
    >
      <form [formGroup]="emailForm">
        <div class="form-group">
          <app-input
            label="New Email Address"
            type="email"
            placeholder="Enter new email"
            formControlName="email"
            [error]="getEmailError('email')"
            [required]="true"
          ></app-input>
        </div>
        <div class="form-group">
          <app-input
            label="Password"
            type="password"
            placeholder="Enter your password to confirm"
            formControlName="password"
            [error]="getEmailError('password')"
            [required]="true"
          ></app-input>
        </div>
      </form>

      <div modal-footer>
        <app-button variant="ghost" (onClick)="closeEmailModal()">Cancel</app-button>
        <app-button [loading]="isChangingEmail()" [disabled]="emailForm.invalid" (onClick)="changeEmail()">
          Update Email
        </app-button>
      </div>
    </app-modal>
  `,
  styles: [`
    .profile-page {
      max-width: 800px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: var(--spacing-xl);

      h1 {
        font-size: var(--font-size-3xl);
        font-weight: var(--font-weight-bold);
        color: var(--text-primary);
        margin: 0 0 var(--spacing-xs) 0;
      }

      p {
        font-size: var(--font-size-base);
        color: var(--text-secondary);
        margin: 0;
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      padding: var(--spacing-2xl);
    }

    .profile-layout {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-lg);
    }

    .profile-header {
      display: flex;
      gap: var(--spacing-lg);
      padding-bottom: var(--spacing-lg);
      margin-bottom: var(--spacing-lg);
      border-bottom: 1px solid var(--border-light);

      @media (max-width: 600px) {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
    }

    .avatar-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .avatar-actions {
      display: flex;
      gap: var(--spacing-xs);

      .upload-btn, .remove-btn {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: var(--font-size-xs);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
      }

      .upload-btn {
        background-color: var(--bg-secondary);
        border: 1px solid var(--border-default);
        color: var(--text-primary);

        &:hover {
          background-color: var(--bg-tertiary);
        }
      }

      .remove-btn {
        background: none;
        border: none;
        color: var(--text-tertiary);

        &:hover {
          color: var(--color-error);
        }
      }
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: var(--spacing-xs);

      .email {
        font-size: var(--font-size-lg);
        font-weight: var(--font-weight-medium);
        color: var(--text-primary);
      }

      .joined {
        font-size: var(--font-size-sm);
        color: var(--text-tertiary);
      }
    }

    .form-group {
      margin-bottom: var(--spacing-md);
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--spacing-md);

      @media (max-width: 600px) {
        grid-template-columns: 1fr;
      }
    }

    .input-label {
      display: block;
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);
      margin-bottom: var(--spacing-xs);
    }

    .select-field {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      cursor: pointer;

      &:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-md);
      border-top: 1px solid var(--border-light);
    }

    .email-section {
      .current-email {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-md);
        background-color: var(--bg-secondary);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);

        .email-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);

          .label {
            font-size: var(--font-size-xs);
            color: var(--text-tertiary);
          }

          .value {
            font-size: var(--font-size-base);
            font-weight: var(--font-weight-medium);
            color: var(--text-primary);
          }
        }

        .verified-badge {
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
          font-size: var(--font-size-sm);
          color: var(--color-success);
        }
      }
    }

    .security-section {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .security-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md);
      background-color: var(--bg-secondary);
      border-radius: var(--radius-md);

      @media (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--spacing-sm);
      }

      .security-info {
        h4 {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xs) 0;
        }

        p {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0;
        }
      }
    }

    .notifications-section {
      display: flex;
      flex-direction: column;
    }

    .notification-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-md) 0;
      border-bottom: 1px solid var(--border-light);

      &:last-child {
        border-bottom: none;
      }

      .notification-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);

        .title {
          font-size: var(--font-size-sm);
          font-weight: var(--font-weight-medium);
          color: var(--text-primary);
        }

        .description {
          font-size: var(--font-size-xs);
          color: var(--text-tertiary);
        }
      }
    }

    .toggle {
      position: relative;
      display: inline-block;
      width: 44px;
      height: 24px;

      input {
        opacity: 0;
        width: 0;
        height: 0;

        &:checked + .slider {
          background-color: var(--color-primary-500);

          &:before {
            transform: translateX(20px);
          }
        }
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--bg-tertiary);
        transition: var(--transition-fast);
        border-radius: 24px;

        &:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: var(--transition-fast);
          border-radius: 50%;
        }
      }
    }

    .danger-card {
      ::ng-deep .card-header {
        color: var(--color-error);
      }
    }

    .danger-section {
      .danger-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-md);

        @media (max-width: 600px) {
          flex-direction: column;
          align-items: flex-start;
        }
      }

      .danger-info {
        h4 {
          font-size: var(--font-size-base);
          font-weight: var(--font-weight-semibold);
          color: var(--text-primary);
          margin: 0 0 var(--spacing-xs) 0;
        }

        p {
          font-size: var(--font-size-sm);
          color: var(--text-secondary);
          margin: 0;
        }
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  isLoading = signal(false);
  isSavingProfile = signal(false);
  isChangingPassword = signal(false);
  isChangingEmail = signal(false);
  user = signal<User | null>(null);

  showPasswordModal = signal(false);
  showEmailModal = signal(false);

  emailNotifications = signal(true);
  marketingEmails = signal(false);
  bookingAlerts = signal(true);

  profileForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    phoneNumber: [''],
    language: ['en']
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required]]
  });

  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user.set(currentUser);
      this.profileForm.patchValue({
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        phoneNumber: currentUser.phoneNumber || '',
        language: currentUser.language || 'en'
      });
    }
  }

  getProfileError(field: string): string | undefined {
    const control = this.profileForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) return 'Value is too short';
    }
    return undefined;
  }

  getPasswordError(field: string): string | undefined {
    const control = this.passwordForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['minlength']) return 'Password must be at least 8 characters';
    }
    if (field === 'confirmPassword' && this.passwordForm.get('newPassword')?.value !== control?.value) {
      return 'Passwords do not match';
    }
    return undefined;
  }

  getEmailError(field: string): string | undefined {
    const control = this.emailForm.get(field);
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'This field is required';
      if (control.errors['email']) return 'Invalid email address';
    }
    return undefined;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.toast.info('Profile photo upload will be implemented');
    }
  }

  removeAvatar(): void {
    this.toast.info('Remove avatar functionality will be implemented');
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;

    this.isSavingProfile.set(true);
    // This would call an API to update user profile
    setTimeout(() => {
      const updatedUser = { ...this.user(), ...this.profileForm.value };
      this.user.set(updatedUser as User);
      this.isSavingProfile.set(false);
      this.profileForm.markAsPristine();
      this.toast.success('Profile updated successfully');
    }, 1000);
  }

  openChangePasswordModal(): void {
    this.showPasswordModal.set(true);
  }

  closePasswordModal(): void {
    this.showPasswordModal.set(false);
    this.passwordForm.reset();
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;

    if (this.passwordForm.get('newPassword')?.value !== this.passwordForm.get('confirmPassword')?.value) {
      this.toast.error('Passwords do not match');
      return;
    }

    this.isChangingPassword.set(true);
    // This would call an API to change password
    setTimeout(() => {
      this.isChangingPassword.set(false);
      this.closePasswordModal();
      this.toast.success('Password changed successfully');
    }, 1000);
  }

  openChangeEmailModal(): void {
    this.showEmailModal.set(true);
  }

  closeEmailModal(): void {
    this.showEmailModal.set(false);
    this.emailForm.reset();
  }

  changeEmail(): void {
    if (this.emailForm.invalid) return;

    this.isChangingEmail.set(true);
    // This would call an API to change email
    setTimeout(() => {
      this.isChangingEmail.set(false);
      this.closeEmailModal();
      this.toast.success('Verification email sent to new address');
    }, 1000);
  }

  resendVerification(): void {
    this.toast.info('Verification email sent');
  }

  viewSessions(): void {
    this.toast.info('Sessions view will be implemented');
  }

  toggleEmailNotifications(): void {
    this.emailNotifications.update(v => !v);
    this.toast.success('Notification settings updated');
  }

  toggleMarketingEmails(): void {
    this.marketingEmails.update(v => !v);
    this.toast.success('Notification settings updated');
  }

  toggleBookingAlerts(): void {
    this.bookingAlerts.update(v => !v);
    this.toast.success('Notification settings updated');
  }

  confirmDeleteAccount(): void {
    this.toast.warning('Account deletion requires additional confirmation');
  }

  formatDate(dateStr?: string): string {
    if (!dateStr) return 'Unknown';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }
}
