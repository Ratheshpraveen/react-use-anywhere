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
        role: UserRole;
      };
    }
  }
}

// JWT Verification Middleware
export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1]; // Bearer TOKEN

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET_KEY, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }) as { id: string; role: UserRole };

    // Verify the user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists' });
    }

    // Attach user info to request
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(500).json({ message: 'Token verification failed' });
  }
};

// Role-based Authorization Middleware
export const checkRole = (roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

// Refresh Token Middleware
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_CONFIG.SECRET_KEY, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }) as { id: string; tokenVersion: number };

    // Find user and verify token version
    const user = await User.findById(decoded.id);
    if (!user || user.tokenVersion !== decoded.tokenVersion) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    // Generate new access token
    const newAccessToken = user.generateAccessToken();

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
};
