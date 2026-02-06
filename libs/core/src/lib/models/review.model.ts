export interface Review {
  id: string;
  bookingId: string;
  travelPackageId: string;
  userId: string;
  user?: ReviewUser;
  rating: number;
  title?: string;
  comment?: string;
  helpfulCount?: number;
  isHelpfulByCurrentUser?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ReviewUser {
  id: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
}

export interface CreateReviewRequest {
  rating: number;
  title?: string;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  comment?: string;
}

export interface ReviewSummary {
  travelPackageId: string;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: RatingDistribution;
}

export interface RatingDistribution {
  [rating: number]: number;
}
