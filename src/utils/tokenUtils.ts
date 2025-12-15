import jwt from 'jsonwebtoken';
import { UserRole } from '../middleware/authMiddleware';

// Secret keys - in a real app, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

interface TokenPayload {
  id: string;
  role: UserRole;
}

export class TokenUtils {
  // Generate Access Token
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  // Generate Refresh Token
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
  }

  // Validate Access Token
  static validateAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Validate Refresh Token
  static validateRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string, secret: string): boolean {
    try {
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
      return decoded.exp ? decoded.exp < Date.now() / 1000 : false;
    } catch (error) {
      return true;
    }
  }
}
