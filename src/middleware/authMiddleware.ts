import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { JWT_SECRET, ACCESS_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from '../config/jwtConfig';

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

// Token blacklist (in-memory for simplicity, consider using Redis in production)
const tokenBlacklist = new Set<string>();

class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthError';
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new AuthError('No token, authorization denied', 401);
    }

    // Check if token is blacklisted
    if (tokenBlacklist.has(token)) {
      throw new AuthError('Token is no longer valid', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    // Optional: Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AuthError('User not found', 401);
    }

    // Attach user to request object
    (req as any).user = { id: decoded.userId };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error instanceof AuthError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    
    // Catch-all for unexpected errors
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRATION
  });
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRATION
  });
};

export const blacklistToken = (token: string) => {
  tokenBlacklist.add(token);
};

export const isTokenBlacklisted = (token: string) => {
  return tokenBlacklist.has(token);
};
