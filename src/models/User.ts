import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
  role: string;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

export class User implements UserInterface {
  id: string;
  email: string;
  password: string;
  role: string;

  constructor(data: {
    id?: string, 
    email: string, 
    password: string, 
    role?: string
  }) {
    this.id = data.id || Date.now().toString();
    this.email = data.email;
    this.password = data.password;
    this.role = data.role || 'user';
  }

  // Method to hash password before saving
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  // Compare provided password with stored hashed password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Generate JWT authentication token
  generateAuthToken(): string {
    return jwt.sign(
      { 
        id: this.id, 
        email: this.email, 
        role: this.role 
      }, 
      process.env.JWT_SECRET || '', 
      { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
    );
  }

  // Optional: Method to sanitize user data for response
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
