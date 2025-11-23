import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../lib/services/jwtService';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract the token (assuming "Bearer <token>" format)
  const token = authHeader.split(' ')[1];

  // Validate the token
  const decoded = JWTService.validateAccessToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user info to the request object
  (req as any).user = decoded;

  next();
};

/**
 * Role-based authorization middleware
 * @param allowedRoles Array of roles allowed to access the route
 */
export const roleMiddleware = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user || !allowedRoles.includes(user.role)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
}
