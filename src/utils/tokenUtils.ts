import jwt from 'jsonwebtoken';
import { authConfig } from '../config/authConfig';

export interface TokenPayload {
  userId: string;
  email: string;
  role?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(
    {
      sub: payload.userId,
      email: payload.email,
      role: payload.role,
    },
    authConfig.jwtSecret,
    {
      expiresIn: authConfig.jwtExpiration,
      issuer: authConfig.jwtIssuer,
    }
  );
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = jwt.verify(token, authConfig.jwtSecret) as TokenPayload;
    return {
      userId: decoded.sub as string,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (error) {
    return null;
  }
};
