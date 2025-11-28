import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      // Create user
      const user = await User.create(email, password);

      // Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.JWT_SECRET || 'default_secret', 
        { expiresIn: process.env.JWT_EXPIRATION || '1h' }
      );

      res.status(201).json({ token });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
      }

      // Authenticate user
      const token = await User.authenticate(email, password);

      res.json({ token });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { token } = req.body;

      // Verify existing token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret') as { id: string, email: string };

      // Generate new token
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email }, 
        process.env.JWT_SECRET || 'default_secret', 
        { expiresIn: process.env.JWT_EXPIRATION || '1h' }
      );

      res.json({ token: newToken });
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  }
}

export default AuthController;
