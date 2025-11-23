import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types';

export class JWTService {
  private static SECRET_KEY = process.env.JWT_SECRET || 'your_default_secret_key';
  private static EXPIRATION = '1h';

  static generateToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, this.SECRET_KEY, { expiresIn: this.EXPIRATION });
  }

  static verifyToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, this.SECRET_KEY) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  static refreshToken(token: string): string | null {
    try {
      const decoded = this.verifyToken(token);
      if (!decoded) return null;

      // Remove exp and iat for new token generation
      const { exp, iat, ...payload } = decoded;
      return this.generateToken(payload);
    } catch (error) {
      return null;
    }
  }
}
