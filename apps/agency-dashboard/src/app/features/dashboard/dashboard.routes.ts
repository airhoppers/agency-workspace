import { Routes } from '@angular/router';
import { authGuard, agencyGuard } from '@workspace/core';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/dashboard-layout.component').then(m => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      // MAIN MENU
      {
        path: 'overview',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/overview/overview.component').then(m => m.OverviewComponent)
      },
      {
        path: 'agencies',
        loadComponent: () => import('./pages/agencies/agencies.component').then(m => m.AgenciesComponent)
      },
      {
        path: 'packages',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/packages/packages.component').then(m => m.PackagesComponent)
      },
      {
        path: 'packages/create',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/packages/package-form/package-form.component').then(m => m.PackageFormComponent)
      },
      {
        path: 'packages/:id/edit',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/packages/package-form/package-form.component').then(m => m.PackageFormComponent)
      },
      {
        path: 'bookings',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/bookings/bookings.component').then(m => m.BookingsComponent)
      },
      {
        path: 'bookings/:id',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/bookings/booking-detail/booking-detail.component').then(m => m.BookingDetailComponent)
      },
      {
        path: 'customers',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'analytics',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.AnalyticsComponent)
      },
      // MANAGEMENT
      {
        path: 'categories',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/categories/categories.component').then(m => m.CategoriesComponent)
      },
      {
        path: 'hotels',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/hotels/hotels.component').then(m => m.HotelsComponent)
      },
      {
        path: 'flights',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/flights/flights.component').then(m => m.FlightsComponent)
      },
      {
        path: 'pricing',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/pricing/pricing.component').then(m => m.PricingComponent)
      },
      // SETTINGS
      {
        path: 'agency-profile',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/agency-profile/agency-profile.component').then(m => m.AgencyProfileComponent)
      },
      {
        path: 'settings',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
      },
      {
        path: 'notifications',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/notifications/notifications.component').then(m => m.NotificationsComponent)
      },
      // Other
      {
        path: 'members',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/members/members.component').then(m => m.MembersComponent)
      },
      {
        path: 'messages',
        canActivate: [agencyGuard],
        loadComponent: () => import('./pages/messages/messages.component').then(m => m.MessagesComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  }
];
