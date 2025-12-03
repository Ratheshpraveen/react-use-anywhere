import { Request, Response, NextFunction } from 'express';
import JWTService from './jwtService';

class AuthMiddleware {
  static authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = JWTService.verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request for further use
    req.user = decoded;
    next();
  }

  static requireRole(roles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user as any;
      if (!user || !roles.includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    };
  }
}
