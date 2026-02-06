import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { APP_ENVIRONMENT } from '../config';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const env = inject(APP_ENVIRONMENT);

  if (authService.hasValidToken()) {
    return true;
  }

  const returnUrl = encodeURIComponent(`${env.dashboardUrl}${state.url}`);
  window.location.href = `${env.landingUrl}/auth/login?returnUrl=${returnUrl}`;
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const env = inject(APP_ENVIRONMENT);

  // Handle cross-app logout: clear stale tokens from this origin
  if (route.queryParams['logout'] === 'true') {
    authService.clearTokens();
    return true;
  }

  if (!authService.hasValidToken()) {
    return true;
  }

  window.location.href = `${env.dashboardUrl}/dashboard`;
  return false;
};
