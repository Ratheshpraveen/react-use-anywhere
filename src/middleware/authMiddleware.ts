import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';
import User, { UserRole } from '../models/User';

// Extended Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        roles: UserRole[];
      };
    }
  }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }) as { id: string; username: string; roles: UserRole[] };

    // Verify user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = {
      id: decoded.id,
      username: decoded.username,
      roles: decoded.roles
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Role-based authorization middleware
export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasAllowedRole = req.user.roles.some(role => 
      allowedRoles.includes(role)
    );

    if (!hasAllowedRole) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};
