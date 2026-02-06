import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';
import { APP_ENVIRONMENT } from '../config';
import {
  LoginRequest,
  SignUpRequest,
  AuthResponse,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LeadRequest,
  LeadResponse,
  LeadSignupRequest,
  LeadLoginRequest,
  User
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly API_URL = `${this.env.apiUrl}/auth`;
  private readonly USER_API_URL = `${this.env.apiUrl}/user`;
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'current_user';

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSignal = signal(this.hasValidToken());
  isAuthenticated = computed(() => this.isAuthenticatedSignal());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Load cached user immediately
    const cachedUser = this.getCachedUser();
    if (cachedUser) {
      this.currentUserSubject.next(cachedUser);
    }
    this.checkInitialAuth();
  }

  private checkInitialAuth(): void {
    if (this.hasValidToken()) {
      this.loadUserProfile();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleAuthError(error))
    );
  }

  signUp(data: SignUpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/signup`, data).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleAuthError(error))
    );
  }

  // Lead-based authentication methods
  createLead(email: string): Observable<LeadResponse> {
    const request: LeadRequest = { email };
    return this.http.post<LeadResponse>(`${this.API_URL}/lead`, request).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }

  verifyLeadCode(leadId: string, code: string): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/lead/verify`, { leadId, code }).pipe(
      catchError(error => this.handleAuthError(error))
    );
  }

  leadSignup(data: LeadSignupRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/lead/signup`, data).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleAuthError(error))
    );
  }

  leadLogin(data: LeadLoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/lead/login`, data).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => this.handleAuthError(error))
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {}).pipe(
      tap(() => this.clearAuth()),
      catchError(error => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  globalLogout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/global-logout`, {}).pipe(
      tap(() => this.clearAuth()),
      catchError(error => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refreshToken };
    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, request).pipe(
      tap(response => this.handleAuthSuccess(response)),
      catchError(error => {
        this.clearAuth();
        return throwError(() => error);
      })
    );
  }

  forgotPassword(email: string): Observable<void> {
    const request: ForgotPasswordRequest = { email };
    return this.http.post<void>(`${this.API_URL}/forgot-password`, request);
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    const request: ResetPasswordRequest = { token, newPassword };
    return this.http.post<void>(`${this.API_URL}/reset-password`, request);
  }

  validateResetToken(token: string): Observable<{ valid: boolean }> {
    return this.http.get<{ valid: boolean }>(`${this.API_URL}/reset-password`, {
      params: { token }
    });
  }

  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/change-password`, data);
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.setTokens(response.accessToken, response.refreshToken);
    this.isAuthenticatedSignal.set(true);
    this.loadUserProfile();
  }

  private handleAuthError(error: any): Observable<never> {
    return throwError(() => error);
  }

  private loadUserProfile(): void {
    this.http.get<User>(`${this.USER_API_URL}/profile`).subscribe({
      next: (user) => {
        this.cacheUser(user);
        this.currentUserSubject.next(user);
      },
      error: () => {
        this.clearCachedUser();
        this.currentUserSubject.next(null);
      }
    });
  }

  private getCachedUser(): User | null {
    try {
      const cached = localStorage.getItem(this.USER_KEY);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  private cacheUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private clearCachedUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  reloadUserProfile(): void {
    if (this.hasValidToken()) {
      this.loadUserProfile();
    }
  }

  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  clearTokens(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    this.clearCachedUser();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSignal.set(false);
  }

  clearAuth(): void {
    this.clearTokens();
    window.location.href = `${this.env.landingUrl}/auth/login?logout=true`;
  }

  hasValidToken(): boolean {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate > new Date();
    } catch {
      return false;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  updateCurrentUser(user: User): void {
    this.cacheUser(user);
    this.currentUserSubject.next(user);
  }
}
