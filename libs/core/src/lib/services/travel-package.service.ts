import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { APP_ENVIRONMENT } from '../config';
import {
  TravelPackage,
  CreateTravelPackageRequest,
  UpdateTravelPackageRequest,
  FavoriteUser,
  Category,
  PaginatedResponse,
  PaginationParams
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TravelPackageService {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly API_URL = this.env.apiUrl;

  constructor(private http: HttpClient) {}

  // Agency Travel Package endpoints
  getAgencyTravelPackages(
    agencyId: string,
    params: PaginationParams,
    filters?: Record<string, any>
  ): Observable<PaginatedResponse<TravelPackage>> {
    const httpParams = new HttpParams()
      .set('offset', params.offset.toString())
      .set('limit', params.limit.toString());
    return this.http.post<PaginatedResponse<TravelPackage>>(
      `${this.API_URL}/agency/${agencyId}/travelpackage/list`,
      filters ?? null,
      { params: httpParams }
    );
  }

  createTravelPackage(agencyId: string, data: CreateTravelPackageRequest, files?: File[]): Observable<TravelPackage> {
    const formData = this.buildTravelPackageFormData(data, files);
    return this.http.post<TravelPackage>(`${this.API_URL}/agency/${agencyId}/travelpackage`, formData);
  }

  updateTravelPackage(agencyId: string, packageId: string, data: UpdateTravelPackageRequest, files?: File[]): Observable<TravelPackage> {
    const formData = this.buildTravelPackageFormData(data, files);
    return this.http.put<TravelPackage>(`${this.API_URL}/agency/${agencyId}/travelpackage/${packageId}`, formData);
  }

  deleteTravelPackage(agencyId: string, packageId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/agency/${agencyId}/travelpackage/${packageId}`);
  }

  // Get a single travel package by ID (agency endpoint - includes maxBookings)
  getAgencyTravelPackageById(agencyId: string, packageId: string): Observable<TravelPackage> {
    return this.http.get<TravelPackage>(`${this.API_URL}/agency/${agencyId}/travelpackage/${packageId}`);
  }

  getFavoriteUsers(agencyId: string, packageId: string, params: PaginationParams): Observable<PaginatedResponse<FavoriteUser>> {
    const httpParams = new HttpParams()
      .set('offset', params.offset.toString())
      .set('limit', params.limit.toString());
    return this.http.get<PaginatedResponse<FavoriteUser>>(
      `${this.API_URL}/agency/${agencyId}/travelpackage/${packageId}/favorites/users`,
      { params: httpParams }
    );
  }

  // User Travel Package endpoints
  getTravelPackageById(packageId: string): Observable<TravelPackage> {
    return this.http.get<TravelPackage>(`${this.API_URL}/user/package/${packageId}`);
  }

  searchTravelPackages(query: string, params: PaginationParams): Observable<PaginatedResponse<TravelPackage>> {
    const httpParams = new HttpParams()
      .set('offset', params.offset.toString())
      .set('limit', params.limit.toString())
      .set('q', query);
    return this.http.get<PaginatedResponse<TravelPackage>>(`${this.API_URL}/user/package/search`, { params: httpParams });
  }

  getCategories(params: PaginationParams): Observable<PaginatedResponse<Category>> {
    const httpParams = new HttpParams()
      .set('offset', params.offset.toString())
      .set('limit', params.limit.toString());
    return this.http.get<PaginatedResponse<any>>(`${this.API_URL}/user/package/categories`, { params: httpParams }).pipe(
      map(response => ({
        ...response,
        data: response.data?.map((cat: any) => ({
          id: cat.id,
          name: cat.categoryName || cat.name,
          description: cat.description,
          iconUrl: cat.iconUrl
        })) || []
      }))
    );
  }

  private buildTravelPackageFormData(data: any, files?: File[]): FormData {
    const formData = new FormData();

    // Add files
    if (files && files.length > 0) {
      files.forEach(file => formData.append('files', file));
    }

    // Add simple fields
    const simpleFields = ['title', 'description', 'price', 'priceCurrency', 'startDate', 'endDate', 'maxBookings', 'status'];
    simpleFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== null) {
        formData.append(field, data[field].toString());
      }
    });

    // Add category IDs
    if (data.categoryIds && data.categoryIds.length > 0) {
      data.categoryIds.forEach((id: string, index: number) => {
        formData.append(`categoryIds[${index}]`, id);
      });
    }

    // Add details (nested objects)
    if (data.details) {
      // Hotel Info
      if (data.details.hotelInfo) {
        const hotelInfo = data.details.hotelInfo;
        Object.entries(hotelInfo).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              formData.append(`details.hotelInfo.${key}`, value.join(', '));
            } else {
              formData.append(`details.hotelInfo.${key}`, value.toString());
            }
          }
        });
      }

      // Transportation Info
      if (data.details.transportationInfo && data.details.transportationInfo.length > 0) {
        data.details.transportationInfo.forEach((transport: any, index: number) => {
          const prefix = `details.transportationInfo[${index}]`;

          // Simple transport fields
          ['type', 'number', 'carrier', 'status', 'baggage'].forEach(field => {
            if (transport[field]) {
              formData.append(`${prefix}.${field}`, transport[field]);
            }
          });

          // Departure info
          if (transport.departure) {
            Object.entries(transport.departure).forEach(([key, value]) => {
              if (value) formData.append(`${prefix}.departure.${key}`, value.toString());
            });
          }

          // Arrival info
          if (transport.arrival) {
            Object.entries(transport.arrival).forEach(([key, value]) => {
              if (value) formData.append(`${prefix}.arrival.${key}`, value.toString());
            });
          }
        });
      }
    }

    return formData;
  }
}
