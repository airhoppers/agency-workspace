import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_ENVIRONMENT } from '../config';
import { AgencyStatistics, StatisticsFilter } from '../models';

// MongoDB-style filter query format expected by backend
interface FilterQuery {
  and?: FilterCondition[];
  or?: FilterCondition[];
  eq?: [string, any];
  gt?: [string, any];
  gte?: [string, any];
  lt?: [string, any];
  lte?: [string, any];
  regex?: [string, string];
  in?: [string, any[]];
}

type FilterCondition = FilterQuery;

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly API_URL = this.env.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Get agency statistics with optional filtering
   * Uses POST with MongoDB-style filter query in request body
   */
  getAgencyStatistics(agencyId: string, filter?: StatisticsFilter): Observable<AgencyStatistics> {
    // Build MongoDB-style filter query from StatisticsFilter
    const filterQuery = this.buildFilterQuery(filter);

    return this.http.post<AgencyStatistics>(
      `${this.API_URL}/agency/${agencyId}/statistics`,
      filterQuery
    );
  }

  /**
   * Get comprehensive statistics in a single query (most efficient)
   */
  getComprehensiveStatistics(agencyId: string): Observable<AgencyStatistics> {
    return this.http.get<AgencyStatistics>(
      `${this.API_URL}/agency/${agencyId}/statistics/comprehensive`
    );
  }

  /**
   * Get essential statistics quickly (lightweight)
   */
  getQuickStatistics(agencyId: string): Observable<{
    totalBookings: number;
    totalRevenue: number;
    totalCustomers: number;
    avgBookingValue: number;
    cancellationRate: number;
  }> {
    return this.http.get<any>(
      `${this.API_URL}/agency/${agencyId}/statistics/quick`
    );
  }

  getUserStatistics(): Observable<any> {
    return this.http.get(`${this.API_URL}/user/statistics`);
  }

  /**
   * Convert StatisticsFilter to MongoDB-style filter query
   * Supports: date range, status, revenue range, customer filters
   */
  private buildFilterQuery(filter?: StatisticsFilter): FilterQuery | null {
    if (!filter) {
      return null;
    }

    const conditions: FilterCondition[] = [];

    // Date range filters
    if (filter.startDate) {
      conditions.push({ gte: ['bookingDate', filter.startDate] });
    }
    if (filter.endDate) {
      conditions.push({ lte: ['bookingDate', filter.endDate] });
    }

    // Booking status filter (can be single or multiple)
    if (filter.status && filter.status.length > 0) {
      if (filter.status.length === 1) {
        conditions.push({ eq: ['bookingStatus', filter.status[0]] });
      } else {
        const statusConditions = filter.status.map(s => ({ eq: ['bookingStatus', s] } as FilterCondition));
        conditions.push({ or: statusConditions });
      }
    }

    // Revenue range filters
    if (filter.minRevenue !== undefined && filter.minRevenue !== null) {
      conditions.push({ gte: ['totalPrice', filter.minRevenue] });
    }
    if (filter.maxRevenue !== undefined && filter.maxRevenue !== null) {
      conditions.push({ lte: ['totalPrice', filter.maxRevenue] });
    }

    // Number of adults filter
    if (filter.minAdults !== undefined && filter.minAdults !== null) {
      conditions.push({ gte: ['numberOfAdults', filter.minAdults] });
    }

    // Payment status filter
    if (filter.paymentStatus) {
      conditions.push({ eq: ['paymentStatus', filter.paymentStatus] });
    }

    // Package title search (regex)
    if (filter.packageSearch) {
      conditions.push({ regex: ['packageTitle', `.*${filter.packageSearch}.*`] });
    }

    if (conditions.length === 0) {
      return null;
    }

    if (conditions.length === 1) {
      return conditions[0];
    }

    return { and: conditions };
  }
}
