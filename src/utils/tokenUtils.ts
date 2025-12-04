import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

export const generateAccessToken = (user: IUser): string => {
  const secret = process.env.JWT_SECRET || 'default_secret';
  const expiresIn = process.env.TOKEN_EXPIRATION || '1h';

  return jwt.sign(
    { 
      userId: user._id, 
      role: user.role 
    }, 
    secret, 
    { expiresIn }
  );
};

export const generateRefreshToken = (user: IUser): string => {
  const secret = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret';
  const expiresIn = process.env.REFRESH_TOKEN_EXPIRATION || '7d';

  return jwt.sign(
    { 
      userId: user._id 
    }, 
    secret, 
    { expiresIn }
  );
};

export const verifyToken = (token: string, isRefresh: boolean = false): any => {
  const secret = isRefresh 
    ? (process.env.JWT_REFRESH_SECRET || 'default_refresh_secret')
    : (process.env.JWT_SECRET || 'default_secret');

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
