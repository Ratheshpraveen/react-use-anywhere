import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';

// Extended Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authMiddleware = (requiredRoles?: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if no token
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as any;

      // Attach user to request object
      req.user = decoded;

      // Check role-based access if roles are specified
      if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = requiredRoles.some(role => 
          decoded.roles && decoded.roles.includes(role)
        );

        if (!hasRequiredRole) {
          return res.status(403).json({ message: 'Insufficient permissions' });
        }
      }

      next();
    } catch (err) {
      // Token is not valid
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

// Middleware to check if user is an admin
export const isAdmin = authMiddleware(['admin']);
