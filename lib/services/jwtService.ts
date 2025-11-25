import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

interface TokenPayload {
  userId: string;
  jti?: string;
  type?: 'access' | 'refresh';
}

export class JWTService {
  private static ACCESS_TOKEN_EXPIRY = '15m';
  private static REFRESH_TOKEN_EXPIRY = '7d';

  /**
   * Generate an access token
   * @param userId User's unique identifier
   * @returns Access token string
   */
  static generateAccessToken(userId: string): string {
    const payload: TokenPayload = {
      userId,
      jti: uuidv4(),
      type: 'access'
    };

    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: this.ACCESS_TOKEN_EXPIRY,
      algorithm: 'HS256'
    });
  }

  /**
   * Generate a refresh token
   * @param userId User's unique identifier
   * @returns Refresh token string
   */
  static generateRefreshToken(userId: string): string {
    const payload: TokenPayload = {
      userId,
      jti: uuidv4(),
      type: 'refresh'
    };

    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: this.REFRESH_TOKEN_EXPIRY,
      algorithm: 'HS256'
    });
  }

  /**
   * Verify an access token
   * @param token JWT token to verify
   * @returns Decoded token payload
   */
  static verifyAccessToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.JWT_SECRET!, {
        algorithms: ['HS256']
      }) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw error;
    }
  }

  /**
   * Verify a refresh token
   * @param token JWT refresh token to verify
   * @returns Decoded token payload
   */
  static verifyRefreshToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET!, {
        algorithms: ['HS256']
      }) as TokenPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid refresh token');
      }
      throw error;
    }
  }

  /**
   * Refresh access token using a valid refresh token
   * @param refreshToken Current refresh token
   * @returns New access and refresh tokens
   */
  static refreshTokens(refreshToken: string): { 
    accessToken: string, 
    refreshToken: string 
  } {
    const decoded = this.verifyRefreshToken(refreshToken);
    
    return {
      accessToken: this.generateAccessToken(decoded.userId),
      refreshToken: this.generateRefreshToken(decoded.userId)
    };
  }
}
