import { Request, Response, NextFunction } from 'express';
import { verifyToken } from './jwtUtils';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      error: 'Authorization header missing' 
    });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      error: 'Bearer token not found' 
    });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(403).json({ 
      error: 'Invalid or expired token' 
    });
  }

  // Attach user information to the request object
  (req as any).user = decoded;
  next();
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions' 
      });
    }

    next();
  };
};
