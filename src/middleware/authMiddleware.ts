import { Request, Response, NextFunction } from 'express';
import JwtService from '../../lib/services/jwtService';

class AuthMiddleware {
  // Middleware to validate access token
  authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = JwtService.verifyAccessToken(token);

    if (!decoded) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // Attach user info to request
    req.user = decoded;
    next();
  }

  // Middleware for role-based access control
  authorizeRole(allowedRoles: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;

      if (!user || !allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Access denied' });
      }

      next();
    };
  }
}

export default new AuthMiddleware();
