import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AgencyService, AuthService } from '@workspace/core';
import { Agency, MyAgencyResponse, AgencyRole } from '@workspace/core';
import { ToastService } from '@workspace/shared-ui';

interface ActivityItem {
  id: string;
  type: 'booking' | 'package' | 'member' | 'review';
  title: string;
  description: string;
  time: string;
}

interface PerformanceMetric {
  label: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: string;
}

@Component({
  selector: 'app-agency-selection',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <div class="logo">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
            </svg>
          </div>
          <div class="brand">
            <span class="brand-name">AirHoppers</span>
            <span class="brand-subtitle">Agency Management Portal</span>
          </div>
        </div>
        <div class="header-right">
          <button class="notification-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </button>
  @if (authService.currentUser$ | async; as user) {
            <div class="user-menu" (click)="toggleUserDropdown()">
              <div class="avatar">
                <img [src]="'https://ui-avatars.com/api/?name=' + user.firstName + '+' + user.lastName + '&background=FF4E78&color=fff'" alt="User avatar" />
              </div>
              <div class="user-info">
                <span class="user-name">{{ user.firstName }} {{ user.lastName }}</span>
                <span class="user-email">{{ user.email }}</span>
              </div>
              <svg class="dropdown-arrow" [class.open]="userDropdownOpen()" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
              @if (userDropdownOpen()) {
                <div class="user-dropdown" (click)="$event.stopPropagation()">
                  <button class="dropdown-item logout" (click)="logout()">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                      <polyline points="16 17 21 12 16 7"/>
                      <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                    Sign Out
                  </button>
                </div>
              }
            </div>
          } @else {
            <div class="user-menu">
              <div class="avatar">
                <div class="avatar-placeholder">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </div>
            </div>
          }
        </div>
      </header>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Page Title Section -->
        <div class="page-title-section">
          <div class="page-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          </div>
          <h1>Select Your Travel Agency</h1>
          <p>Choose which travel agency you'd like to manage, or create a new one to get started</p>
        </div>

        <!-- Agency Cards -->
        <div class="agencies-grid">
          @for (agencyData of agencies(); track agencyData.agency.id) {
            <div class="agency-card" [class.pending]="!agencyData.agency.verified">
              <div class="agency-card-header">
                <div class="agency-logo" [style.background-color]="getAgencyColor(agencyData.agency)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    @if (getAgencyIcon(agencyData.agency) === 'star') {
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    } @else if (getAgencyIcon(agencyData.agency) === 'mountain') {
                      <path d="m8 3 4 8 5-5 5 15H2L8 3z"/>
                    } @else {
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="2" y1="12" x2="22" y2="12"/>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                    }
                  </svg>
                </div>
                <div class="agency-header-info">
                  <span class="agency-role">{{ agencyData.role }}</span>
                  <span class="agency-status" [class.active]="agencyData.agency.verified" [class.pending]="!agencyData.agency.verified">
                    {{ agencyData.agency.verified ? 'Active' : 'Pending Setup' }}
                  </span>
                </div>
              </div>
              <h3 class="agency-name">{{ agencyData.agency.name }}</h3>
              <p class="agency-description">{{ agencyData.agency.description || 'No description available' }}</p>
              <div class="agency-details">
                <div class="detail-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>{{ agencyData.agency.city || 'Location not set' }}{{ agencyData.agency.country ? ', ' + agencyData.agency.country : '' }}</span>
                </div>
                <div class="detail-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                  <span>{{ getPackageCount(agencyData.agency) }} Active Packages</span>
                </div>
                <div class="detail-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>{{ getMemberCount(agencyData.agency) }} Team Members</span>
                </div>
              </div>
              <button
                class="agency-btn"
                [class.primary]="agencyData.agency.verified"
                [class.outline]="!agencyData.agency.verified"
                (click)="selectAgency(agencyData.agency)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  @if (agencyData.agency.verified) {
                    <path d="M5 12h14"/>
                    <path d="m12 5 7 7-7 7"/>
                  } @else {
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  }
                </svg>
                {{ agencyData.agency.verified ? 'Access Dashboard' : 'Complete Setup' }}
              </button>
            </div>
          }
        </div>

        <!-- Create New Agency -->
        <div class="create-agency-card">
          <div class="create-agency-content">
            <div class="create-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div class="create-text">
              <h3>Create New Travel Agency</h3>
              <p>Start managing a new travel agency and begin creating amazing travel packages for your customers</p>
            </div>
          </div>
          <button class="create-btn" (click)="createAgency()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            Create Agency
          </button>
        </div>

        <!-- Recent Activity Section -->
        <section class="activity-section">
          <h2>Recent Activity Across Agencies</h2>
          <div class="activity-grid">
            <!-- Latest Updates -->
            <div class="activity-card">
              <div class="activity-header">
                <h3>Latest Updates</h3>
                <a href="#" class="view-all">View All</a>
              </div>
              <div class="activity-list">
                @for (activity of recentActivities(); track activity.id) {
                  <div class="activity-item">
                    <div class="activity-icon" [class]="activity.type">
                      @switch (activity.type) {
                        @case ('booking') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                        }
                        @case ('package') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                          </svg>
                        }
                        @case ('member') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="8.5" cy="7" r="4"/>
                            <line x1="20" y1="8" x2="20" y2="14"/>
                            <line x1="23" y1="11" x2="17" y2="11"/>
                          </svg>
                        }
                        @case ('review') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                          </svg>
                        }
                      }
                    </div>
                    <div class="activity-content">
                      <span class="activity-title">{{ activity.title }}</span>
                      <span class="activity-desc">{{ activity.description }}</span>
                      <span class="activity-time">{{ activity.time }}</span>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Performance Overview -->
            <div class="performance-card">
              <div class="activity-header">
                <h3>Performance Overview</h3>
                <a href="#" class="view-all details">Details</a>
              </div>
              <div class="metrics-list">
                @for (metric of performanceMetrics(); track metric.label) {
                  <div class="metric-item">
                    <div class="metric-info">
                      <span class="metric-label">{{ metric.label }}</span>
                      <span class="metric-value">{{ metric.value }}</span>
                      <span class="metric-change" [class]="metric.changeType">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          @if (metric.changeType === 'positive') {
                            <polyline points="18 15 12 9 6 15"/>
                          } @else {
                            <polyline points="6 9 12 15 18 9"/>
                          }
                        </svg>
                        {{ metric.change }}
                      </span>
                    </div>
                    <div class="metric-icon" [class]="metric.icon">
                      @switch (metric.icon) {
                        @case ('dollar') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="12" y1="1" x2="12" y2="23"/>
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                          </svg>
                        }
                        @case ('calendar') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                        }
                        @case ('heart') {
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                          </svg>
                        }
                      }
                    </div>
                  </div>
                }
              </div>
            </div>
          </div>
        </section>

        <!-- Quick Actions -->
        <section class="quick-actions-section">
          <h2>Quick Actions</h2>
          <div class="quick-actions-grid">
            <div class="quick-action-card" (click)="quickAction('package')">
              <div class="quick-action-icon package">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                </svg>
              </div>
              <h4>Create Package</h4>
              <p>Design new travel experiences</p>
            </div>
            <div class="quick-action-card" (click)="quickAction('calendar')">
              <div class="quick-action-icon calendar">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <h4>View Calendar</h4>
              <p>Manage bookings schedule</p>
            </div>
            <div class="quick-action-card" (click)="quickAction('analytics')">
              <div class="quick-action-icon analytics">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <h4>Analytics</h4>
              <p>View performance metrics</p>
            </div>
            <div class="quick-action-card" (click)="quickAction('team')">
              <div class="quick-action-icon team">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h4>Team Management</h4>
              <p>Manage team members</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background-color: #f8f9fa;
    }

    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 32px;
      background: white;
      border-bottom: 1px solid #e5e7eb;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .logo {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .brand {
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

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .notification-btn {
      width: 40px;
      height: 40px;
      border: none;
      background: #f3f4f6;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #6b7280;
      transition: background 0.2s;

      &:hover {
        background: #e5e7eb;
      }
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 10px;
      position: relative;
      transition: background 0.2s;

      &:hover {
        background: #f3f4f6;
      }
    }

    .dropdown-arrow {
      color: #6b7280;
      transition: transform 0.2s;

      &.open {
        transform: rotate(180deg);
      }
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 8px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      min-width: 160px;
      z-index: 100;
      overflow: hidden;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 12px 16px;
      border: none;
      background: none;
      font-size: 14px;
      font-weight: 500;
      color: #374151;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #f3f4f6;
      }

      &.logout {
        color: #ef4444;

        &:hover {
          background: #fef2f2;
        }
      }
    }

    .avatar img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .avatar-placeholder {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f3f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #9ca3af;
    }

    .user-info {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: #111827;
    }

    .user-email {
      font-size: 12px;
      color: #6b7280;
    }

    /* Main Content */
    .main-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 40px 32px;
    }

    /* Page Title Section */
    .page-title-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .page-icon {
      width: 64px;
      height: 64px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border-radius: 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      margin: 0 auto 20px;
    }

    .page-title-section h1 {
      font-size: 32px;
      font-weight: 700;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .page-title-section p {
      font-size: 16px;
      color: #6b7280;
      margin: 0;
    }

    /* Agency Cards Grid */
    .agencies-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      margin-bottom: 24px;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .agency-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      transition: box-shadow 0.2s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      &.pending {
        border-color: #fcd5ce;
      }
    }

    .agency-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 16px;
    }

    .agency-logo {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
    }

    .agency-header-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
    }

    .agency-role {
      font-size: 11px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      background: #f3f4f6;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .agency-status {
      font-size: 12px;
      font-weight: 500;
      padding: 4px 10px;
      border-radius: 20px;

      &.active {
        background: #d1fae5;
        color: #065f46;
      }

      &.pending {
        background: #fef3c7;
        color: #b45309;
      }
    }

    .agency-name {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 8px 0;
    }

    .agency-description {
      font-size: 14px;
      color: #6b7280;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }

    .agency-details {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      color: #6b7280;

      svg {
        color: #9ca3af;
      }
    }

    .agency-btn {
      width: 100%;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      transition: all 0.2s;

      &.primary {
        background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
        border: none;
        color: white;

        &:hover {
          opacity: 0.9;
        }
      }

      &.outline {
        background: white;
        border: 1px solid #FF4E78;
        color: #FF4E78;

        &:hover {
          background: rgba(255, 78, 120, 0.05);
        }
      }
    }

    /* Create Agency Card */
    .create-agency-card {
      background: white;
      border-radius: 16px;
      padding: 24px 32px;
      border: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 48px;
    }

    .create-agency-content {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .create-icon {
      width: 56px;
      height: 56px;
      background: rgba(255, 78, 120, 0.1);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FF4E78;
    }

    .create-text h3 {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0 0 4px 0;
    }

    .create-text p {
      font-size: 14px;
      color: #6b7280;
      margin: 0;
    }

    .create-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, #FF9370 0%, #FF4E78 100%);
      border: none;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 600;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.9;
      }
    }

    /* Activity Section */
    .activity-section {
      margin-bottom: 48px;

      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 20px 0;
      }
    }

    .activity-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }

    .activity-card, .performance-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e5e7eb;
    }

    .activity-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;

      h3 {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
        margin: 0;
      }

      .view-all {
        font-size: 13px;
        color: #10b981;
        text-decoration: none;
        font-weight: 500;

        &.details {
          color: #FF4E78;
        }
      }
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      gap: 12px;
    }

    .activity-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.booking {
        background: #d1fae5;
        color: #10b981;
      }

      &.package {
        background: #e0e7ff;
        color: #6366f1;
      }

      &.member {
        background: #fef3c7;
        color: #f59e0b;
      }

      &.review {
        background: #fce7f3;
        color: #ec4899;
      }
    }

    .activity-content {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .activity-title {
      font-size: 14px;
      font-weight: 500;
      color: #111827;
    }

    .activity-desc {
      font-size: 13px;
      color: #6b7280;
    }

    .activity-time {
      font-size: 12px;
      color: #9ca3af;
    }

    /* Performance Metrics */
    .metrics-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .metric-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      background: #f9fafb;
      border-radius: 12px;
    }

    .metric-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .metric-label {
      font-size: 13px;
      color: #6b7280;
    }

    .metric-value {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
    }

    .metric-change {
      font-size: 12px;
      display: flex;
      align-items: center;
      gap: 2px;

      &.positive {
        color: #10b981;
      }

      &.negative {
        color: #ef4444;
      }
    }

    .metric-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.dollar {
        background: #d1fae5;
        color: #10b981;
      }

      &.calendar {
        background: #e0e7ff;
        color: #6366f1;
      }

      &.heart {
        background: #fce7f3;
        color: #ec4899;
      }
    }

    /* Quick Actions */
    .quick-actions-section {
      h2 {
        font-size: 20px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 20px 0;
      }
    }

    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;

      @media (max-width: 1024px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 640px) {
        grid-template-columns: 1fr;
      }
    }

    .quick-action-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      border: 1px solid #e5e7eb;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        transform: translateY(-2px);
      }

      h4 {
        font-size: 15px;
        font-weight: 600;
        color: #111827;
        margin: 0 0 4px 0;
      }

      p {
        font-size: 13px;
        color: #6b7280;
        margin: 0;
      }
    }

    .quick-action-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;

      &.package {
        background: rgba(255, 78, 120, 0.1);
        color: #FF4E78;
      }

      &.calendar {
        background: #ecfdf5;
        color: #10b981;
      }

      &.analytics {
        background: #eef2ff;
        color: #6366f1;
      }

      &.team {
        background: #fef3c7;
        color: #f59e0b;
      }
    }
  `]
})
export class AgencySelectionComponent implements OnInit {
  private agencyService = inject(AgencyService);
  authService = inject(AuthService);  // public for template
  private router = inject(Router);
  private toast = inject(ToastService);

  agencies = signal<MyAgencyResponse[]>([]);
  isLoading = signal(false);
  userDropdownOpen = signal(false);

  // Recent activities - fetched from API in future
  recentActivities = signal<ActivityItem[]>([]);

  // Performance metrics - fetched from API in future
  performanceMetrics = signal<PerformanceMetric[]>([]);

  // Agency colors and icons based on index/name
  private agencyColors = ['#FF4E78', '#10b981', '#6366f1'];
  private agencyIcons = ['star', 'mountain', 'globe'];

  ngOnInit(): void {
    this.loadAgencies();
    // Ensure user profile is loaded
    this.authService.reloadUserProfile();
  }

  loadAgencies(): void {
    this.isLoading.set(true);
    this.agencyService.getMyAgencies().subscribe({
      next: (responses) => {
        this.agencies.set(responses);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.toast.error('Failed to load agencies');
      }
    });
  }

  getAgencyColor(agency: Agency): string {
    const index = this.agencies().findIndex(a => a.agency.id === agency.id);
    return this.agencyColors[index % this.agencyColors.length];
  }

  getAgencyIcon(agency: Agency): string {
    const index = this.agencies().findIndex(a => a.agency.id === agency.id);
    return this.agencyIcons[index % this.agencyIcons.length];
  }

  getPackageCount(agency: Agency): number {
    // TODO: Get from API response when available
    return 0;
  }

  getMemberCount(agency: Agency): number {
    // TODO: Get from API response when available
    return 1;
  }

  selectAgency(agency: Agency): void {
    this.agencyService.setCurrentAgency(agency);
    if (agency.verified) {
      this.router.navigate(['/dashboard']);
    } else {
      this.toast.info('Please complete your agency setup', 'Setup Required');
      this.router.navigate(['/dashboard/settings']);
    }
  }

  createAgency(): void {
    this.router.navigate(['/select-agency/create']);
  }

  quickAction(action: string): void {
    this.toast.info(`${action} feature requires selecting an agency first`, 'Select Agency');
  }

  toggleUserDropdown(): void {
    this.userDropdownOpen.update(v => !v);
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.toast.success('You have been signed out', 'Goodbye!');
      },
      error: () => {
        // clearAuth is called anyway in the service
      }
    });
  }
}
