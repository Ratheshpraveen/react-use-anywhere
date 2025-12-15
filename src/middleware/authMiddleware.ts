import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwtConfig';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token malformatted' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  req.user = decoded;
  next();
};

export const roleMiddleware = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
