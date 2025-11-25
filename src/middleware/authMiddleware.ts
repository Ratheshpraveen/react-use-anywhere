import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/tokenUtils';

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }

  // Attach user info to request for further use
  req.user = decoded;
  next();
}

export function requireRole(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role || '')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
}
