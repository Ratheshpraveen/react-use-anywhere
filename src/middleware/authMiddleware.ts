import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';
import { UserService } from '../models/User';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract token (assuming "Bearer TOKEN" format)
  const token = authHeader.split(' ')[1];

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Check if user exists
  const user = UserService.getUserById(decoded.id);
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  // Attach user to request
  (req as any).user = user;
  next();
};
