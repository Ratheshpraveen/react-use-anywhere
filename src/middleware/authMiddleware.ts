import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    roles: string[];
  };
}

export const authenticateJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_CONFIG.SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      req.user = decoded as { id: string; username: string; roles: string[] };
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization token required' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const hasRequiredRole = req.user.roles.some(role => roles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
