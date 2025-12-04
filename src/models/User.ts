import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG, PASSWORD_SALT_ROUNDS } from '../config/jwtConfig';

export interface UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export class User implements UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';

  constructor(user: UserInterface) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role || 'user';
  }

  // Hash password before saving
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, PASSWORD_SALT_ROUNDS);
  }

  // Compare password for login
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Generate JWT token
  generateToken(): string {
    return jwt.sign(
      { 
        id: this.id, 
        username: this.username, 
        email: this.email, 
        role: this.role 
      },
      JWT_CONFIG.SECRET,
      {
        expiresIn: JWT_CONFIG.EXPIRES_IN,
        issuer: JWT_CONFIG.ISSUER
      }
    );
  }

  // Sanitize user data for response
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
