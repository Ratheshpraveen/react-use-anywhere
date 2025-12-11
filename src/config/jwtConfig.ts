import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  // Secret key for JWT signing - should be a long, random string
  SECRET_KEY: process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION',
  
  // Token expiration times
  ACCESS_TOKEN_EXPIRY: '15m',   // 15 minutes
  REFRESH_TOKEN_EXPIRY: '7d',   // 7 days

  // Issuer of the token
  ISSUER: 'YourAppName',

  // Audience of the token
  AUDIENCE: 'YourAppDomain',

  // Token rotation configuration
  TOKEN_ROTATION_THRESHOLD_DAYS: 30,
};

// Secure key rotation function (placeholder - implement actual rotation mechanism)
export const rotateSecretKey = () => {
  // In a real-world scenario, this would involve:
  // 1. Generating a new secret key
  // 2. Storing the new key securely
  // 3. Invalidating old tokens
  // 4. Migrating to the new key
  console.warn('Key rotation not fully implemented');
  return JWT_CONFIG.SECRET_KEY;
};
