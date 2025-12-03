import jwt from 'jsonwebtoken';

// Secure key storage (use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your_refresh_secret';

// Token blacklist (in-memory for simplicity, consider using Redis in production)
const tokenBlacklist = new Set<string>();

export const TokenUtils = {
  // Generate access token
  generateAccessToken: (userId: string, role: string) => {
    return jwt.sign(
      { id: userId, role }, 
      JWT_SECRET, 
      { expiresIn: '15m' }
    );
  },

  // Generate refresh token
  generateRefreshToken: (userId: string) => {
    return jwt.sign(
      { id: userId }, 
      REFRESH_SECRET, 
      { expiresIn: '7d' }
    );
  },

  // Verify token validity
  verifyToken: (token: string, isRefresh: boolean = false) => {
    try {
      const secret = isRefresh ? REFRESH_SECRET : JWT_SECRET;
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  },

  // Blacklist a token (for logout)
  blacklistToken: (token: string) => {
    tokenBlacklist.add(token);
  },

  // Check if token is blacklisted
  isTokenBlacklisted: (token: string) => {
    return tokenBlacklist.has(token);
  }
};
