import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { generateToken } from '../config/jwt';

export class AuthController {
  // User registration
  static async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Create user
      const user = await UserModel.createUser(username, password);

      res.status(201).json({ 
        message: 'User registered successfully',
        userId: user.id 
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  }

  // User login
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Authenticate user
      const user = await UserModel.authenticateUser(username, password);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = generateToken({ userId: user.id });

      res.json({ 
        message: 'Login successful', 
        token 
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  }
}
