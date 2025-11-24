import { Request, Response, NextFunction } from 'express';
import JWTService from '../../lib/services/jwtService';
import winston from 'winston';

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'auth.log' })
  ]
});

// Authentication middleware
export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn('Authentication attempt without token', { 
      ip: req.ip, 
      path: req.path 
    });
    return res.status(401).json({ error: 'No token provided' });
  }

  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    logger.warn('Malformed authorization header', { 
      ip: req.ip, 
      path: req.path 
    });
    return res.status(401).json({ error: 'Invalid token format' });
  }

  try {
    const decoded = JWTService.verifyAccessToken(token);

    if (!decoded) {
      logger.warn('Invalid or expired token', { 
        ip: req.ip, 
        path: req.path 
      });
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Check if token is blacklisted
    const isBlacklisted = await JWTService.isTokenBlacklisted(decoded.tokenId);
    if (isBlacklisted) {
      logger.warn('Blacklisted token attempt', { 
        userId: decoded.userId, 
        ip: req.ip, 
        path: req.path 
      });
      return res.status(401).json({ error: 'Token is no longer valid' });
    }

    // Attach user info to request
    req.user = {
      id: decoded.userId,
      role: decoded.role
    };

    logger.info('Successful token authentication', { 
      userId: decoded.userId, 
      role: decoded.role, 
      ip: req.ip, 
      path: req.path 
    });

    next();
  } catch (error) {
    logger.error('Authentication error', { 
      error: error instanceof Error ? error.message : 'Unknown error', 
      ip: req.ip, 
      path: req.path 
    });
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Role-based authorization middleware
export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      logger.warn('Unauthorized access attempt', { 
        ip: req.ip, 
        path: req.path 
      });
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn('Role-based access denied', { 
        userId: req.user.id, 
        requiredRoles: roles, 
        userRole: req.user.role, 
        ip: req.ip, 
        path: req.path 
      });
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
