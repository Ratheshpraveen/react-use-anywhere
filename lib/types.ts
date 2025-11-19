// Authentication Types for JWT Implementation

export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
  iat?: number; // Issued at
  exp?: number; // Expiration time
}

export interface AuthState {
  isAuthenticated: boolean;
  user: JWTPayload | null;
  token: string | null;
  refreshToken?: string | null;
}

// Existing types can remain unchanged
export interface User {
  id: string;
  email: string;
  // other existing user properties
}