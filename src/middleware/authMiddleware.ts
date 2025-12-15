import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';

// Load environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// JWT Verification Middleware
export const verifyToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
});

// Role-based Access Control Middleware
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.auth as { role?: string };
    
    if (!user || !user.role) {
      return res.status(403).json({ error: 'Access denied: No user role found' });
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied: Insufficient permissions' });
    }

    next();
  };
};

// Error handling middleware for JWT authentication
export const handleAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      details: err.message
    });
  }
  next(err);
};
