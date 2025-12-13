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

// Token verification middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract the token (expecting "Bearer TOKEN")
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET_KEY, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    });

    // Attach the decoded user to the request object
    req.user = decoded;
    next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    
    // Generic error for other cases
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Role-based access control middleware
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // Check if user has any of the required roles
    const hasRequiredRole = roles.some(role => 
      req.user.roles.includes(role)
    );

    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
