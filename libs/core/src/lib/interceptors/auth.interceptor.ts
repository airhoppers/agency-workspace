import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);

  // Skip auth header for auth endpoints (except refresh and logout)
  const skipAuthUrls = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/lead'  // All lead endpoints: /auth/lead, /auth/lead/verify, /auth/lead/signup, /auth/lead/login
  ];
  const shouldSkip = skipAuthUrls.some(url => req.url.includes(url));

  if (shouldSkip) {
    return next(req);
  }

  const token = authService.getAccessToken();
  let authReq = req;

  if (token) {
    authReq = addTokenToRequest(req, token);
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return handleUnauthorizedError(authReq, next, authService);
      }
      return throwError(() => error);
    })
  );
};

function addTokenToRequest(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return request.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
}

function handleUnauthorizedError(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authService: AuthService
) {
  if (!isRefreshing) {
    isRefreshing = true;

    return authService.refreshToken().pipe(
      switchMap(response => {
        isRefreshing = false;
        const newRequest = addTokenToRequest(request, response.accessToken);
        return next(newRequest);
      }),
      catchError(error => {
        isRefreshing = false;
        authService.clearAuth();
        return throwError(() => error);
      })
    );
  }

  // If already refreshing, wait and retry with new token
  const token = authService.getAccessToken();
  if (token) {
    return next(addTokenToRequest(request, token));
  }

  return throwError(() => new Error('Authentication failed'));
}
