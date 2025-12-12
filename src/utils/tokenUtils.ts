import jwt from 'jsonwebtoken';

// Ensure you have secure secret keys - store these in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

interface TokenPayload {
  userId: string;
  role?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (payload: Pick<TokenPayload, 'userId'>): string => {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' });
};

export const verifyAccessToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): Pick<TokenPayload, 'userId'> | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as Pick<TokenPayload, 'userId'>;
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token: string, secret: string): boolean => {
  try {
    const decoded = jwt.verify(token, secret);
    return false;
  } catch (error) {
    return error instanceof jwt.TokenExpiredError;
  }
};
