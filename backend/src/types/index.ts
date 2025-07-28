import { Document } from 'mongoose';

// User related types
export interface IUser extends Document {
  _id: string;
  email: string;
  password?: string;
  appleId?: string;
  name: string;
  age: number;
  occupation: string;
  bio: string;
  photos: string[];
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  preferences: {
    ageRange: {
      min: number;
      max: number;
    };
    maxDistance: number;
    interestedIn: 'men' | 'women' | 'both';
  };
  isPremium: boolean;
  premiumExpiresAt?: Date;
  isActive: boolean;
  lastActive: Date;
  swipes: {
    liked: string[];
    passed: string[];
  };
  matches: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Match related types
export interface IMatch extends Document {
  _id: string;
  users: [string, string];
  createdAt: Date;
  lastMessage?: string;
  lastMessageAt?: Date;
  isActive: boolean;
}

// Message related types
export interface IMessage extends Document {
  _id: string;
  matchId: string;
  senderId: string;
  content: string;
  messageType: 'text' | 'image' | 'gif';
  isRead: boolean;
  createdAt: Date;
}

// Swipe related types
export interface ISwipe extends Document {
  _id: string;
  swiperId: string;
  swipedUserId: string;
  action: 'like' | 'pass' | 'superlike';
  createdAt: Date;
}

// Subscription related types
export interface ISubscription extends Document {
  _id: string;
  userId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: 'active' | 'canceled' | 'past_due' | 'incomplete';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  createdAt: Date;
  updatedAt: Date;
}

// AI Recommendation types
export interface IAIRecommendation extends Document {
  _id: string;
  userId: string;
  recommendedUsers: string[];
  algorithm: 'preferences' | 'behavior' | 'lookalike';
  score: number;
  createdAt: Date;
}

// Request types
export interface AuthRequest extends Express.Request {
  user?: IUser;
}

export interface SwipeRequest {
  targetUserId: string;
  action: 'like' | 'pass' | 'superlike';
}

export interface MessageRequest {
  matchId: string;
  content: string;
  messageType?: 'text' | 'image' | 'gif';
}

export interface ProfileUpdateRequest {
  name?: string;
  age?: number;
  occupation?: string;
  bio?: string;
  preferences?: {
    ageRange?: {
      min: number;
      max: number;
    };
    maxDistance?: number;
    interestedIn?: 'men' | 'women' | 'both';
  };
}

// Response types
export interface APIResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> extends APIResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// AI Matchmaking types
export interface MatchmakingCriteria {
  userId: string;
  location: [number, number];
  preferences: IUser['preferences'];
  excludeIds: string[];
  limit: number;
}

export interface LookalikeRequest {
  photo: string; // base64 or URL
  maxResults?: number;
}

// Socket types
export interface SocketUser {
  userId: string;
  socketId: string;
  isOnline: boolean;
  lastSeen: Date;
}