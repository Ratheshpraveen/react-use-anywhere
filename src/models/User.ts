import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// User interface
export interface IUser {
  id?: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin' | 'moderator';
}

// JWT Secret (ideally from environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

export class User {
  // Static method to hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Static method to compare passwords
  static async comparePassword(
    inputPassword: string, 
    storedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(inputPassword, storedPassword);
  }

  // Generate JWT token
  static generateToken(user: IUser): string {
    return jwt.sign(
      { 
        id: user.id, 
        username: user.username, 
        email: user.email,
        role: user.role 
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRATION }
    );
  }

  // Generate refresh token
  static generateRefreshToken(user: IUser): string {
    return jwt.sign(
      { 
        id: user.id 
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );
  }

  // Verify refresh token
  static verifyRefreshToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}
