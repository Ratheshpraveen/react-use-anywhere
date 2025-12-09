import * as crypto from 'crypto';

// Generate a secure random secret key
const generateSecretKey = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const jwtConfig = {
  // Use environment variable for secret, fallback to generated secret
  secretKey: process.env.JWT_SECRET || generateSecretKey(),
  
  // Token expiration times
  accessTokenExpiration: '15m',   // 15 minutes
  refreshTokenExpiration: '7d',   // 7 days

  // Token payload structure
  tokenPayload: {
    // Define standard claims
    issuer: 'your-app-name',
    audience: 'your-app-users',
  },

  // Refresh token rotation settings
  refreshTokenRotation: {
    enabled: true,
    maxTokens: 5, // Maximum number of active refresh tokens per user
  }
};

// Ensure secret is not hardcoded in production
if (!process.env.JWT_SECRET) {
  console.warn('JWT_SECRET not set. A random secret was generated. This is not recommended for production.');
}
