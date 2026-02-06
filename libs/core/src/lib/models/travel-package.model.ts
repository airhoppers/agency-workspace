export interface TravelPackage {
  id: string;
  agencyId: string;
  agency?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
  creatorId?: string;
  title: string;
  description?: string;
  // Price is a number from API, with separate priceCurrency field
  price: number;
  priceCurrency?: string;
  startDate?: string;
  endDate?: string;
  maxBookings?: number;
  currentBookings?: number;
  confirmedBookings?: number;
  // API returns 'images' array for package images
  images?: string[];
  // Legacy: some endpoints return 'files' instead of 'images'
  files?: string[];
  status?: TravelPackageStatus;
  details?: TravelPackageDetails;
  categoryIds?: string[];
  // Categories from API have 'categoryName' not 'name'
  categories?: TravelPackageCategory[];
  rating?: number;
  reviewCount?: number;
  destination?: string;
  duration?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Category as returned in travel package response
export interface TravelPackageCategory {
  id: string;
  categoryName: string;
  iconUrl?: string;
  description?: string;
  priority?: number;
  tagline?: string;
}

export enum TravelPackageStatus {
  CREATED = 'CREATED',
  AVAILABLE = 'AVAILABLE',
  FULLY_BOOKED = 'FULLY_BOOKED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED'
}

export interface TravelPackageDetails {
  hotelInfo?: HotelInfo;
  transportationInfo?: TransportationInfo[];
  flightInfo?: FlightInfo;
  journeys?: Journey[];
}

export interface Journey {
  journeyType: 'OUTBOUND' | 'RETURN';
  segments: JourneySegment[];
  totalDurationMinutes?: number;
  origin?: LocationInfo;
  finalDestination?: LocationInfo;
  layovers?: Layover[];
  stops?: number;
  direct?: boolean;
}

export interface JourneySegment {
  type: string;
  number?: string;
  departure: LocationInfo;
  arrival: LocationInfo;
  carrier?: string;
  status?: string;
  baggage?: string;
}

export interface Layover {
  city?: string;
  terminal?: string;
  durationMinutes?: number;
  formattedDuration?: string;
}

export interface HotelInfo {
  hotelName?: string;
  hotelAddress?: string;
  roomType?: string;
  amenities?: string[];
  checkInTime?: string;
  checkOutTime?: string;
}

export interface TransportationInfo {
  type: TransportationType;
  number?: string;
  carrier?: string;
  departure: LocationInfo;
  arrival: LocationInfo;
  status?: TransportationStatus;
  baggage?: string;
}

export enum TransportationType {
  FLIGHT = 'FLIGHT',
  TRAIN = 'TRAIN',
  BUS = 'BUS',
  FERRY = 'FERRY',
  CAR = 'CAR'
}

export enum TransportationStatus {
  SCHEDULED = 'SCHEDULED',
  ON_TIME = 'ON_TIME',
  DELAYED = 'DELAYED',
  CANCELLED = 'CANCELLED'
}

export interface LocationInfo {
  time: string;
  terminal?: string;
  terminalName?: string;
  city?: string;
  country?: string;
}

export interface FlightInfo {
  flightNumber?: string;
  airline?: string;
  departureAirport?: string;
  arrivalAirport?: string;
  departureTime?: string;
  arrivalTime?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
}

export interface CreateTravelPackageRequest {
  title: string;
  description?: string;
  price: number;
  priceCurrency: string;
  startDate: string;
  endDate?: string;
  maxBookings: number;
  categoryIds?: string[];
  details?: TravelPackageDetails;
}

export interface UpdateTravelPackageRequest {
  title?: string;
  description?: string;
  price?: number;
  priceCurrency?: string;
  startDate?: string;
  endDate?: string;
  maxBookings?: number;
  categoryIds?: string[];
  details?: TravelPackageDetails;
  status?: TravelPackageStatus;
}

export interface FavoriteUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  favoritedAt?: string;
}
