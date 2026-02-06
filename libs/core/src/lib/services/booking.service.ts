import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_ENVIRONMENT } from '../config';
import {
  Booking,
  CreateBookingRequest,
  PriceBreakdownRequest,
  PriceBreakdown,
  PaginatedResponse,
  PaginationParams
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly API_URL = this.env.apiUrl;

  constructor(private http: HttpClient) {}

  // Agency Booking endpoints
  acceptBooking(agencyId: string, bookingId: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/agency/${agencyId}/bookings/accept/${bookingId}`, {});
  }

  cancelBookingByAgency(agencyId: string, bookingId: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/agency/${agencyId}/bookings/cancel/${bookingId}`, {});
  }

  getAgencyBookings(agencyId: string, params: PaginationParams): Observable<PaginatedResponse<Booking>> {
    const httpParams = new HttpParams()
      .set('offset', params.offset.toString())
      .set('limit', params.limit.toString());
    return this.http.get<PaginatedResponse<Booking>>(
      `${this.API_URL}/agency/${agencyId}/bookings`,
      { params: httpParams }
    );
  }

  // User Booking endpoints
  getMyBookings(params: PaginationParams): Observable<PaginatedResponse<Booking>> {
    const httpParams = new HttpParams()
      .set('offset', params.offset.toString())
      .set('limit', params.limit.toString());
    return this.http.get<PaginatedResponse<Booking>>(`${this.API_URL}/user/bookings/my`, { params: httpParams });
  }

  createBooking(travelPackageId: string, data: CreateBookingRequest): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/user/bookings/${travelPackageId}`, data);
  }

  cancelBookingByUser(bookingId: string): Observable<Booking> {
    return this.http.post<Booking>(`${this.API_URL}/user/bookings/cancel/${bookingId}`, {});
  }

  getPriceBreakdown(travelPackageId: string, data: PriceBreakdownRequest): Observable<PriceBreakdown> {
    return this.http.post<PriceBreakdown>(`${this.API_URL}/user/bookings/price-breakdown/${travelPackageId}`, data);
  }
}
