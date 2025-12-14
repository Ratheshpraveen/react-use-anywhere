import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';

// Extend the Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (token == null) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    return res.status(500).json({ error: 'Failed to authenticate token' });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check if user exists and has the required role
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const hasRequiredRole = roles.some(role => req.user.roles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};

// Optional: Middleware to refresh tokens
export const refreshTokenMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_CONFIG.SECRET);
    // Here you would typically check if the refresh token is in a blacklist or database
    // Generate new access and refresh tokens
    // For simplicity, this is a placeholder
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid refresh token' });
  }
};
