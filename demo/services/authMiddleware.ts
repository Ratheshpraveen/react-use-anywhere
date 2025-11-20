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
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ message: 'No token provided' });
        return;
      }

      // Extract token (assuming "Bearer TOKEN" format)
      const token = authHeader.split(' ')[1];
      if (!token) {
        res.status(401).json({ message: 'Invalid token format' });
        return;
      }

      // Verify token
      const decoded = JWTService.verifyToken(token);
      
      // Attach user info to request for further use
      (req as any).user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
    }
  }

  /**
   * Middleware to check user role
   * @param allowedRoles Array of roles allowed to access the route
   * @returns Middleware function
   */
  static checkRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      try {
        const user = (req as any).user;
        if (!user || !allowedRoles.includes(user.role)) {
          res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
          return;
        }
        next();
      } catch (error) {
        res.status(403).json({ message: 'Forbidden' });
      }
    };
  }
}
