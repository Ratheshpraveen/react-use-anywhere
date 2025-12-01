import { Request, Response, NextFunction } from 'express';
import { AuthUtils } from '../utils/auth';

export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ 
      message: 'No token provided' 
    });
  }

  // Extract token (assuming "Bearer TOKEN" format)
  const token = authHeader.split(' ')[1];

  // Verify token
  const decoded = AuthUtils.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      message: 'Invalid or expired token' 
    });
  }

  // Attach user to request object
  (req as any).user = decoded;
  next();
};
