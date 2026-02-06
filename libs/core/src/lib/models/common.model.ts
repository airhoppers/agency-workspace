export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  offset: number;
  limit: number;
  hasMore: boolean;
}

export interface PaginationParams {
  offset: number;
  limit: number;
}

// Cursor-based pagination for messages
export interface CursorPaginationParams {
  cursor?: string;
  limit: number;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: FieldError[];
  timestamp?: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface Amenity {
  id: string;
  name: string;
  category?: string;
  iconUrl?: string;
}

export interface AmenityCategory {
  name: string;
  amenities: Amenity[];
}
