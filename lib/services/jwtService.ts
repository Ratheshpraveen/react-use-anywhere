import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
const JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION || '7d';

export class JWTService {
  /**
   * Generate an access token
   * @param payload User payload to encode in the token
   * @returns Access token string
   */
  static generateAccessToken(payload: Omit<CustomJWTPayload, 'exp' | 'iat'>) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  /**
   * Generate a refresh token
   * @param payload User payload to encode in the token
   * @returns Refresh token string
   */
  static generateRefreshToken(payload: Omit<CustomJWTPayload, 'exp' | 'iat'>) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
  }

  /**
   * Verify and decode a JWT token
   * @param token Token to verify
   * @returns Decoded payload or null if invalid
   */
  static verifyToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Refresh an access token using a refresh token
   * @param refreshToken Refresh token
   * @returns New access token or null if invalid
   */
  static refreshAccessToken(refreshToken: string): string | null {
    const decoded = this.verifyToken(refreshToken);
    if (!decoded) return null;

    // Remove exp and iat for new token generation
    const { exp, iat, ...payload } = decoded;
    return this.generateAccessToken(payload);
  }
}
