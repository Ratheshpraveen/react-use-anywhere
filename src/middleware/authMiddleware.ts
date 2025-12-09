import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Secret key for JWT - in a real app, this should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Interface for decoded token
interface DecodedToken {
  userId: string;
  role?: string;
}

// Middleware to verify JWT token
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
      
      // Attach user info to request
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization token required' });
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
