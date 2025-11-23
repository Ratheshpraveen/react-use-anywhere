import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../lib/services/jwtService';

export class AuthMiddleware {
  /**
   * Middleware to verify JWT token
   * @param req Express request object
   * @param res Express response object
   * @param next Express next function
   */
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = JWTService.verifyToken(token);

    if (!decoded) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request for further use
    (req as any).user = decoded;
    next();
  }

  /**
   * Middleware to check user role
   * @param allowedRoles Array of roles allowed to access the route
   */
  static checkRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    };
  }
}
