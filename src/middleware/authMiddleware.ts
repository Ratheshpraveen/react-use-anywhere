import { Request, Response, NextFunction } from 'express';
import { jwtConfig } from '../config/jwtConfig';

export const authMiddleware = {
  // Middleware to verify JWT token
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'No token provided',
        message: 'Authentication required' 
      });
    }

    try {
      const decoded = jwtConfig.verifyToken(token);
      
      if (!decoded) {
        return res.status(401).json({ 
          error: 'Invalid token',
          message: 'Authentication failed' 
        });
      }

      // Attach user info to request for further use
      (req as any).user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ 
        error: 'Token verification failed',
        message: 'Please log in again' 
      });
    }
  },

  // Middleware to check user role (optional)
  checkRole: (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;

      if (!user || !user.role) {
        return res.status(403).json({ 
          error: 'Access denied',
          message: 'No user role found' 
        });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ 
          error: 'Forbidden',
          message: 'Insufficient permissions' 
        });
      }

      next();
    };
  }
};
