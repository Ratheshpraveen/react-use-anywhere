import { JWTService } from '../services/jwtService';
import { CustomJWTPayload } from '../types';

export interface AuthContext {
  user?: {
    id: string;
    email: string;
    role?: string;
  };
  isAuthenticated: boolean;
}

export function authMiddleware(token?: string): AuthContext {
  if (!token) {
    return { isAuthenticated: false };
  }

  const decodedToken = JWTService.verifyToken(token);
  
  if (!decodedToken) {
    return { isAuthenticated: false };
  }

  return {
    user: {
      id: decodedToken.userId,
      email: decodedToken.email,
      role: decodedToken.role
    },
    isAuthenticated: true
  };
}

export function requireAuth(context: AuthContext, requiredRoles?: string[]): boolean {
  if (!context.isAuthenticated) {
    return false;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    return requiredRoles.includes(context.user?.role || '');
  }

  return true;
}
