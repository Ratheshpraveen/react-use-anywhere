import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const generateToken = (payload: any, expiresIn: string = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};
