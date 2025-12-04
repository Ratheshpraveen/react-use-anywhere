import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Ensure you have a secure secret key - store this in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Define user interface for TypeScript
interface UserPayload {
  id: string;
  email: string;
  role?: string;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const user = jwt.verify(token, JWT_SECRET) as UserPayload;
      req.user = user;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization token required' });
  }
};

// Optional: Role-based access control middleware
export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role || '')) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    next();
  };
};
