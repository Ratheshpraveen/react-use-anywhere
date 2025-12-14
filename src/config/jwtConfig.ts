import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_please_use_env',
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
};

export const generateTokenSecret = (): string => {
  // In a real-world scenario, use a cryptographically secure method to generate secret
  return process.env.JWT_SECRET || JWT_CONFIG.SECRET;
};
