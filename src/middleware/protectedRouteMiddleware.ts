import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './authMiddleware';

export const protectRoute = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    // Additional role-based access control can be added here if needed
    const user = (req as any).user;
    if (!user) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }
    next();
  });
};
