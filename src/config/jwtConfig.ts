import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION',
  ACCESS_TOKEN_EXPIRY: '15m',   // 15 minutes
  REFRESH_TOKEN_EXPIRY: '7d',   // 7 days
  ISSUER: 'your-app-name',
};

// Validate JWT configuration
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: No JWT secret provided. Using fallback secret.');
}
