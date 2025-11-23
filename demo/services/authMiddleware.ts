import { Request, Response, NextFunction } from 'express';
import JWTService from '../../lib/services/jwtService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const decoded = JWTService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user info to request for further route handling
  (req as any).user = decoded;
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
