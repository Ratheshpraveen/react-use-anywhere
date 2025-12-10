import jwt from 'jsonwebtoken';

// Ensure you set this as an environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_that_should_be_replaced';

// Token configuration
export const tokenConfig = {
  secret: JWT_SECRET,
  accessTokenExpiry: '15m',   // 15 minutes
  refreshTokenExpiry: '7d',   // 7 days
  
  // Generate access token
  generateAccessToken: (payload: any) => {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: tokenConfig.accessTokenExpiry 
    });
  },

  // Generate refresh token
  generateRefreshToken: (payload: any) => {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: tokenConfig.refreshTokenExpiry 
    });
  },

  // Verify token
  verifyToken: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
};

// Simple token blacklist (in-memory, replace with Redis or database in production)
export const tokenBlacklist = new Set<string>();

// Add method to blacklist token
export const blacklistToken = (token: string) => {
  tokenBlacklist.add(token);
};

// Check if token is blacklisted
export const isTokenBlacklisted = (token: string) => {
  return tokenBlacklist.has(token);
};
