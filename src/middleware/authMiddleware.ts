import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtConfig';

// Define user roles
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

// Extended Request interface to include user information
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

// JWT Verification Middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      id: string; 
      email: string; 
      role: UserRole 
    };
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Role-based Access Control Middleware
export const checkRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

// Optional: Middleware to handle token expiration and refresh
export const handleTokenRefresh = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      id: string; 
      email: string; 
      role: UserRole;
      exp: number 
    };

    // Check if token is close to expiration (e.g., within 5 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp - currentTime < 300) {
      // Generate a new token
      const newToken = jwt.sign(
        { id: decoded.id, email: decoded.email, role: decoded.role }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
      );
      
      res.setHeader('X-New-Token', newToken);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};
