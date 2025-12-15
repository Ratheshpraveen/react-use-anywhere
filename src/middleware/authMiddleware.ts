import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { UserRoles } from '../config/jwtConfig';

export const authMiddleware = {
  // Basic token verification
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(403).json({ message: 'No token provided' });
    }

    const decoded = User.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  },

  // Role-based access control
  requireRole: (roles: UserRoles[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Insufficient permissions' });
      }

      next();
    };
  }
};
