import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

export interface TokenPayload {
  id: string;
  email: string;
  role?: string;
}

export class TokenService {
  // Generate access token
  static generateAccessToken(user: IUser): string {
    return jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: '15m' }
    );
  }

  // Generate refresh token
  static generateRefreshToken(user: IUser): string {
    return jwt.sign(
      { id: user._id }, 
      REFRESH_SECRET, 
      { expiresIn: '7d' }
    );
  }

  // Verify access token
  static verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  // Verify refresh token and retrieve user
  static async verifyRefreshToken(token: string): Promise<IUser | null> {
    try {
      const decoded = jwt.verify(token, REFRESH_SECRET) as { id: string };
      return await User.findById(decoded.id);
    } catch {
      return null;
    }
  }

  // Revoke refresh token (optional - requires token storage mechanism)
  static async revokeRefreshToken(userId: string): Promise<void> {
    // Implement token revocation logic
    // This might involve storing tokens in a database or cache
  }
}
