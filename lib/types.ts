import { JwtPayload } from 'jsonwebtoken';

// JWT Payload interface extending standard JWT payload
export interface CustomJWTPayload extends JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

// Authentication state interface for managing JWT-based authentication
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: string;
    email: string;
    role?: string;
  } | null;
  expiresAt: number | null;
}

// Optional: User interface for type consistency
export interface User {
  id: string;
  email: string;
  role?: string;
  password?: string; // Hashed password
}