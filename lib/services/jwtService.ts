import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types';

// Ensure you have a .env file with JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION';
const JWT_EXPIRATION = '1h';
const REFRESH_TOKEN_EXPIRATION = '7d';

export class JWTService {
  /**
   * Generate an access token
   * @param payload User information to encode in the token
   * @returns JWT access token
   */
  static generateAccessToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  /**
   * Generate a refresh token
   * @param payload User information to encode in the token
   * @returns JWT refresh token
   */
  static generateRefreshToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  }

  /**
   * Verify and decode a JWT token
   * @param token JWT token to verify
   * @returns Decoded token payload
   */
  static verifyToken(token: string): CustomJWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Refresh an access token using a refresh token
   * @param refreshToken Refresh token
   * @returns New access token
   */
  static refreshAccessToken(refreshToken: string): string {
    try {
      const decoded = this.verifyToken(refreshToken);
      return this.generateAccessToken({
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
