// Authentication-related type definitions

/**
 * User credentials interface for login
 */
export interface UserCredentials {
  email: string;
  password: string;
}

/**
 * JWT payload structure
 */
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat: number;  // Issued at
  exp: number;  // Expiration time
}

/**
 * User roles for role-based access control
 */
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

/**
 * Authentication state interface
 */
export interface AuthState {
  isAuthenticated: boolean;
  user: JWTPayload | null;
  token: string | null;
}

/**
 * Login request type
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Login response type
 */
export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

/**
 * Registration request type
 */
export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  name?: string;
}

/**
 * Registration response type
 */
export interface RegisterResponse {
  id: string;
  email: string;
  role: UserRole;
}

/**
 * Token refresh request type
 */
export interface TokenRefreshRequest {
  refreshToken: string;
}

/**
 * Token refresh response type
 */
export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}
