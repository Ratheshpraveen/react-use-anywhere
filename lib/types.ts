import { JwtPayload } from 'jsonwebtoken';

export interface CustomJWTPayload extends JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role?: string;
}
