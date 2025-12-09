import jwt from 'jsonwebtoken';
import { Request } from 'express';

// Secret keys - in a real app, these should be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret';

// Interface for token payload
interface TokenPayload {
  userId: string;
  role?: string;
}

/**
 * Extract token from Authorization header
 * @param req Express request object
 * @returns Token string or null
 */
export function extractTokenFromHeader(req: Request): string | null {
  const authHeader = req.headers.authorization;
  
  if (authHeader) {
    const parts = authHeader.split(' ');
    if (parts.length === 2 && parts[0] === 'Bearer') {
      return parts[1];
    }
  }
  
  return null;
}

/**
 * Validate JWT token
 * @param token JWT token string
 * @returns Decoded token payload or null
 */
export function validateToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Generate new access token
 * @param payload Token payload
 * @returns Generated JWT token
 */
export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
}

/**
 * Generate refresh token
 * @param payload Token payload
 * @returns Generated refresh token
 */
export function generateRefreshToken(payload: { userId: string }): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

/**
 * Validate refresh token
 * @param token Refresh token string
 * @returns Decoded token payload or null
 */
export function validateRefreshToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  } catch (error) {
    return null;
  }
}
