import { JwtPayload } from 'jsonwebtoken';

export interface JWTPayload extends JwtPayload {
  userId: string;
  role?: string;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  user: {
    id: string;
    role?: string;
  } | null;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    role?: string;
  };
}
