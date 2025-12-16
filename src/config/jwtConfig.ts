import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
  ACCESS_TOKEN_EXPIRY: '15m',   // 15 minutes
  REFRESH_TOKEN_EXPIRY: '7d',   // 7 days
  ISSUER: 'YourAppName',
};

export const PASSWORD_SALT_ROUNDS = 10; // For bcrypt hashing
