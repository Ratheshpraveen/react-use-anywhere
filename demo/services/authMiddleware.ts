import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../../lib/services/jwtService';

export class AuthMiddleware {
  static verifyToken(req: Request, res: Response, next: NextFunction): void {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    const decoded = JWTService.verifyToken(token);

    if (!decoded) {
      res.status(401).json({ message: 'Invalid or expired token' });
      return;
    }

    // Attach user info to request for further use
    (req as any).user = decoded;
    next();
  }

  static requireRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const user = (req as any).user;

      if (!user || !roles.includes(user.role)) {
        res.status(403).json({ message: 'Insufficient permissions' });
        return;
      }

      next();
    };
  }
}
