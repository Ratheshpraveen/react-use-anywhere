import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface TokenPayload {
  userId: string;
  iat: number;
  exp: number;
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization token required' });
  }
};

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    next();
  } else {
    res.status(403).json({ message: 'Unauthorized' });
  }
};
