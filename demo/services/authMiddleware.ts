import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../lib/services/jwtService';

export const authMiddleware = (requiredRole?: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = JWTService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Check role if required
    if (requiredRole && decoded.role !== requiredRole) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };

    next();
  };
};
