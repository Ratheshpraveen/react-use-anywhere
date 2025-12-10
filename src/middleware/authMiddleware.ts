import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { tokenConfig, isTokenBlacklisted } from '../config/tokenConfig';
import { UserRole } from '../models/User';

// Extended Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        email: string;
        roles: string[];
      };
    }
  }
}

export const authMiddleware = {
  // Basic JWT verification middleware
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    // Check if token is blacklisted
    if (isTokenBlacklisted(token)) {
      return res.status(401).json({ message: 'Token has been invalidated' });
    }

    try {
      const decoded = tokenConfig.verifyToken(token) as any;
      
      if (!decoded) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }

      req.user = {
        id: decoded.id,
        username: decoded.username,
        email: decoded.email,
        roles: decoded.roles || []
      };

      next();
    } catch (error) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  },

  // Role-based access control middleware
  requireRole: (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      const hasRequiredRole = req.user.roles.some(role => 
        allowedRoles.includes(role)
      );

      if (!hasRequiredRole) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    };
  },

  // Middleware to check if user is admin
  isAdmin: (req: Request, res: Response, next: NextFunction) => {
    return authMiddleware.requireRole(['admin'])(req, res, next);
  }
};
