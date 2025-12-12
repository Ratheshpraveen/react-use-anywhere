import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { UserRoles } from '../config/jwtConfig';

class AuthMiddleware {
  // JWT authentication middleware
  static async authenticateJWT(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(' ')[1];

      try {
        const decoded = User.verifyToken(token);
        
        if (!decoded) {
          return res.status(403).json({ error: 'Invalid or expired token' });
        }

        // Attach user info to request
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(403).json({ error: 'Forbidden' });
      }
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  }

  // Role-based access control middleware
  static roleCheck(allowedRoles: UserRoles[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = req.user;

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      next();
    };
  }
}

export default AuthMiddleware;
