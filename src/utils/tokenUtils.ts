import jwt from 'jsonwebtoken';
import { IUser } from '../models/User';

// Ensure you have secure secret keys - store these in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

// Token generation interfaces
interface TokenPayload {
  userId: string;
  role?: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate an access token for a user
 * @param user User object
 * @returns Access token string
 */
export function generateAccessToken(user: IUser): string {
  return jwt.sign(
    { 
      userId: user._id, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '15m' }
  );
}

/**
 * Generate a refresh token for a user
 * @param user User object
 * @returns Refresh token string
 */
export function generateRefreshToken(user: IUser): string {
  return jwt.sign(
    { userId: user._id }, 
    REFRESH_SECRET, 
    { expiresIn: '7d' }
  );
}

/**
 * Verify and decode an access token
 * @param token Access token string
 * @returns Decoded token payload
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}

/**
 * Verify and decode a refresh token
 * @param token Refresh token string
 * @returns Decoded token payload
 */
export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, REFRESH_SECRET) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Generate both access and refresh tokens
 * @param user User object
 * @returns Object with access and refresh tokens
 */
export function generateTokenPair(user: IUser): TokenResponse {
  return {
    accessToken: generateAccessToken(user),
    refreshToken: generateRefreshToken(user)
  };
}
