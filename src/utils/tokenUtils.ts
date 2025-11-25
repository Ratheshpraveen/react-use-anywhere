import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../config/.env' });

// Define token payload interface
interface TokenPayload {
  userId: string;
  email?: string;
}

class TokenUtils {
  private static JWT_SECRET = process.env.JWT_SECRET || '';
  private static JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
  private static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';
  private static REFRESH_TOKEN_EXPIRATION = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

  /**
   * Generate an access token
   * @param payload User information to encode in the token
   * @returns Generated JWT token
   */
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { 
      expiresIn: this.JWT_EXPIRATION 
    });
  }

  /**
   * Generate a refresh token
   * @param payload User information to encode in the token
   * @returns Generated refresh token
   */
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, { 
      expiresIn: this.REFRESH_TOKEN_EXPIRATION 
    });
  }

  /**
   * Verify an access token
   * @param token JWT token to verify
   * @returns Decoded token payload
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired access token');
    }
  }

  /**
   * Verify a refresh token
   * @param token Refresh token to verify
   * @returns Decoded token payload
   */
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, this.REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  /**
   * Refresh an access token using a valid refresh token
   * @param refreshToken Existing refresh token
   * @returns New access token
   */
  static refreshAccessToken(refreshToken: string): string {
    try {
      const payload = this.verifyRefreshToken(refreshToken);
      return this.generateAccessToken({ 
        userId: payload.userId, 
        email: payload.email 
      });
    } catch (error) {
      throw new Error('Cannot refresh access token');
    }
  }
}

export default TokenUtils;
