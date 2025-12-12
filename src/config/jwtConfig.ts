import crypto from 'crypto';

// Generate a secure random secret key
const generateSecretKey = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

export const jwtConfig = {
  // Use environment variable or generate a secure random key
  SECRET_KEY: process.env.JWT_SECRET || generateSecretKey(),
  
  // Token expiration times
  ACCESS_TOKEN_EXPIRY: '15m',   // 15 minutes
  REFRESH_TOKEN_EXPIRY: '7d',   // 7 days
  
  // Token issuer
  ISSUER: 'your-app-name',
  
  // Token audience
  AUDIENCE: 'your-app-users'
};

// Utility to generate a new secret key if needed
export const regenerateSecretKey = (): string => {
  return generateSecretKey();
};
