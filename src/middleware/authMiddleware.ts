import { Request, Response, NextFunction } from 'express';
import { jwtConfig } from '../config/jwtConfig';

export const authMiddleware = {
  // Verify JWT token
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const decoded = jwtConfig.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to request
    (req as any).user = decoded;
    next();
  },

  // Role-based access control
  checkRole: (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;

      if (!user || !user.roles) {
        return res.status(403).json({ message: 'Access denied' });
      }

      const hasRequiredRole = roles.some(role => 
        user.roles.includes(role)
      );

      if (!hasRequiredRole) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    };
  }
};
