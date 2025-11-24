import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const generateToken = (payload: any, expiresIn: string = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

export const refreshToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const newToken = generateToken({ 
      id: (decoded as any).id, 
      email: (decoded as any).email 
    });
    return newToken;
  } catch (error) {
    throw new Error('Invalid token');
  }
};
