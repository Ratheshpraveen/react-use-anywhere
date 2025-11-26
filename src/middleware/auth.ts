import { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/User';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = UserModel.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    // Add user from payload
    (req as any).user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Optional: Middleware for optional authentication
export const optionalAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (token) {
    try {
      const decoded = UserModel.verifyToken(token);
      if (decoded) {
        (req as any).user = decoded;
      }
    } catch (err) {
      // If token is invalid, just continue without setting user
    }
  }

  next();
};
