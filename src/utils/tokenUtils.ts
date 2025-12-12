import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwtConfig';

// Blacklisted tokens set (in-memory for simplicity, consider using Redis in production)
const blacklistedTokens = new Set<string>();

export const tokenUtils = {
  // Generate access token
  generateAccessToken: (userId: string, role: string) => {
    return jwt.sign(
      { userId, role }, 
      jwtConfig.SECRET_KEY, 
      { 
        expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRY,
        issuer: jwtConfig.ISSUER,
        audience: jwtConfig.AUDIENCE
      }
    );
  },

  // Generate refresh token
  generateRefreshToken: (userId: string, role: string) => {
    return jwt.sign(
      { userId, role }, 
      jwtConfig.SECRET_KEY, 
      { 
        expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRY,
        issuer: jwtConfig.ISSUER,
        audience: jwtConfig.AUDIENCE
      }
    );
  },

  // Verify token
  verifyToken: (token: string) => {
    try {
      // Check if token is blacklisted
      if (blacklistedTokens.has(token)) {
        throw new Error('Token is blacklisted');
      }

      return jwt.verify(token, jwtConfig.SECRET_KEY);
    } catch (error) {
      return null;
    }
  },

  // Refresh token
  refreshToken: (refreshToken: string) => {
    try {
      const decoded = jwt.verify(refreshToken, jwtConfig.SECRET_KEY) as { 
        userId: string, 
        role: string 
      };

      // Generate new access and refresh tokens
      const newAccessToken = tokenUtils.generateAccessToken(
        decoded.userId, 
        decoded.role
      );
      const newRefreshToken = tokenUtils.generateRefreshToken(
        decoded.userId, 
        decoded.role
      );

      return { 
        accessToken: newAccessToken, 
        refreshToken: newRefreshToken 
      };
    } catch (error) {
      return null;
    }
  },

  // Blacklist token (for logout)
  blacklistToken: (token: string) => {
    blacklistedTokens.add(token);
  },

  // Clear blacklisted tokens (periodic cleanup)
  clearBlacklistedTokens: () => {
    blacklistedTokens.clear();
  }
};
