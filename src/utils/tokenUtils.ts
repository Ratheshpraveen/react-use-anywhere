import jwt from 'jsonwebtoken';

// JWT Secret - in a real app, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

interface TokenPayload {
  id: string;
  email?: string;
  role?: string;
}

export class TokenUtils {
  // Generate access token
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
  }

  // Generate refresh token
  static generateRefreshToken(payload: Pick<TokenPayload, 'id'>): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  // Verify token
  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token: string): boolean {
    const decoded = this.verifyToken(token);
    if (!decoded) return true;

    // Check if exp exists and is in the past
    return decoded.exp ? decoded.exp < Math.floor(Date.now() / 1000) : false;
  }

  // Refresh token
  static refreshToken(refreshToken: string): { accessToken: string; refreshToken: string } | null {
    try {
      const decoded = this.verifyToken(refreshToken);
      if (!decoded) return null;

      // Generate new tokens
      const accessToken = this.generateAccessToken({ 
        id: decoded.id, 
        email: decoded.email, 
        role: decoded.role 
      });
      const newRefreshToken = this.generateRefreshToken({ id: decoded.id });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      return null;
    }
  }
}
