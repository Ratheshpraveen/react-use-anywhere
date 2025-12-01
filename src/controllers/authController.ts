import { Request, Response } from 'express';
import { AuthUtils } from '../utils/auth';

// Mock user database (replace with your actual database logic)
const users = [
  {
    id: '1',
    username: 'testuser',
    password: '$2a$10$someHashedPasswordHere' // Pre-hashed password
  }
];

export class AuthController {
  // User registration
  static async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Check if user already exists
      const existingUser = users.find(u => u.username === username);
      if (existingUser) {
        return res.status(400).json({ 
          message: 'User already exists' 
        });
      }

      // Hash password
      const hashedPassword = await AuthUtils.hashPassword(password);

      // Create user (in a real app, this would be a database operation)
      const newUser = {
        id: String(users.length + 1),
        username,
        password: hashedPassword
      };
      users.push(newUser);

      // Generate token
      const token = AuthUtils.generateToken({
        id: newUser.id,
        username: newUser.username
      });

      res.status(201).json({ 
        message: 'User registered successfully', 
        token 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Registration failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }

  // User login
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Find user
      const user = users.find(u => u.username === username);
      if (!user) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Check password
      const isMatch = await AuthUtils.comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ 
          message: 'Invalid credentials' 
        });
      }

      // Generate token
      const token = AuthUtils.generateToken({
        id: user.id,
        username: user.username
      });

      res.json({ 
        message: 'Login successful', 
        token 
      });
    } catch (error) {
      res.status(500).json({ 
        message: 'Login failed', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
}
