import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface TokenPayload {
  userId: string;
  role: string;
}

class JwtService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRATION: string;
  private readonly REFRESH_TOKEN_SECRET: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
    this.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';
    this.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret';
  }

  // Generate access token
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { 
      expiresIn: this.JWT_EXPIRATION 
    });
  }

  // Generate refresh token
  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.REFRESH_TOKEN_SECRET, { 
      expiresIn: '7d' 
    });
  }

  // Verify access token
  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.JWT_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Verify refresh token
  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, this.REFRESH_TOKEN_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }
}

export default new JwtService();
