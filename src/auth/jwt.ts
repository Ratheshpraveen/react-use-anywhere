import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// User interface for type safety
interface User {
  id: string;
  email: string;
}

// Generate JWT Token
export const generateToken = (user: User): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT Secret is not defined');
  }

  return jwt.sign(
    { id: user.id, email: user.email }, 
    secret, 
    { expiresIn: process.env.JWT_EXPIRATION || '1h' }
  );
};

// Middleware to verify JWT token
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    jwt.verify(token, secret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }

      // Attach user to request object
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization header missing' });
  }
};

// Decode token without verification (for getting user info)
export const decodeToken = (token: string): User | null => {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT Secret is not defined');
    }
    return jwt.decode(token) as User;
  } catch (error) {
    return null;
  }
};
