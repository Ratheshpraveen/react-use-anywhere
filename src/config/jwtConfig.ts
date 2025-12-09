import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_please_use_env',
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ISSUER: 'your-app-name',
  AUDIENCE: 'your-app-domain'
};

// Generate a secure random secret key for production
export const generateSecureSecret = (): string => {
  return require('crypto').randomBytes(64).toString('hex');
};
