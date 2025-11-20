import { JwtPayload } from 'jsonwebtoken';

export interface CustomJWTPayload extends JwtPayload {
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

export type TokenType = 'access' | 'refresh';
