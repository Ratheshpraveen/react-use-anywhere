import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_please_use_env',
  ACCESS_TOKEN_EXPIRY: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
  REFRESH_TOKEN_EXPIRY: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
};

export const PASSWORD_SALT_ROUNDS = 10; // for bcrypt hashing
