import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, BehaviorSubject } from 'rxjs';
import { APP_ENVIRONMENT } from '../config';
import {
  Agency,
  AgencyMember,
  AgencySettings,
  UpdateAgencySettingsRequest,
  AddMemberRequest,
  CreateAgencyRequest,
  UpdateAgencyRequest,
  StartVerificationRequest,
  VerificationStatus,
  PaginatedResponse,
  PaginationParams,
  MyAgencyResponse,
  AuditLog,
  AuditLogFilter,
  AuditLogResponse
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class AgencyService {
  private readonly env = inject(APP_ENVIRONMENT);
  // Agency management endpoints: /agency/{agencyId}/...
  private readonly API_URL = `${this.env.apiUrl}/agency`;
  // User agency endpoints: /user/agency/...
  private readonly USER_API_URL = `${this.env.apiUrl}/user/agency`;

  private currentAgencySubject = new BehaviorSubject<Agency | null>(null);
  currentAgency$ = this.currentAgencySubject.asObservable();

  private myAgenciesSignal = signal<MyAgencyResponse[]>([]);
  myAgencies = computed(() => this.myAgenciesSignal());

  constructor(private http: HttpClient) {}

  // User Agency endpoints
  createAgency(data: CreateAgencyRequest, file?: File): Observable<Agency> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, typeof value === 'object' ? JSON.stringify(value) : value.toString());
      }
    });
    if (file) {
      formData.append('file', file);
    }
    return this.http.post<Agency>(this.USER_API_URL, formData).pipe(
      tap(() => this.loadMyAgencies())
    );
  }

  getMyAgencies(): Observable<MyAgencyResponse[]> {
    return this.http.get<MyAgencyResponse[]>(`${this.USER_API_URL}/my`).pipe(
      tap(responses => this.myAgenciesSignal.set(responses))
    );
  }

  // Helper to get just agencies from responses
  getMyAgenciesFlat(): Observable<Agency[]> {
    return this.getMyAgencies().pipe(
      map(responses => responses.map(r => r.agency))
    );
  }

  loadMyAgencies(): void {
    this.getMyAgencies().subscribe();
  }

  getAgencyById(agencyId: string): Observable<Agency> {
    return this.http.get<Agency>(`${this.USER_API_URL}/${agencyId}`);
  }

  getAgencies(params: PaginationParams): Observable<PaginatedResponse<Agency>> {
    const httpParams = new HttpParams()
      .set('offset', params.offset.toString())
      .set('limit', params.limit.toString());
    return this.http.get<PaginatedResponse<Agency>>(this.USER_API_URL, { params: httpParams });
  }

  // Agency Management endpoints
  updateAgency(agencyId: string, data: UpdateAgencyRequest, file?: File): Observable<Agency> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (file) {
      formData.append('file', file);
    }
    return this.http.put<Agency>(`${this.API_URL}/${agencyId}`, formData).pipe(
      tap(agency => {
        if (this.currentAgencySubject.value?.id === agencyId) {
          this.currentAgencySubject.next(agency);
        }
        this.loadMyAgencies();
      })
    );
  }

  deleteAgency(agencyId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${agencyId}`).pipe(
      tap(() => {
        if (this.currentAgencySubject.value?.id === agencyId) {
          this.currentAgencySubject.next(null);
        }
        this.loadMyAgencies();
      })
    );
  }

  // Agency Members - endpoint: /agency/{agencyId}/members
  getAgencyMembers(agencyId: string): Observable<AgencyMember[]> {
    return this.http.get<AgencyMember[]>(`${this.API_URL}/${agencyId}/members`);
  }

  addAgencyMember(agencyId: string, data: AddMemberRequest): Observable<AgencyMember> {
    return this.http.post<AgencyMember>(`${this.API_URL}/${agencyId}/members`, data);
  }

  removeAgencyMember(agencyId: string, memberId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${agencyId}/members/${memberId}`);
  }

  // Agency Settings - endpoint: /agency/{agencyId}/settings
  getAgencySettings(agencyId: string): Observable<AgencySettings> {
    return this.http.get<AgencySettings>(`${this.API_URL}/${agencyId}/settings`);
  }

  updateAgencySettings(agencyId: string, settings: UpdateAgencySettingsRequest): Observable<AgencySettings> {
    return this.http.put<AgencySettings>(`${this.API_URL}/${agencyId}/settings`, settings);
  }

  // Audit Logs - endpoint: /agency/{agencyId}/audit-logs
  getAuditLogs(agencyId: string, filter: AuditLogFilter): Observable<AuditLogResponse> {
    let params = new HttpParams()
      .set('offset', filter.offset.toString())
      .set('limit', filter.limit.toString());
    if (filter.resourceType) params = params.set('resourceType', filter.resourceType);
    if (filter.action) params = params.set('action', filter.action);
    if (filter.performedBy) params = params.set('performedBy', filter.performedBy);
    if (filter.from) params = params.set('from', filter.from.toString());
    if (filter.to) params = params.set('to', filter.to.toString());
    return this.http.get<AuditLogResponse>(`${this.API_URL}/${agencyId}/audit-logs`, { params });
  }

  // Logo Upload - using update agency endpoint with file
  uploadAgencyLogo(agencyId: string, file: File): Observable<Agency> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put<Agency>(`${this.API_URL}/${agencyId}`, formData).pipe(
      tap(agency => {
        if (this.currentAgencySubject.value?.id === agencyId) {
          this.currentAgencySubject.next(agency);
        }
        this.loadMyAgencies();
      })
    );
  }

  // Verification
  startVerification(data: StartVerificationRequest): Observable<any> {
    return this.http.post(`${this.USER_API_URL}/verification/start`, data);
  }

  getVerificationStatus(): Observable<VerificationStatus> {
    return this.http.get<VerificationStatus>(`${this.USER_API_URL}/verification/status`);
  }

  // Current Agency Management
  setCurrentAgency(agency: Agency | null): void {
    this.currentAgencySubject.next(agency);
    if (agency) {
      localStorage.setItem('current_agency_id', agency.id);
    } else {
      localStorage.removeItem('current_agency_id');
    }
  }

  getCurrentAgency(): Agency | null {
    return this.currentAgencySubject.value;
  }

  loadCurrentAgencyFromStorage(): void {
    const agencyId = localStorage.getItem('current_agency_id');
    if (agencyId) {
      this.getAgencyById(agencyId).subscribe({
        next: (agency) => this.currentAgencySubject.next(agency),
        error: () => localStorage.removeItem('current_agency_id')
      });
    }
  }
}
