import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ISSUER: 'your-app-name',
  AUDIENCE: 'your-app-domain'
};

export const generateTokenSecret = (): string => {
  // In a real-world scenario, use a cryptographically secure method to generate a secret
  return process.env.JWT_SECRET || JWT_CONFIG.SECRET;
};
