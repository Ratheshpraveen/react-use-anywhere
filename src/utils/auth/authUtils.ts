import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWTPayload, UserRole } from '../../types/auth';

// Ensure environment variables are set
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

/**
 * Generate a JWT token
 * @param userId User's unique identifier
 * @param email User's email
 * @param role User's role
 * @returns Generated JWT token
 */
export const generateToken = (
  userId: string, 
  email: string, 
  role: UserRole = UserRole.USER
): string => {
  try {
    const payload: JWTPayload = {
      userId,
      email,
      role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // 1 hour expiration
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
  } catch (error) {
    console.error('Token generation error:', error);
    throw new Error('Failed to generate authentication token');
  }
};

/**
 * Verify a JWT token
 * @param token JWT token to verify
 * @returns Decoded payload if token is valid
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid token');
    }
    throw new Error('Token verification failed');
  }
};

/**
 * Decode a JWT token without verification
 * @param token JWT token to decode
 * @returns Decoded payload
 */
export const decodeToken = (token: string): JWTPayload | null => {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch (error) {
    console.error('Token decoding error:', error);
    return null;
  }
};

/**
 * Check if a token is expired
 * @param token JWT token to check
 * @returns Boolean indicating token expiration status
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeToken(token);
    if (!decoded) return true;

    return decoded.exp < Math.floor(Date.now() / 1000);
  } catch {
    return true;
  }
};

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param plainPassword Plain text password
 * @param hashedPassword Hashed password to compare against
 * @returns Boolean indicating password match
 */
export const comparePassword = async (
  plainPassword: string, 
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(plainPassword, hashedPassword);
};
