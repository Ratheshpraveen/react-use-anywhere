import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_please_use_env',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  ISSUER: process.env.JWT_ISSUER || 'your-app-name',
  REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret_key',
  REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
};

// Ensure a secure secret is used in production
if (process.env.NODE_ENV === 'production' && JWT_CONFIG.SECRET === 'fallback_secret_key_please_use_env') {
  console.warn('WARNING: Using fallback JWT secret. Please set JWT_SECRET in your environment variables.');
}
