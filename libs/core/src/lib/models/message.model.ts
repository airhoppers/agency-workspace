// User profile info from conversation
export interface ConversationUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  profilePictureUrl?: string;
  username?: string;
  birthdate?: string;
  gender?: string;
  phoneNumber?: string;
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  bookingCount?: number;
}

// Agency info from conversation
export interface ConversationAgency {
  id: string;
  name: string;
  addressLine?: string;
  city?: string;
  country?: string;
  phoneNumber?: string;
  description?: string;
  imageLogo?: string;
  verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Booking info associated with conversation
export interface ConversationBooking {
  id: string;
  userId: string;
  travelPackageId: string;
  conversationId?: string;
  bookingReference?: string;
  bookingDate?: string;
  bookingStatus?: string;
  paymentStatus?: string;
  confirmationNumber?: string;
  totalPrice?: number;
  totalPriceCurrency?: string;
  taxesAndFees?: number;
  paymentDate?: string;
  numberOfAdults?: number;
  numberOfChildren?: number;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
}

// Last message in conversation
export interface LastMessage {
  message: Message;
  sender?: ConversationUser;
}

// Main conversation interface matching backend ConversationDto
export interface Conversation {
  id: string;
  user: ConversationUser;
  agency: ConversationAgency;
  unreadCount?: number;
  lastMessage?: LastMessage;
  booking?: ConversationBooking;
  // Legacy fields for backwards compatibility
  participants?: ConversationParticipant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ConversationParticipant {
  id: string;
  type: ParticipantType;
  name: string;
  imageUrl?: string;
}

export enum ParticipantType {
  USER = 'USER',
  AGENCY = 'AGENCY'
}

// Message matching backend MessageDto
export interface Message {
  id: string;
  body: string;
  sender: string; // sender ID or type
  timestamp?: string;
  type?: string;
  // Legacy fields
  conversationId?: string;
  senderId?: string;
  senderType?: ParticipantType;
  read?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SendMessageRequest {
  body: string;
}

// Response from cursor-based pagination for messages
export interface MessagePaginationResponse {
  messages: Message[];
  nextCursor?: string;
  hasMore?: boolean;
}
