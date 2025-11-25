import bcrypt from 'bcrypt';
import { generateToken } from '../middleware/auth';

export interface UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
}

export class User {
  private static users: UserInterface[] = [];

  static async create(userData: UserInterface): Promise<UserInterface> {
    // Check if user already exists
    const existingUser = this.users.find(
      user => user.email === userData.email
    );

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = {
      ...userData,
      id: Date.now().toString(), // Simple ID generation
      password: hashedPassword
    };

    this.users.push(newUser);
    return newUser;
  }

  static async authenticate(email: string, password: string): Promise<string | null> {
    const user = this.users.find(u => u.email === email);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    // Generate JWT token
    return generateToken({ 
      id: user.id, 
      email: user.email 
    });
  }
}
