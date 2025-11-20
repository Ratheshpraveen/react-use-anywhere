import { JwtPayload } from 'jsonwebtoken';

// Extend JwtPayload to include custom claims
export interface CustomJWTPayload extends JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

// Authentication state interface for managing JWT-based authentication
export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: {
    id: string;
    email: string;
    role?: string;
  } | null;
  isAuthenticated: boolean;
  expiresAt: number | null;
}

// Optional: Define possible user roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest'
}
