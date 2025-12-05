import jwt from 'jsonwebtoken';

// Secret keys - in a real application, use environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret_key';

// Token generation interface
interface TokenPayload {
  userId: string;
  role?: string;
}

export class TokenUtils {
  // Generate access token
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  }

  // Generate refresh token
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
  }

  // Verify access token
  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string, secret: string): boolean {
    try {
      const decoded = jwt.verify(token, secret);
      return false;
    } catch (error) {
      return error instanceof jwt.TokenExpiredError;
    }
  }
}
