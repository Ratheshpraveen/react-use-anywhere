import { Request, Response, NextFunction } from 'express';
import { JWTService } from '../services/jwtService';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
  };
}

export class AuthMiddleware {
  /**
   * Middleware to validate JWT access token
   */
  static authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'No authorization header provided' 
      });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ 
        error: 'Invalid authorization header format' 
      });
    }

    try {
      const decoded = JWTService.verifyAccessToken(token);
      req.user = { userId: decoded.userId };
      next();
    } catch (error) {
      if (error instanceof Error && error.message === 'Token expired') {
        return res.status(401).json({ 
          error: 'Access token expired', 
          code: 'TOKEN_EXPIRED' 
        });
      }
      
      return res.status(401).json({ 
        error: 'Invalid access token', 
        code: 'INVALID_TOKEN' 
      });
    }
  }

  /**
   * Middleware to validate refresh token
   */
  static async refreshTokens(req: Request, res: Response) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ 
        error: 'Refresh token is required' 
      });
    }

    try {
      const tokens = JWTService.refreshTokens(refreshToken);
      
      return res.status(200).json({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Refresh token expired') {
        return res.status(401).json({ 
          error: 'Refresh token expired', 
          code: 'REFRESH_TOKEN_EXPIRED' 
        });
      }
      
      return res.status(401).json({ 
        error: 'Invalid refresh token', 
        code: 'INVALID_REFRESH_TOKEN' 
      });
    }
  }
}
