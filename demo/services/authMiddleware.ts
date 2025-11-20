import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../lib/services/jwtService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = JWTService.verifyAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user information to the request object
  req.user = {
    id: decoded.userId,
    email: decoded.email,
    role: decoded.role
  };

  next();
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role || '')) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
