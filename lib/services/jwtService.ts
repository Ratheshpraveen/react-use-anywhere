import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';
const REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

export class JWTService {
  /**
   * Generate an access token for a user
   * @param userId User's unique identifier
   * @param email User's email
   * @param role Optional user role
   * @returns JWT access token
   */
  static generateAccessToken(userId: string, email: string, role?: string): string {
    const payload: CustomJWTPayload = {
      userId,
      email,
      role,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  /**
   * Generate a refresh token for a user
   * @param userId User's unique identifier
   * @param email User's email
   * @returns JWT refresh token
   */
  static generateRefreshToken(userId: string, email: string): string {
    const payload: CustomJWTPayload = {
      userId,
      email,
    };

    return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION });
  }

  /**
   * Verify and decode an access token
   * @param token JWT access token
   * @returns Decoded token payload or null
   */
  static verifyAccessToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify and decode a refresh token
   * @param token JWT refresh token
   * @returns Decoded token payload or null
   */
  static verifyRefreshToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, REFRESH_TOKEN_SECRET) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh access token using a valid refresh token
   * @param refreshToken Existing refresh token
   * @returns New access token or null
   */
  static refreshAccessToken(refreshToken: string): string | null {
    const decoded = this.verifyRefreshToken(refreshToken);
    
    if (decoded) {
      return this.generateAccessToken(decoded.userId, decoded.email, decoded.role);
    }

    return null;
  }
}
