import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';
import User from '../models/User';

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Check for token in Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Extract token (expecting "Bearer TOKEN")
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Invalid token format' });
    }

    // Verify token
    const decoded: any = jwt.verify(token, JWT_CONFIG.SECRET);

    // Check if user still exists
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error: any) {
    // Handle different types of JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }

    // Generic error handler
    res.status(500).json({ 
      message: 'Authentication error', 
      error: error.message 
    });
  }
};

// Optional: Role-based authorization middleware
export const roleMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
