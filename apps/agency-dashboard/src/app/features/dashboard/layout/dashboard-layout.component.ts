import { Component, inject, signal, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { AuthService, AgencyService, MessageService } from '@workspace/core';
import { Agency, User } from '@workspace/core';
import { ToastService } from '@workspace/shared-ui';

@Pipe({
  name: 'safeHtml',
  standalone: true
})
export class SafeHtmlPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, FormsModule, SafeHtmlPipe],
  template: `
    <div class="dashboard-layout">
      <!-- Sidebar -->
      <aside class="sidebar">
        <!-- Brand -->
        <div class="sidebar-brand">
          <div class="brand-logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">AirHoppers</span>
            <span class="brand-subtitle">Agency Portal</span>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="sidebar-nav">
          @for (group of navGroups; track group.title) {
            <div class="nav-group">
              <span class="nav-group-title">{{ group.title }}</span>
              @for (item of group.items; track item.route) {
                <a
                  class="nav-item"
                  [routerLink]="item.route"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                >
                  <span class="nav-icon" [innerHTML]="item.icon | safeHtml"></span>
                  <span class="nav-label">{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="nav-badge">{{ item.badge }}</span>
                  }
                </a>
              }
            </div>
          }
        </nav>

        <!-- Upgrade Card -->
        <div class="upgrade-card">
          <div class="upgrade-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            <span class="pro-badge">PRO</span>
          </div>
          <h4>Upgrade to Pro</h4>
          <p>Unlock advanced features and analytics</p>
          <button class="upgrade-btn">Upgrade Now</button>
        </div>
      </aside>

      <!-- Main Area -->
      <div class="main-area">
        <!-- Top Header -->
        <header class="top-header">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" placeholder="Search packages, bookings, customers..." [(ngModel)]="searchQuery" />
          </div>

          <div class="header-actions">
            <button class="header-btn" [class.has-notification]="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
            <button class="header-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </button>

            <div class="user-menu" (click)="toggleUserMenu()">
              <div class="user-avatar">
                <img [src]="userAvatarUrl()" alt="User avatar" />
              </div>
              <div class="user-info">
                <span class="user-name">{{ currentUser()?.firstName || currentUser()?.lastName ? (currentUser()?.firstName + ' ' + currentUser()?.lastName) : 'Loading...' }}</span>
                <span class="user-role">Agency Manager</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>

              @if (showUserMenu()) {
                <div class="user-dropdown">
                  <a routerLink="/dashboard/profile" class="dropdown-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Profile
                  </a>
                  <a routerLink="/dashboard/settings" class="dropdown-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="3"/>
                      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                    </svg>
                    Settings
                  </a>
                  <div class="dropdown-divider"></div>
                  <a routerLink="/select-agency" class="dropdown-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                      <polyline points="9 22 9 12 15 12 15 22"/>
                    </svg>
                    Switch Agency
                  </a>
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item logout" (click)="logout()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Logout
                  </button>
                </div>
              }
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="page-content">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      min-height: 100vh;
      background: #f8f9fa;
    }

    /* Sidebar */
    .sidebar {
      width: 260px;
      background: white;
      border-right: 1px solid #e5e7eb;
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      z-index: 100;
    }

    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 20px;
      border-bottom: 1px solid #f3f4f6;
    }

    .brand-logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-size: 16px;
      font-weight: 700;
      color: #111827;
    }

    .brand-subtitle {
      font-size: 12px;
      color: #6b7280;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 16px 12px;
      overflow-y: auto;
    }

    .nav-group {
      margin-bottom: 24px;
    }

    .nav-group-title {
      display: block;
      font-size: 11px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 0 12px;
      margin-bottom: 8px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 12px;
      color: #4b5563;
      text-decoration: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.15s ease;
      margin-bottom: 2px;

      &:hover {
        background: #f9fafb;
        color: #111827;
      }

      &.active {
        background: rgba(255, 78, 120, 0.1);
        color: #FF4E78;

        .nav-icon {
          color: #FF4E78;
        }
      }
    }

    .nav-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      color: #9ca3af;
      flex-shrink: 0;
    }

    :host ::ng-deep .nav-icon svg {
      width: 20px;
      height: 20px;
      stroke: currentColor;
      stroke-width: 2;
      fill: none;
    }

    .nav-label {
      flex: 1;
    }

    .nav-badge {
      background: #FF4E78;
      color: white;
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 10px;
    }

    /* Upgrade Card */
    .upgrade-card {
      margin: 12px;
      padding: 20px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border-radius: 12px;
      color: white;

      h4 {
        font-size: 14px;
        font-weight: 600;
        margin: 12px 0 4px;
      }

      p {
        font-size: 12px;
        opacity: 0.9;
        margin: 0 0 16px;
      }
    }

    .upgrade-icon {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .pro-badge {
      background: rgba(255, 255, 255, 0.2);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
    }

    .upgrade-btn {
      width: 100%;
      padding: 10px;
      background: white;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      color: #FF4E78;
      cursor: pointer;
      transition: opacity 0.15s;

      &:hover {
        opacity: 0.9;
      }
    }

    /* Main Area */
    .main-area {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
    }

    /* Top Header */
    .top-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 32px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
      position: sticky;
      top: 0;
      z-index: 50;
    }

    .search-box {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px 16px;
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      width: 400px;

      svg {
        color: #9ca3af;
        flex-shrink: 0;
      }

      input {
        flex: 1;
        border: none;
        background: none;
        font-size: 14px;
        color: #111827;
        outline: none;

        &::placeholder {
          color: #9ca3af;
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .header-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: #f9fafb;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      cursor: pointer;
      position: relative;
      transition: all 0.15s;

      &:hover {
        background: #f3f4f6;
        color: #111827;
      }

      &.has-notification::after {
        content: '';
        position: absolute;
        top: 8px;
        right: 8px;
        width: 8px;
        height: 8px;
        background: #FF4E78;
        border-radius: 50%;
        border: 2px solid white;
      }
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 6px 12px 6px 6px;
      background: #f9fafb;
      border-radius: 10px;
      cursor: pointer;
      position: relative;
      margin-left: 8px;

      &:hover {
        background: #f3f4f6;
      }
    }

    .user-avatar img {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }

    .user-role {
      font-size: 11px;
      color: #6b7280;
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      min-width: 180px;
      padding: 8px;
      z-index: 100;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      color: #4b5563;
      text-decoration: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      border: none;
      background: none;
      width: 100%;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #f9fafb;
        color: #111827;
      }

      &.logout {
        color: #ef4444;

        &:hover {
          background: #fef2f2;
        }
      }

      svg {
        color: #9ca3af;
      }
    }

    .dropdown-divider {
      height: 1px;
      background: #e5e7eb;
      margin: 8px 0;
    }

    /* Page Content */
    .page-content {
      flex: 1;
      padding: 24px 32px;
    }

    @media (max-width: 1024px) {
      .sidebar {
        transform: translateX(-100%);
      }

      .main-area {
        margin-left: 0;
      }

      .search-box {
        width: 300px;
      }
    }
  `]
})
export class DashboardLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private agencyService = inject(AgencyService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private toast = inject(ToastService);

  currentUser = signal<User | null>(null);
  currentAgency = signal<Agency | null>(null);
  showUserMenu = signal(false);
  unreadMessagesCount = signal(0);
  searchQuery = '';

  get navGroups(): NavGroup[] {
    return [
    {
      title: 'Main Menu',
      items: [
        {
          label: 'Dashboard',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>',
          route: '/dashboard/overview'
        },
        {
          label: 'Travel Packages',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>',
          route: '/dashboard/packages'
        },
        {
          label: 'Bookings',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
          route: '/dashboard/bookings'
        },
        {
          label: 'Customers',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
          route: '/dashboard/customers'
        },
        {
          label: 'Messages',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
          route: '/dashboard/messages',
          badge: this.unreadMessagesCount() || undefined
        },
        {
          label: 'Analytics',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
          route: '/dashboard/analytics'
        }
      ]
    },
    {
      title: 'Management',
      items: [
        {
          label: 'Team Members',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
          route: '/dashboard/members'
        },
        {
          label: 'Categories',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>',
          route: '/dashboard/categories'
        },
        {
          label: 'Hotels',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
          route: '/dashboard/hotels'
        },
        {
          label: 'Flights',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
          route: '/dashboard/flights'
        },
        {
          label: 'Pricing',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
          route: '/dashboard/pricing'
        }
      ]
    },
    {
      title: 'Settings',
      items: [
        {
          label: 'Agency Profile',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
          route: '/dashboard/agency-profile'
        },
        {
          label: 'Account Settings',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
          route: '/dashboard/settings'
        },
        {
          label: 'Notifications',
          icon: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',
          route: '/dashboard/notifications'
        }
      ]
    }
  ];
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser.set(user);
    });

    this.agencyService.currentAgency$.subscribe(agency => {
      this.currentAgency.set(agency);
      // Load unread messages count when agency is available
      if (agency) {
        this.loadUnreadMessagesCount(agency.id);
      }
    });

    // Reload user profile if not already loaded (handles page refresh)
    if (!this.authService.getCurrentUser()) {
      this.authService.reloadUserProfile();
    }

    this.agencyService.loadCurrentAgencyFromStorage();
    this.agencyService.loadMyAgencies();

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.user-menu')) {
        this.showUserMenu.set(false);
      }
    });
  }

  private loadUnreadMessagesCount(agencyId: string): void {
    this.messageService.getAgencyConversations(agencyId).subscribe({
      next: (conversations) => {
        const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);
        this.unreadMessagesCount.set(totalUnread);
      },
      error: () => {
        // Silently fail - badge will just not show
        this.unreadMessagesCount.set(0);
      }
    });
  }

  userAvatarUrl(): string {
    const user = this.currentUser();
    if (user?.profileImageUrl) {
      return user.profileImageUrl;
    }
    const name = user ? `${user.firstName}+${user.lastName}` : 'User';
    return `https://ui-avatars.com/api/?name=${name}&background=FF4E78&color=fff`;
  }

  toggleUserMenu(): void {
    this.showUserMenu.update(v => !v);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toast.success('You have been logged out', 'Goodbye!');
      },
      error: () => {
        this.toast.success('You have been logged out', 'Goodbye!');
      }
    });
  }
}
