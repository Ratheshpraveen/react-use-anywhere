import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

export class JWTService {
  /**
   * Generate an access token
   * @param payload User payload to encode in the token
   * @returns Access token string
   */
  static generateAccessToken(payload: CustomJWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
  }

  /**
   * Generate a refresh token
   * @param payload User payload to encode in the token
   * @returns Refresh token string
   */
  static generateRefreshToken(payload: CustomJWTPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });
  }

  /**
   * Validate and decode a token
   * @param token JWT token to validate
   * @returns Decoded token payload or null if invalid
   */
  static validateToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Decode a token without verification (for inspection)
   * @param token JWT token to decode
   * @returns Decoded token payload
   */
  static decodeToken(token: string): CustomJWTPayload | null {
    return jwt.decode(token) as CustomJWTPayload | null;
  }

  /**
   * Check if a token is expired
   * @param token JWT token to check
   * @returns Boolean indicating token expiration status
   */
  static isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp ? decoded.exp < currentTime : true;
  }
}
