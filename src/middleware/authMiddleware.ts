import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/authUtils';

/**
 * Authentication middleware to protect routes
 */
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  // Verify the token
  const decoded = verifyToken(token);

  // If token is invalid, return unauthorized
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user information to the request object
  (req as any).user = decoded;
  
  // Proceed to the next middleware or route handler
  next();
};
