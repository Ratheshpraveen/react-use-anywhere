import bcrypt from 'bcryptjs';
import { generateToken } from '../middleware/authMiddleware';

// Simulated user storage - in a real app, use a database
const users: { [key: string]: { id: string; username: string; password: string } } = {};

export class AuthService {
  // Register a new user
  static async register(username: string, password: string): Promise<string> {
    // Check if user already exists
    if (Object.values(users).some(user => user.username === username)) {
      throw new Error('Username already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = Date.now().toString();
    users[userId] = {
      id: userId,
      username,
      password: hashedPassword
    };

    return userId;
  }

  // Login user and return JWT token
  static async login(username: string, password: string): Promise<string> {
    // Find user
    const user = Object.values(users).find(u => u.username === username);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate and return JWT token
    return generateToken(user.id);
  }
}
