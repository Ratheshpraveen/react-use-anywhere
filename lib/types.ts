import { JwtPayload } from 'jsonwebtoken';

export interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
  role?: string;
}
