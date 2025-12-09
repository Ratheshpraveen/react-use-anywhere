import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';

// Define user roles for access control
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

// Extended Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

export const authMiddleware = {
  // Verify JWT token
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.secretKey) as { 
        id: string; 
        role: UserRole 
      };

      req.user = {
        id: decoded.id,
        role: decoded.role
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired' });
      }
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }
  },

  // Role-based access control
  requireRole: (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    };
  },

  // Optional: Protect routes with specific roles
  protectRoute: {
    adminOnly: (req: Request, res: Response, next: NextFunction) => 
      authMiddleware.requireRole([UserRole.ADMIN])(req, res, next),
    
    userAndAdmin: (req: Request, res: Response, next: NextFunction) => 
      authMiddleware.requireRole([UserRole.USER, UserRole.ADMIN])(req, res, next)
  }
};
