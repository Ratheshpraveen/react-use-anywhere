import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/authConfig';

export interface UserPayload {
  id: string;
  email: string;
  role?: string;
}

export function generateToken(user: UserPayload): string {
  return jwt.sign(
    { 
      sub: user.id, 
      email: user.email,
      role: user.role 
    }, 
    JWT_CONFIG.secret, 
    { 
      expiresIn: JWT_CONFIG.expiresIn,
      issuer: JWT_CONFIG.issuer 
    }
  );
}

export function verifyToken(token: string): UserPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_CONFIG.secret) as UserPayload;
    return {
      id: decoded.sub as string,
      email: decoded.email,
      role: decoded.role
    };
  } catch (error) {
    return null;
  }
}
