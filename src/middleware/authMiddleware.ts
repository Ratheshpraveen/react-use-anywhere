import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';

// Load environment variables (you'll need to set up dotenv)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

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

// Custom error handler for JWT authentication
export const handleAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      message: err.message
    });
  }
  next(err);
};

// Role-based access control middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).auth;
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Token refresh utility
export const refreshToken = (payload: any) => {
  return jwt.sign(
    payload, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRATION }
  );
};
