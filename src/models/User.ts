import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG, UserRoles } from '../config/jwtConfig';

export interface IUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: UserRoles;
}

export class User {
  private user: IUser;

  constructor(userData: IUser) {
    this.user = userData;
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
      { 
        id: this.user.id, 
        username: this.user.username, 
        role: this.user.role 
      },
      JWT_CONFIG.SECRET,
      {
        expiresIn: JWT_CONFIG.EXPIRES_IN,
        issuer: JWT_CONFIG.ISSUER,
        audience: JWT_CONFIG.AUDIENCE
      }
    );
  }

  // Static method to validate token
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_CONFIG.SECRET, {
        issuer: JWT_CONFIG.ISSUER,
        audience: JWT_CONFIG.AUDIENCE
      });
    } catch (error) {
      return null;
    }
  }
}
