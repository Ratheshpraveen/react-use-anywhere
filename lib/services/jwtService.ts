import jwt from 'jsonwebtoken';
import { JWTPayload, TokenPair, AuthTokens } from '../types';

class JWTService {
  private static SECRET_KEY = process.env.JWT_SECRET || 'default_secret';
  private static ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || '15m';
  private static REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

  static generateTokenPair(payload: JWTPayload): TokenPair {
    const accessToken = jwt.sign(payload, this.SECRET_KEY, { 
      expiresIn: this.ACCESS_TOKEN_EXPIRY 
    });
    
    const refreshToken = jwt.sign(payload, this.SECRET_KEY, { 
      expiresIn: this.REFRESH_TOKEN_EXPIRY 
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.SECRET_KEY) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static refreshAccessToken(refreshToken: string): AuthTokens | null {
    const decoded = this.verifyToken(refreshToken);
    
    if (!decoded) {
      return null;
    }

    // Remove sensitive fields from payload if needed
    const { password, ...safePayload } = decoded;

    return {
      accessToken: jwt.sign(safePayload, this.SECRET_KEY, { 
        expiresIn: this.ACCESS_TOKEN_EXPIRY 
      }),
      refreshToken
    };
  }

  static extractUserFromToken(token: string): JWTPayload | null {
    return this.verifyToken(token);
  }
}

export default JWTService;
