import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Define token payload interface
interface TokenPayload {
  userId: string;
  email: string;
}

class AuthMiddleware {
  // Generate access token
  static generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.TOKEN_EXPIRATION || '1h'
    });
  }

  // Generate refresh token
  static generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d'
    });
  }

  // Verify access token middleware
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
      (req as any).user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }

  // Decode token payload
  static decodeToken(token: string): TokenPayload | null {
    try {
      return jwt.decode(token) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Refresh token
  static refreshToken(refreshToken: string): string | null {
    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as TokenPayload;
      
      // Generate new access token
      return this.generateAccessToken({
        userId: decoded.userId,
        email: decoded.email
      });
    } catch (error) {
      return null;
    }
  }
}

export default AuthMiddleware;
