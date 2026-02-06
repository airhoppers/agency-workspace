export interface Agency {
  id: string;
  name: string;
  description?: string;
  addressLine?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  logoUrl?: string;
  imageLogo?: string | null;
  language?: string;
  timezone?: string;
  businessHours?: BusinessHours;
  verified?: boolean;
  verificationStatus?: VerificationStatus;
  ownerId?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Response from /user/agency/my endpoint
export interface MyAgencyResponse {
  agency: Agency;
  role: AgencyRole;
}

export interface BusinessHours {
  [day: string]: DayHours;
}

export interface DayHours {
  open: number;
  close: number;
  closed: boolean;
}

export interface AgencyMember {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: AgencyRole;
  profileImageUrl?: string;
  joinedAt?: string;
}

export enum AgencyRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  AGENT = 'AGENT'
}

export interface AddMemberRequest {
  email: string;
  role: AgencyRole;
}

// Full settings DTO matching backend AgencySettingsDto
export interface AgencySettings {
  id?: string;
  agencyId?: string;
  language?: string;
  bookingLimitPerDay?: number;
  cancellationPolicy?: string;
  currency?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  timezone?: string;
  createdAt?: string;
  updatedAt?: string;
  agencyBusinessHours?: AgencyBusinessHoursDto;
}

export interface AgencyBusinessHoursDto {
  hours: BusinessHours;
}

// Request body for PUT /agency/{id}/settings
export interface UpdateAgencySettingsRequest {
  language?: string;
  bookingLimitPerDay?: number;
  cancellationPolicy?: string;
  currency?: string;
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  timezone?: string;
  businessHours?: string; // JSON string
}

// Audit Log types
export interface AuditLog {
  id: string;
  agencyId: string;
  performedById: string;
  performedByFirstName?: string;
  performedByLastName?: string;
  resourceType: string;
  resourceId?: string;
  action: string;
  description?: string;
  ipAddress?: string;
  userAgent?: string;
  changes?: string;
  createdAt: string;
}

export type AuditAction = 'CREATE' | 'UPDATE' | 'DELETE' | 'INVITE' | 'ACCEPT' | 'CANCEL' | 'STATUS_CHANGE';
export type AuditResourceType = 'AGENCY' | 'AGENCY_MEMBER' | 'AGENCY_SETTINGS' | 'TRAVEL_PACKAGE' | 'BOOKING' | 'VERIFICATION';

export interface AuditLogFilter {
  offset: number;
  limit: number;
  resourceType?: string;
  action?: string;
  performedBy?: string;
  from?: number;
  to?: number;
}

export interface AuditLogResponse {
  data: AuditLog[];
  offset: number;
  total: number;
}

export interface VerificationStatus {
  businessVerified: boolean;
  ownerVerified: boolean;
  status: 'PENDING' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED';
}

export interface StartVerificationRequest {
  agencyId: string;
  country: string;
  iataNumber?: string;
  businessLicense?: string;
  notes?: string;
}

export interface CreateAgencyRequest {
  name: string;
  description?: string;
  addressLine?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  language?: string;
  timezone?: string;
  businessHours?: string;
}

export interface UpdateAgencyRequest {
  name?: string;
  description?: string;
  addressLine?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
}
