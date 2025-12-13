import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_please_use_env',
  ACCESS_TOKEN_EXPIRY: '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  ISSUER: 'your-app-name',
  AUDIENCE: 'your-app-users'
};

export const generateTokenSecret = (): string => {
  // In a real-world scenario, generate a secure random secret
  return process.env.JWT_SECRET || 
    crypto.randomBytes(64).toString('hex');
};
