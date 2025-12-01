import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// User interface for type safety
interface User {
  id: string;
  username: string;
  password: string;
}

// Authentication utility class
export class AuthUtils {
  // Hash password using bcrypt
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare password with hashed password
  static async comparePassword(
    plainPassword: string, 
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  // Generate JWT token
  static generateToken(user: Omit<User, 'password'>): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRATION || '3600';

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
      { 
        id: user.id, 
        username: user.username 
      }, 
      secret, 
      { expiresIn }
    );
  }

  // Verify JWT token
  static verifyToken(token: string): any {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not defined');
    }

    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }
}
