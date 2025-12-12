import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// JWT Secret - In a real-world scenario, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Token verification middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach the decoded user info to the request object
    (req as any).user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
};

// Role-based access control middleware
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }

    next();
  };
};
