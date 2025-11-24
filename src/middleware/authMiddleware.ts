import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenUtils';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Attach user information to the request
  req.user = decoded;
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !user.role || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
