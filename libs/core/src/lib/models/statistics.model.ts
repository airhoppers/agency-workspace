// Main Statistics Response matching AgencyMainStatsDto
export interface AgencyStatistics {
  bookingStats: BookingStats;
  revenueStats: RevenueStats;
  customerStats: CustomerStats;
  feedbackStats: FeedbackStats;
  operationalStats?: OperationalStats;
  performanceStats?: PerformanceStats;
  seasonalPatterns?: SeasonalPatterns;
}

// Booking Statistics
export interface BookingStats {
  totalBookings: number;
  statusDistribution: Record<string, number>;
  topDestinations: DestinationStats[];
  topBookingCountries: CountryStats[];
  categoryBreakdown: CategoryStats[];
  bookingTrends: BookingTrend[];
  recentBookings: BookingDetail[];
  bookingMetrics: BookingMetrics;
}

export interface DestinationStats {
  destination: string;
  bookingCount: number;
  percentage: number;
}

export interface CountryStats {
  country: string;
  bookingCount: number;
  percentage: number;
}

export interface CategoryStats {
  category: string;
  bookingCount: number;
  percentage: number;
}

export interface BookingTrend {
  date: string;
  bookingCount: number;
  statusBreakdown?: Record<string, number>;
}

export interface BookingDetail {
  bookingId: string;
  bookingReference: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  travelPackageId: string;
  travelPackageTitle: string;
  status: string;
  totalPrice: number;
  currency: string;
  bookingDate: string;
  createdAt: string;
  acceptedAt?: string;
  cancelledAt?: string;
  numberOfAdults: number;
  numberOfChildren: number;
  contactPhone?: string;
  paymentStatus: string;
}

export interface BookingMetrics {
  avgBookingValue: number;
  avgProcessingTimeHours: number;
  cancellationRate: number;
  totalGuests: number;
  avgGroupSize: number;
  bookingsByMonth: Record<string, number>;
  bookingsByDayOfWeek: Record<string, number>;
  pendingBookingsCount: number;
  overdueBookingsCount: number;
}

// Revenue Statistics
export interface RevenueStats {
  totalRevenue: number;
  currency: string;
  avgRevenuePerBooking: number;
  avgRevenuePerCustomer: number;
  revenueByDestination: Record<string, number>;
  revenueByCategory: Record<string, number>;
  revenueTrends: RevenueTrend[];
  revenueMetrics?: RevenueMetrics;
  topCustomers: TopCustomer[];
}

export interface RevenueTrend {
  date: string;
  revenue: number;
  bookingCount: number;
}

export interface RevenueMetrics {
  totalConfirmedRevenue?: number;
  totalAcceptedRevenue?: number;
  totalFinishedRevenue?: number;
  totalPendingRevenue?: number;
  totalLostRevenue?: number;
  revenueGrowthRate?: number;
  highestBookingValue?: number;
  lowestBookingValue?: number;
  revenueByPaymentStatus?: Record<string, number>;
  avgDailyRevenue: number;
  avgWeeklyRevenue?: number;
  avgMonthlyRevenue: number;
  totalTaxesAndFees?: number;
  peakRevenueDay?: string;
  peakRevenueAmount?: number;
}

export interface TopCustomer {
  userId: string;
  customerName: string;
  customerEmail: string;
  totalSpent: number;
  bookingCount: number;
  avgBookingValue: number;
  firstBookingDate: string;
  lastBookingDate: string;
  customerType: string;
}

// Customer Statistics
export interface CustomerStats {
  totalCustomers: number;
  newCustomers: number;
  repeatCustomers: number;
  repeatCustomerRate: number;
  avgSpendingPerCustomer: number;
  repeatCustomerAvgSpending: number;
  customerMetrics?: CustomerMetrics;
  customerSegments?: CustomerSegment[];
  avgCustomerLifetimeValue: number;
  clvBySegment?: Record<string, number>;
  avgMonthsActive?: number;
  customerRetentionRate?: number;
}

export interface CustomerMetrics {
  activeCustomers?: number;
  customerRetentionRate?: number;
  customerAcquisitionRate?: number;
  vipCustomers?: number;
  avgCustomerLifetimeValue?: number;
  customersByCountry?: Record<string, number>;
  customersByAgeGroup?: Record<string, number>;
  avgTimeBetweenBookings?: number;
  customersWithMultipleBookings?: number;
  avgBookingsPerCustomer?: number;
  avgDaysBetweenBookings?: number;
  customerChurnRate?: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  percentage: number;
  avgSpending: number;
}

// Feedback Statistics
export interface FeedbackStats {
  overallAverageRating: number;
  totalReviews: number;
  ratingsByDestination: Record<string, number>;
  ratingsByCategory: Record<string, number>;
  ratingDistribution: StatsRatingDistribution[];
}

export interface StatsRatingDistribution {
  rating: number;
  count: number;
  percentage: number;
}

// Operational Statistics
export interface OperationalStats {
  avgResponseTime?: number;
  peakBookingHour?: number;
  peakBookingDay?: string;
  peakBookingMonth?: string;
  totalPackagesOffered?: number;
  activePackages?: number;
  packageBookingRate?: number;
  staffWorkload?: Record<string, number>;
  avgBookingsPerDay?: number;
  maxBookingsInDay?: number;
  avgResponseTimeHours?: number;
  pendingActions?: number;
  completionRate?: number;
}

// Performance Statistics
export interface PerformanceStats {
  conversionRate?: number;
  confirmationRate?: number;
  cancellationRate?: number;
  customerSatisfactionScore?: number;
  totalInquiries?: number;
  totalViews?: number;
  inquiryToBookingRate?: number;
  packagePerformance?: Record<string, number>;
  topPerformingPackages?: string[];
  underPerformingPackages?: string[];
  avgPackageViews?: number;
  bookingToViewRatio?: number;
}

// Seasonal Patterns
export interface SeasonalPatterns {
  bookingsByMonth?: Record<string, number>;
  revenueByMonth?: Record<string, number>;
  peakMonth?: string;
  slowestMonth?: string;
  seasonalityIndex?: number;
  peakMonths?: string[];
  lowMonths?: string[];
  seasonalTrends?: Record<string, number>;
}

// Filter for statistics requests
export interface StatisticsFilter {
  startDate?: string;
  endDate?: string;
  status?: string[];
  minRevenue?: number;
  maxRevenue?: number;
  minAdults?: number;
  paymentStatus?: string;
  packageSearch?: string;
}

// Legacy interfaces for backwards compatibility
export interface MonthlyBookings {
  month: string;
  year: number;
  count: number;
}

export interface MonthlyRevenue {
  month: string;
  year: number;
  amount: number;
  currency: string;
}

export interface TopPackage {
  id: string;
  title: string;
  bookingsCount: number;
  revenue: number;
}
