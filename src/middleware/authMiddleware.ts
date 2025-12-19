import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is set in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Interface for decoded token
interface DecodedToken {
  userId: string;
  role?: string;
}

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    // Attach user information to request object
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Middleware for role-based access control
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

// Token generation utility
export const generateToken = (userId: string, role?: string) => {
  return jwt.sign(
    { userId, role }, 
    JWT_SECRET, 
    { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
  );
};

// Token refresh utility
export const refreshToken = (userId: string, role?: string) => {
  return generateToken(userId, role);
};
