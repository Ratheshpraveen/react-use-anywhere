import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ensure you have a secure secret key - store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Interface for decoded token
interface DecodedToken {
  userId: string;
  role?: string;
  exp: number;
}

// Authentication middleware
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      
      // Attach user info to request object
      req.user = {
        id: decoded.userId,
        role: decoded.role
      };
      
      next();
    } catch (error) {
      // Handle different types of JWT errors
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ message: 'Token expired' });
      }
      if (error instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ message: 'Invalid token' });
      }
      
      return res.status(403).json({ message: 'Unauthorized' });
    }
  } else {
    res.status(401).json({ message: 'Authentication token required' });
  }
};

// Role-based authorization middleware
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;

    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

// Token generation utility
export const generateToken = (userId: string, role?: string) => {
  return jwt.sign(
    { userId, role }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

// Token refresh utility
export const refreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    // Generate a new token with the same payload
    return generateToken(decoded.userId, decoded.role);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
