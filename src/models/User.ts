import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_CONFIG } from '../config/jwt';

export interface User {
  id: string;
  username: string;
  password: string;
}

export class UserModel {
  // Hash password before saving
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Verify password
  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Generate JWT token
  static generateToken(user: Omit<User, 'password'>): string {
    return jwt.sign(
      { id: user.id, username: user.username }, 
      JWT_CONFIG.secret, 
      { expiresIn: JWT_CONFIG.expiresIn }
    );
  }

  // Generate refresh token
  static generateRefreshToken(user: Omit<User, 'password'>): string {
    return jwt.sign(
      { id: user.id, username: user.username }, 
      JWT_CONFIG.secret, 
      { expiresIn: JWT_CONFIG.refreshExpiresIn }
    );
  }

  // Verify token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_CONFIG.secret);
    } catch (error) {
      return null;
    }
  }
}
