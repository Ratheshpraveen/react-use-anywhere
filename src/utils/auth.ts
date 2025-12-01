import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Ensure JWT_SECRET is defined
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '3600';

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

// User interface for type safety
interface User {
  id: string;
  username: string;
  password: string;
}

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
 * @param password Plain text password
 * @param hashedPassword Hashed password to compare against
 * @returns Boolean indicating if passwords match
 */
export const comparePassword = async (
  password: string, 
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT token for a user
 * @param user User object
 * @returns JWT token string
 */
export const generateToken = (user: Pick<User, 'id' | 'username'>): string => {
  return jwt.sign(
    { id: user.id, username: user.username }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRATION }
  );
};

/**
 * Verify a JWT token
 * @param token JWT token string
 * @returns Decoded token payload or null
 */
export const verifyToken = (token: string): any | null => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Middleware to protect routes requiring authentication
 */
export const authMiddleware = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};
