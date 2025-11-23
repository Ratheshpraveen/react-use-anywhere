import jwt from 'jsonwebtoken';
import { JWTPayload } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
const JWT_EXPIRATION = '1h';

export class JWTService {
  static generateToken(payload: { userId: string; email: string; role?: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  }

  static verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static refreshToken(token: string): string | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
      const { userId, email, role } = decoded;
      return this.generateToken({ userId, email, role });
    } catch (error) {
      return null;
    }
  }

  static decodeToken(token: string): JWTPayload | null {
    return jwt.decode(token) as JWTPayload | null;
  }
}
