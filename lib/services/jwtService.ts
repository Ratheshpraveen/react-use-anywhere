import jwt from 'jsonwebtoken';
import { CustomJWTPayload } from '../types';

class JWTService {
  private static SECRET_KEY = process.env.JWT_SECRET || 'your_default_secret_key';
  private static ACCESS_TOKEN_EXPIRY = '15m';
  private static REFRESH_TOKEN_EXPIRY = '7d';

  static generateAccessToken(payload: CustomJWTPayload): string {
    return jwt.sign(payload, this.SECRET_KEY, { 
      expiresIn: this.ACCESS_TOKEN_EXPIRY 
    });
  }

  static generateRefreshToken(payload: CustomJWTPayload): string {
    return jwt.sign(payload, this.SECRET_KEY, { 
      expiresIn: this.REFRESH_TOKEN_EXPIRY 
    });
  }

  static verifyToken(token: string): CustomJWTPayload | null {
    try {
      return jwt.verify(token, this.SECRET_KEY) as CustomJWTPayload;
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token: string): CustomJWTPayload | null {
    return jwt.decode(token) as CustomJWTPayload | null;
  }

  static refreshAccessToken(refreshToken: string): string | null {
    const decoded = this.verifyToken(refreshToken);
    if (!decoded) return null;

    // Remove sensitive fields from payload for new access token
    const { iat, exp, ...payload } = decoded;
    return this.generateAccessToken(payload);
  }
}

export default JWTService;
