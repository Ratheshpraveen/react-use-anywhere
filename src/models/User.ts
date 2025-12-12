import bcrypt from 'bcryptjs';
import { jwtConfig, TokenPayload } from '../config/jwtConfig';

export interface UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
  role?: string;
}

export class User {
  private static SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(
    plainTextPassword: string, 
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }

  static generateAuthToken(user: UserInterface): string {
    const payload: TokenPayload = {
      userId: user.id || '',
      email: user.email,
      role: user.role
    };
    return jwtConfig.generateToken(payload);
  }

  // Simulate user creation (replace with your actual database logic)
  static async create(userData: UserInterface): Promise<UserInterface> {
    const hashedPassword = await this.hashPassword(userData.password);
    
    // In a real app, this would be a database insert
    return {
      ...userData,
      id: Math.random().toString(36).substr(2, 9), // mock ID
      password: hashedPassword
    };
  }
}
