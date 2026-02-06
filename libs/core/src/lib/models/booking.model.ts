export interface Booking {
  id: string;
  travelPackageId: string;
  travelPackage?: BookingTravelPackage;
  userId: string;
  user?: BookingUser;
  bookingReference?: string;
  bookingDate?: string;
  numberOfAdults: number;
  numberOfChildren: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: BookingStatus;
  bookingStatus?: string;
  totalPrice?: number;
  totalPriceCurrency?: string;
  priceCurrency?: string;
  taxesAndFees?: number;
  paymentStatus?: PaymentStatus | string;
  paymentDate?: string;
  confirmationNumber?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BookingTravelPackage {
  id: string;
  title: string;
  price: number;
  priceCurrency: string;
  startDate: string;
  imageUrl?: string;
}

export interface BookingUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export enum BookingStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export interface CreateBookingRequest {
  numberOfAdults: number;
  numberOfChildren: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

export interface PriceBreakdownRequest {
  numberOfAdults: number;
  numberOfChildren: number;
}

export interface PriceBreakdown {
  basePrice: number;
  adultPrice: number;
  childPrice: number;
  totalPrice: number;
  currency: string;
  fees?: Fee[];
  discounts?: Discount[];
}

export interface Fee {
  name: string;
  amount: number;
}

export interface Discount {
  name: string;
  amount: number;
  percentage?: number;
}
