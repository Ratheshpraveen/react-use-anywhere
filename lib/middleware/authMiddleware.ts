import { Request, Response, NextFunction } from 'express';
import JwtService from '../services/jwtService';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const user = await JwtService.verifyAccessToken(token);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasAllowedRole = allowedRoles.includes(req.user.role);
    
    if (!hasAllowedRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
