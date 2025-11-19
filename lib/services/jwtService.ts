import jwt from 'jsonwebtoken';
import { CustomJWTPayload, TokenType } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
const ACCESS_TOKEN_EXPIRY = '15m';   // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d';   // 7 days

export class JWTService {
  /**
   * Generate an access token
   * @param payload User information for token
   * @returns Access token string
   */
  static generateAccessToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(
      { ...payload, type: TokenType.ACCESS },
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  }

  /**
   * Generate a refresh token
   * @param payload User information for token
   * @returns Refresh token string
   */
  static generateRefreshToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(
      { ...payload, type: TokenType.REFRESH },
      JWT_SECRET,
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
  }

  /**
   * Validate and decode a JWT token
   * @param token JWT token to validate
   * @param tokenType Optional token type to validate
   * @returns Decoded token payload
   */
  static verifyToken(token: string, tokenType?: TokenType): CustomJWTPayload {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as CustomJWTPayload;
      
      if (tokenType && decoded.type !== tokenType) {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Refresh an access token using a valid refresh token
   * @param refreshToken Current refresh token
   * @returns New access token
   */
  static refreshAccessToken(refreshToken: string): string {
    const decoded = this.verifyToken(refreshToken, TokenType.REFRESH);
    
    return this.generateAccessToken({
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    });
  }
}