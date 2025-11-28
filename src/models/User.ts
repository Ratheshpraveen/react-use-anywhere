import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/tokenUtils';

export interface UserInterface {
  id: string;
  email: string;
  password: string;
}

export class User {
  private static users: UserInterface[] = [];

  static async create(email: string, password: string): Promise<UserInterface> {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: UserInterface = {
      id: Date.now().toString(), // Simple ID generation
      email,
      password: hashedPassword
    };

    this.users.push(newUser);
    return newUser;
  }

  static async authenticate(email: string, password: string): Promise<string | null> {
    const user = this.users.find(u => u.email === email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    // Generate JWT token
    return generateToken({ 
      userId: user.id, 
      email: user.email 
    });
  }
}
