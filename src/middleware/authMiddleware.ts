import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwtConfig';

// Define User interface for TypeScript
interface User {
  id: string;
  username: string;
  roles: string[];
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// JWT Verification Middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// Role-based Access Control Middleware
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const hasRole = roles.some(role => req.user?.roles.includes(role));
    
    if (!hasRole) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Optional: Token Refresh Middleware
export const refreshToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User;
    
    // Check if token is close to expiration (e.g., within 15 minutes)
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpiration = (decoded.exp || 0);
    
    if (tokenExpiration - currentTime < 15 * 60) {
      // Generate new token
      const newToken = jwt.sign(
        { id: decoded.id, username: decoded.username, roles: decoded.roles },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      
      res.setHeader('X-New-Token', newToken);
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
