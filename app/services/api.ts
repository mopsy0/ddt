import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear storage and redirect to login
      await AsyncStorage.multiRemove(['authToken', 'userProfile']);
      // You can add navigation logic here if needed
    }
    return Promise.reject(error);
  }
);

// API Response types
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

// User types
export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  occupation: string;
  bio: string;
  photos: string[];
  preferences: {
    ageRange: { min: number; max: number };
    maxDistance: number;
    interestedIn: 'men' | 'women' | 'both';
  };
  isPremium: boolean;
  lastActive: string;
  createdAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  name: string;
  age: number;
  occupation: string;
  bio?: string;
  preferences: {
    ageRange: { min: number; max: number };
    maxDistance: number;
    interestedIn: 'men' | 'women' | 'both';
  };
  location: {
    coordinates: [number, number];
  };
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Authentication API
export const authAPI = {
  // Register new user
  signup: async (data: SignupData): Promise<APIResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/signup', data);
    return response.data;
  },

  // Login user
  login: async (credentials: LoginCredentials): Promise<APIResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  },

  // Apple Sign In
  appleSignIn: async (appleData: {
    appleId: string;
    email: string;
    name?: string;
  }): Promise<APIResponse<AuthResponse | { needsProfileSetup: boolean }>> => {
    const response = await apiClient.post('/auth/apple', appleData);
    return response.data;
  },

  // Complete Apple Sign In profile
  completeAppleSignIn: async (data: any): Promise<APIResponse<AuthResponse>> => {
    const response = await apiClient.post('/auth/apple/complete', data);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<APIResponse<{ user: User }>> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: async (): Promise<APIResponse> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },
};

// Users API (to be implemented in backend)
export const usersAPI = {
  // Get user profile by ID
  getUserProfile: async (userId: string): Promise<APIResponse<User>> => {
    const response = await apiClient.get(`/users/profile/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<APIResponse<User>> => {
    const response = await apiClient.put('/users/profile', updates);
    return response.data;
  },

  // Upload photos
  uploadPhotos: async (photos: FormData): Promise<APIResponse<{ photos: string[] }>> => {
    const response = await apiClient.post('/users/photos', photos, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Delete photo
  deletePhoto: async (photoId: string): Promise<APIResponse> => {
    const response = await apiClient.delete(`/users/photos/${photoId}`);
    return response.data;
  },

  // Get AI recommendations
  getRecommendations: async (limit: number = 10): Promise<APIResponse<User[]>> => {
    const response = await apiClient.get(`/users/recommendations?limit=${limit}`);
    return response.data;
  },

  // Find lookalike users
  findLookalikes: async (photo: FormData): Promise<APIResponse<User[]>> => {
    const response = await apiClient.post('/users/lookalike', photo, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Swipes API
export const swipesAPI = {
  // Record swipe action
  swipe: async (data: {
    targetUserId: string;
    action: 'like' | 'pass' | 'superlike';
  }): Promise<APIResponse<{ isMatch: boolean; matchId?: string }>> => {
    const response = await apiClient.post('/swipes', data);
    return response.data;
  },

  // Get swipe history
  getSwipeHistory: async (
    action?: 'like' | 'pass' | 'superlike',
    page: number = 1
  ): Promise<PaginatedResponse<any>> => {
    const params = new URLSearchParams();
    if (action) params.append('action', action);
    params.append('page', page.toString());
    
    const response = await apiClient.get(`/swipes/history?${params}`);
    return response.data;
  },

  // Get swipe analytics
  getAnalytics: async (): Promise<APIResponse<{
    likes: number;
    passes: number;
    superlikes: number;
    total: number;
  }>> => {
    const response = await apiClient.get('/swipes/analytics');
    return response.data;
  },
};

// Matches API
export const matchesAPI = {
  // Get user matches
  getMatches: async (page: number = 1): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get(`/matches?page=${page}`);
    return response.data;
  },

  // Get specific match
  getMatch: async (matchId: string): Promise<APIResponse<any>> => {
    const response = await apiClient.get(`/matches/${matchId}`);
    return response.data;
  },

  // Unmatch user
  unmatch: async (matchId: string): Promise<APIResponse> => {
    const response = await apiClient.delete(`/matches/${matchId}`);
    return response.data;
  },
};

// Messages API
export const messagesAPI = {
  // Get match messages
  getMessages: async (
    matchId: string,
    page: number = 1
  ): Promise<PaginatedResponse<any>> => {
    const response = await apiClient.get(`/messages/${matchId}?page=${page}`);
    return response.data;
  },

  // Send message
  sendMessage: async (data: {
    matchId: string;
    content: string;
    messageType?: 'text' | 'image' | 'gif';
  }): Promise<APIResponse<any>> => {
    const response = await apiClient.post('/messages', data);
    return response.data;
  },

  // Mark message as read
  markAsRead: async (messageId: string): Promise<APIResponse> => {
    const response = await apiClient.put(`/messages/${messageId}/read`);
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<APIResponse<{ count: number }>> => {
    const response = await apiClient.get('/messages/unread-count');
    return response.data;
  },
};

// Subscriptions API
export const subscriptionsAPI = {
  // Create subscription
  createSubscription: async (priceId: string): Promise<APIResponse<any>> => {
    const response = await apiClient.post('/subscriptions/create', { priceId });
    return response.data;
  },

  // Cancel subscription
  cancelSubscription: async (): Promise<APIResponse> => {
    const response = await apiClient.post('/subscriptions/cancel');
    return response.data;
  },

  // Get subscription status
  getSubscriptionStatus: async (): Promise<APIResponse<any>> => {
    const response = await apiClient.get('/subscriptions/status');
    return response.data;
  },
};

// Utility functions
export const apiUtils = {
  // Store auth token
  storeAuthToken: async (token: string): Promise<void> => {
    await AsyncStorage.setItem('authToken', token);
  },

  // Get auth token
  getAuthToken: async (): Promise<string | null> => {
    return await AsyncStorage.getItem('authToken');
  },

  // Clear auth data
  clearAuthData: async (): Promise<void> => {
    await AsyncStorage.multiRemove(['authToken', 'userProfile']);
  },

  // Store user profile
  storeUserProfile: async (user: User): Promise<void> => {
    await AsyncStorage.setItem('userProfile', JSON.stringify(user));
  },

  // Get user profile
  getUserProfile: async (): Promise<User | null> => {
    const profileData = await AsyncStorage.getItem('userProfile');
    return profileData ? JSON.parse(profileData) : null;
  },
};

export default apiClient;