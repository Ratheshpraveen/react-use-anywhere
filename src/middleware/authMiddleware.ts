import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to require authentication for protected routes
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Get the Authorization header
  const authHeader = req.headers.authorization;

  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'No token provided',
      error: 'Unauthorized' 
    });
  }

  // Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = verifyToken(token);

    // Attach user information to the request object
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different types of token verification errors
    if (error instanceof Error) {
      return res.status(401).json({ 
        message: error.message,
        error: 'Unauthorized' 
      });
    }

    // Fallback error response
    return res.status(401).json({ 
      message: 'Invalid token',
      error: 'Unauthorized' 
    });
  }
};

/**
 * Optional middleware to check for optional authentication
 * Allows the request to proceed even if no token is provided
 */
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      req.user = decoded;
    } catch (error) {
      // If token is invalid, continue without setting user
      req.user = null;
    }
  }

  next();
};
