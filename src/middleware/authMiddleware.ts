import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenUtils';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided, authorization denied' });
  }

  try {
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    // Attach user info to request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};
