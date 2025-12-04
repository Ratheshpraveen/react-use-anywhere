import { Request, Response } from 'express';
import { UserService } from '../models/User';
import { generateToken } from '../config/jwt';

export class AuthController {
  // User registration
  static register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Create user
      const user = UserService.createUser(username, password);

      // Generate token
      const token = generateToken({ id: user.id, username: user.username });

      res.status(201).json({ 
        message: 'User registered successfully', 
        user: { id: user.id, username: user.username },
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // User login
  static login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Authenticate user
      const user = UserService.authenticateUser(username, password);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken({ id: user.id, username: user.username });

      res.json({ 
        message: 'Login successful', 
        user: { id: user.id, username: user.username },
        token 
      });
    } catch (error: any) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}
