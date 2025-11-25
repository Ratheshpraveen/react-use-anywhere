import { JWTPayload } from 'jsonwebtoken';

export interface CustomJWTPayload extends JWTPayload {
  userId: string;
  email?: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: CustomJWTPayload | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
