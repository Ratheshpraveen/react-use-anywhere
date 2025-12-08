import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ensure this is a secure, environment-specific secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key_change_in_production';

// Interface for decoded token
interface DecodedToken {
  userId: string;
  role?: string;
}

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    
    // Attach user information to the request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

// Middleware for role-based access control
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as DecodedToken;

    if (!user || !user.role || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

// Error handling middleware for authentication
export const authErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  next(err);
};
