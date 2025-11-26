import jwt from 'jsonwebtoken';

// Ensure JWT_SECRET is set in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION';
const JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

interface TokenPayload {
  userId: string;
  email?: string;
  role?: string;
}

export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { 
    expiresIn: JWT_EXPIRATION 
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
};

export const refreshToken = (payload: TokenPayload): string => {
  // Remove existing expiration and generate a new token
  const { exp, iat, ...restPayload } = payload as any;
  return generateToken(restPayload);
};
