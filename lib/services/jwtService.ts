import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types';

export class JWTService {
  private static SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_key';
  private static TOKEN_EXPIRATION = '1h';
  private static REFRESH_TOKEN_EXPIRATION = '7d';

  static generateToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn: this.TOKEN_EXPIRATION });
  }

  static generateRefreshToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn: this.REFRESH_TOKEN_EXPIRATION });
  }

  static verifyToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, this.SECRET_KEY) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token: string): CustomJWTPayload | null {
    return jwt.decode(token) as CustomJWTPayload | null;
  }

  static refreshToken(refreshToken: string): string | null {
    const decoded = this.verifyToken(refreshToken);
    if (!decoded) return null;

    // Create a new access token with the same payload
    return this.generateToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });
  }
}
