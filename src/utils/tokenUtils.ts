import jwt from 'jsonwebtoken';

// JWT Secrets - in a real-world scenario, these should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
}

export class TokenUtils {
  /**
   * Generate an access token
   * @param payload User information to encode in the token
   * @param expiresIn Token expiration time
   */
  static generateAccessToken(
    payload: TokenPayload, 
    expiresIn: string = '15m'
  ): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
  }

  /**
   * Generate a refresh token
   * @param payload User information to encode in the token
   * @param expiresIn Token expiration time
   */
  static generateRefreshToken(
    payload: TokenPayload, 
    expiresIn: string = '7d'
  ): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn });
  }

  /**
   * Verify an access token
   * @param token JWT token to verify
   */
  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verify a refresh token
   * @param token Refresh token to verify
   */
  static verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if a token is expired
   * @param token JWT token to check
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.decode(token) as { exp?: number };
      if (!decoded || !decoded.exp) return true;
      
      return Date.now() >= decoded.exp * 1000;
    } catch {
      return true;
    }
  }
}
