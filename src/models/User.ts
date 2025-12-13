import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// JWT Secret - in a real app, this would come from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

export interface UserInterface {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export class User implements UserInterface {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;

  constructor(user: UserInterface) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.role = user.role;
  }

  // Method to compare password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Method to generate JWT token
  generateToken(): string {
    return jwt.sign(
      { 
        id: this.id, 
        email: this.email, 
        role: this.role 
      }, 
      JWT_SECRET, 
      { expiresIn: TOKEN_EXPIRATION }
    );
  }

  // Static method to hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}
