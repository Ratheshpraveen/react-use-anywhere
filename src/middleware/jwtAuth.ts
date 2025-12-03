import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

// JWT Secret and Expiration from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

// Token generation interface
interface TokenPayload {
  userId: string;
  email: string;
}

// Generate JWT Token
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRATION 
  });
};

// Middleware to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ error: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: 'Token malformatted' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token', details: err.message });
    }

    // Attach decoded user info to request
    (req as any).user = decoded;
    return next();
  });
};

// Token refresh
export const refreshToken = (token: string): string | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    
    // Generate a new token with the same payload
    return generateToken({
      userId: decoded.userId,
      email: decoded.email
    });
  } catch (error) {
    return null;
  }
};
