import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export class JWTService {
  /**
   * Generate an access token
   * @param payload User payload to encode in the token
   * @returns Access token string
   */
  static generateAccessToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  /**
   * Generate a refresh token
   * @param payload User payload to encode in the token
   * @returns Refresh token string
   */
  static generateRefreshToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  }

  /**
   * Validate an access token
   * @param token JWT token to validate
   * @returns Decoded payload or null if invalid
   */
  static validateAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Validate a refresh token
   * @param token Refresh token to validate
   * @returns Decoded payload or null if invalid
   */
  static validateRefreshToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh access token using a valid refresh token
   * @param refreshToken Refresh token
   * @returns New access token or null if refresh token is invalid
   */
  static refreshAccessToken(refreshToken: string): string | null {
    const decoded = this.validateRefreshToken(refreshToken);
    if (!decoded) return null;

    return this.generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });
  }
}
