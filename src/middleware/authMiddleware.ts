import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Define the structure of the JWT payload
interface JwtPayload {
  userId: string;
  email: string;
  role?: string;
}

class AuthMiddleware {
  // Verify JWT token middleware
  static verifyToken(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        message: 'No token provided. Authorization denied.' 
      });
    }

    try {
      const secret = process.env.JWT_SECRET;
      
      if (!secret) {
        throw new Error('JWT secret is not defined');
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;
      
      // Attach user information to the request object
      req.user = {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      };

      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ 
          message: 'Token expired. Please log in again.' 
        });
      }
      
      return res.status(401).json({ 
        message: 'Invalid token. Authorization denied.' 
      });
    }
  }

  // Generate JWT token
  static generateToken(payload: { userId: string; email: string; role?: string }): string {
    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
      throw new Error('JWT secret is not defined');
    }

    return jwt.sign(payload, secret, {
      expiresIn: process.env.JWT_EXPIRATION || '1h'
    });
  }

  // Optional: Refresh token generation
  static generateRefreshToken(payload: { userId: string; email: string; role?: string }): string {
    const secret = process.env.REFRESH_TOKEN_SECRET;
    
    if (!secret) {
      throw new Error('Refresh token secret is not defined');
    }

    return jwt.sign(payload, secret, {
      expiresIn: '7d' // Refresh token valid for 7 days
    });
  }
}

export default AuthMiddleware;
