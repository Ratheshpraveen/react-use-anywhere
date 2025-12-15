import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtConfig';

export interface UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export class User implements UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
  roles: string[];

  constructor(user: UserInterface) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.roles = user.roles || ['user'];
  }

  // Hash password before saving
  async hashPassword(): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(this.password, salt);
  }

  // Compare password for login
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Generate JWT token
  generateToken(): string {
    if (!this.id) {
      throw new Error('User ID is required to generate token');
    }

    return jwt.sign(
      { 
        id: this.id, 
        username: this.username, 
        email: this.email,
        roles: this.roles 
      },
      JWT_SECRET,
      { 
        expiresIn: '1h' 
      }
    );
  }

  // Static method to create a new user
  static async create(userData: UserInterface): Promise<User> {
    const user = new User(userData);
    user.password = await user.hashPassword();
    return user;
  }
}

// Optional: In-memory user storage (replace with database in real implementation)
export class UserRepository {
  private static users: User[] = [];

  static async findByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  static async save(user: User): Promise<User> {
    if (!user.id) {
      user.id = (this.users.length + 1).toString();
    }
    this.users.push(user);
    return user;
  }
}
