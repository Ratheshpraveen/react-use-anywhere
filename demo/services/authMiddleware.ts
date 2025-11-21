import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../lib/services/jwtService';

export class AuthMiddleware {
  /**
   * Middleware to verify JWT token
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  static verifyToken(req: Request, res: Response, next: NextFunction): void {
    // Get token from header
    const token = req.headers['authorization']?.split(' ')[1]; // Expects "Bearer TOKEN"

    if (!token) {
      res.status(403).json({ error: 'No token provided' });
      return;
    }

    try {
      // Verify token
      const decoded = JWTService.verifyToken(token);

      if (!decoded) {
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
        return;
      }

      // Attach user info to request
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized: Token verification failed' });
    }
  }

  /**
   * Middleware to check user role
   * @param allowedRoles Array of roles allowed to access the route
   */
  static checkRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = (req as any).user;

      if (!user || !user.role || !allowedRoles.includes(user.role)) {
        res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
        return;
      }

      next();
    };
  }
}
