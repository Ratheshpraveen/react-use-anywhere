import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { expressjwt } from 'express-jwt';

// Load environment variables (we'll create .env in a later step)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Middleware to verify JWT token
export const verifyToken = expressjwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
});

// Error handling middleware for authentication
export const handleAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      message: err.message
    });
  }
  next(err);
};

// Role-based access control middleware
export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).auth;
    
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to access this resource'
      });
    }
    
    next();
  };
};

// Optional: Token refresh middleware
export const refreshToken = (req: Request, res: Response) => {
  const { token } = req.body;
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    // Create a new token with updated expiration
    const newToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    
    res.json({ token: newToken });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
