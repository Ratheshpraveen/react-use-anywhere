import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export class JWTService {
  static generateAccessToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  static generateRefreshToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  }

  static verifyAccessToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token: string): CustomJWTPayload | null {
    return jwt.decode(token) as CustomJWTPayload | null;
  }
}
