import { Routes } from '@angular/router';
import { authGuard } from '@workspace/core';

export const routes: Routes = [
  {
    path: 'select-agency',
    loadChildren: () => import('./features/agency-selection/agency-selection.routes').then(m => m.AGENCY_SELECTION_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
