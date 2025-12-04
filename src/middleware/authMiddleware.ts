import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
      };
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_CONFIG.SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Forbidden
      }

      req.user = user as { id: string; username: string; role: string };
      next();
    });
  } else {
    res.sendStatus(401); // Unauthorized
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }
  next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  next();
};
