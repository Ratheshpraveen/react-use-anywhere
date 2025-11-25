import { Request, Response, NextFunction } from 'express';
import TokenUtils from '../utils/tokenUtils';

class AuthMiddleware {
  /**
   * Middleware to authenticate requests using JWT
   */
  static authenticateToken(req: Request, res: Response, next: NextFunction) {
    // Get the authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    // If no token is present, return unauthorized
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      // Verify the token
      const decoded = TokenUtils.verifyAccessToken(token);
      
      // Attach user information to the request
      req.user = decoded;
      next();
    } catch (error) {
      // Token is invalid or expired
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
  }

  /**
   * Middleware to handle token refresh
   */
  static async refreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    try {
      // Verify and generate a new access token
      const newAccessToken = TokenUtils.refreshAccessToken(refreshToken);
      
      res.json({ 
        accessToken: newAccessToken 
      });
    } catch (error) {
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  }
}

export default AuthMiddleware;
