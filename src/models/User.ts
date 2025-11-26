import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_CONFIG } from '../config/jwt';

export interface IUser {
  id: string;
  username: string;
  password: string;
}

export class User {
  private user: IUser;

  constructor(user: IUser) {
    this.user = user;
  }

  // Hash password before saving
  async hashPassword(): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(this.user.password, salt);
  }

  // Verify password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.user.password);
  }

  // Generate JWT token
  generateToken(): string {
    return jwt.sign(
      { id: this.user.id, username: this.user.username }, 
      JWT_CONFIG.secret, 
      { expiresIn: JWT_CONFIG.expiresIn }
    );
  }

  // Generate refresh token
  generateRefreshToken(): string {
    return jwt.sign(
      { id: this.user.id, username: this.user.username }, 
      JWT_CONFIG.secret, 
      { expiresIn: JWT_CONFIG.refreshExpiresIn }
    );
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_CONFIG.secret);
    } catch (error) {
      return null;
    }
  }
}
