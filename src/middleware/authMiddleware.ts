import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Secret key for JWT - in a real app, use an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Interface for decoded token
interface DecodedToken {
  userId: string;
  iat: number;
  exp: number;
}

// Middleware to verify JWT token
export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
      }

      // Attach user ID to request object
      req.user = decoded as DecodedToken;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization token required' });
  }
};

// Generate JWT token
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};
