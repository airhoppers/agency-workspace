export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  repeatNewPassword: string;
}

export interface SetupPasswordRequest {
  setupNewPassword: string;
  repeatSetupNewPassword: string;
}

// Lead-based authentication
export interface LeadRequest {
  email: string;
}

export interface LeadResponse {
  leadId: string;
}

export interface LeadSignupRequest {
  leadId: string;
  code: string;
  firstName: string;
  lastName: string;
}

export interface LeadLoginRequest {
  leadId: string;
  code: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  birthdate?: string;
  gender?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  address?: UserAddress;
  language?: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface UserSettings {
  userId: string;
  language: string;
  currency: string;
}
