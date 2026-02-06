import { Component, Input, forwardRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  template: `
    <div class="input-wrapper" [class.has-error]="error" [class.disabled]="disabled">
      @if (label) {
        <label [for]="inputId" class="input-label">
          {{ label }}
          @if (required) {
            <span class="required">*</span>
          }
        </label>
      }

      <div class="input-container">
        @if (prefixIcon) {
          <span class="input-icon prefix" [innerHTML]="prefixIcon"></span>
        }

        @if (type === 'textarea') {
          <textarea
            [id]="inputId"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [rows]="rows"
            [value]="value"
            (input)="onInput($event)"
            (blur)="onBlur()"
            class="input-field textarea"
          ></textarea>
        } @else {
          <input
            [id]="inputId"
            [type]="actualType()"
            [placeholder]="placeholder"
            [disabled]="disabled"
            [autocomplete]="autocomplete"
            [value]="value"
            (input)="onInput($event)"
            (blur)="onBlur()"
            class="input-field"
          />
        }

        @if (type === 'password') {
          <button
            type="button"
            class="toggle-password"
            (click)="togglePassword()"
            tabindex="-1"
          >
            @if (showPassword()) {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            }
          </button>
        }

        @if (suffixIcon && type !== 'password') {
          <span class="input-icon suffix" [innerHTML]="suffixIcon"></span>
        }
      </div>

      @if (error) {
        <span class="error-message">{{ error }}</span>
      }

      @if (hint && !error) {
        <span class="hint-message">{{ hint }}</span>
      }
    </div>
  `,
  styles: [`
    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
      width: 100%;
    }

    .input-label {
      font-size: var(--font-size-sm);
      font-weight: var(--font-weight-medium);
      color: var(--text-primary);

      .required {
        color: var(--color-error);
        margin-left: 2px;
      }
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    .input-field {
      width: 100%;
      padding: var(--spacing-sm) var(--spacing-md);
      font-family: var(--font-family-base);
      font-size: var(--font-size-sm);
      color: var(--text-primary);
      background-color: var(--bg-primary);
      border: 1px solid var(--border-default);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);

      &::placeholder {
        color: var(--text-tertiary);
      }

      &:hover:not(:disabled) {
        border-color: var(--border-dark);
      }

      &:focus {
        outline: none;
        border-color: var(--border-focus);
        box-shadow: 0 0 0 3px var(--color-primary-100);
      }

      &:disabled {
        background-color: var(--bg-tertiary);
        cursor: not-allowed;
      }

      &.textarea {
        resize: vertical;
        min-height: 80px;
      }
    }

    .input-wrapper.has-error .input-field {
      border-color: var(--color-error);

      &:focus {
        box-shadow: 0 0 0 3px var(--color-error-light);
      }
    }

    .input-icon {
      position: absolute;
      display: flex;
      align-items: center;
      color: var(--text-tertiary);

      &.prefix {
        left: var(--spacing-sm);
      }

      &.suffix {
        right: var(--spacing-sm);
      }
    }

    .input-container:has(.prefix) .input-field {
      padding-left: 40px;
    }

    .input-container:has(.suffix) .input-field,
    .input-container:has(.toggle-password) .input-field {
      padding-right: 40px;
    }

    .toggle-password {
      position: absolute;
      right: var(--spacing-sm);
      background: none;
      border: none;
      padding: var(--spacing-xs);
      color: var(--text-tertiary);
      cursor: pointer;
      display: flex;
      align-items: center;

      &:hover {
        color: var(--text-secondary);
      }
    }

    .error-message {
      font-size: var(--font-size-xs);
      color: var(--color-error);
    }

    .hint-message {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
    }
  `]
})
export class InputComponent implements ControlValueAccessor {
  @Input() label?: string;
  @Input() placeholder = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'textarea' = 'text';
  @Input() disabled = false;
  @Input() required = false;
  @Input() error?: string;
  @Input() hint?: string;
  @Input() prefixIcon?: string;
  @Input() suffixIcon?: string;
  @Input() autocomplete = 'off';
  @Input() rows = 3;
  @Input() inputId = `input-${Math.random().toString(36).substr(2, 9)}`;

  value: string = '';
  showPassword = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  actualType() {
    if (this.type === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type;
  }

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  onInput(event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
