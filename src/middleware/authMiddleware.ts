import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';

interface TokenPayload {
  userId: string;
  email: string;
}

export const generateToken = (payload: { userId: string; email: string }): { 
  accessToken: string; 
  refreshToken: string 
} => {
  const accessToken = jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
    issuer: JWT_CONFIG.ISSUER,
  });

  const refreshToken = jwt.sign(payload, JWT_CONFIG.SECRET, {
    expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
    issuer: JWT_CONFIG.ISSUER,
  });

  return { accessToken, refreshToken };
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ 
      error: 'No token provided', 
      message: 'Authentication required' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_CONFIG.SECRET) as TokenPayload;
    
    // Attach user info to request for further route handling
    req.user = {
      userId: decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        error: 'Token expired', 
        message: 'Your session has expired. Please log in again.' 
      });
    }

    return res.status(403).json({ 
      error: 'Invalid token', 
      message: 'Authentication failed' 
    });
  }
};

export const refreshToken = (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ 
      error: 'No refresh token', 
      message: 'Refresh token is required' 
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_CONFIG.SECRET) as TokenPayload;
    
    // Generate new tokens
    const { 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    } = generateToken({
      userId: decoded.userId,
      email: decoded.email
    });

    res.json({ 
      accessToken: newAccessToken, 
      refreshToken: newRefreshToken 
    });
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid refresh token', 
      message: 'Authentication failed' 
    });
  }
};
