import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types';

export class JWTService {
  private static SECRET_KEY = process.env.JWT_SECRET || 'your_default_secret_key';
  private static REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET || 'your_default_refresh_secret_key';

  static generateAccessToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn: '15m' });
  }

  static generateRefreshToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, this.REFRESH_SECRET_KEY, { expiresIn: '7d' });
  }

  static verifyAccessToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, this.SECRET_KEY) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, this.REFRESH_SECRET_KEY) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  static refreshAccessToken(refreshToken: string): string | null {
    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) return null;

    return this.generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });
  }
}
