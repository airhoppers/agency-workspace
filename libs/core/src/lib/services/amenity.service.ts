import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_ENVIRONMENT } from '../config';
import { Amenity, AmenityCategory } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AmenityService {
  private readonly env = inject(APP_ENVIRONMENT);
  private readonly API_URL = `${this.env.apiUrl}/amenities`;

  constructor(private http: HttpClient) {}

  getAllAmenities(): Observable<Amenity[]> {
    return this.http.get<Amenity[]>(this.API_URL);
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_URL}/categories`);
  }

  getAmenitiesByCategory(): Observable<AmenityCategory[]> {
    return this.http.get<AmenityCategory[]>(`${this.API_URL}/by-category`);
  }

  getAmenitiesByCategoryName(categoryName: string): Observable<Amenity[]> {
    return this.http.get<Amenity[]>(`${this.API_URL}/category/${categoryName}`);
  }
}
