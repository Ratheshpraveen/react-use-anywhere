import jwt from 'jsonwebtoken';
import Redis from 'ioredis';

// Initialize Redis client for token blacklisting
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// JWT Secrets - in a real app, these should be environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret';

// Token blacklist management
export const tokenUtils = {
  // Blacklist a token
  blacklistToken: async (token: string, expiresIn: number) => {
    await redis.set(`blacklist:${token}`, 'true', 'EX', expiresIn);
  },

  // Check if token is blacklisted
  isTokenBlacklisted: async (token: string) => {
    const isBlacklisted = await redis.get(`blacklist:${token}`);
    return !!isBlacklisted;
  },

  // Verify access token
  verifyAccessToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Verify refresh token
  verifyRefreshToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  },

  // Generate access token
  generateAccessToken: (payload: any) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
  },

  // Generate refresh token
  generateRefreshToken: (payload: any) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }
};
