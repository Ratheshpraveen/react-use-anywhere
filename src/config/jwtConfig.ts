import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_please_use_env',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  ISSUER: process.env.JWT_ISSUER || 'your-app-name',
};

export const PASSWORD_SALT_ROUNDS = 10; // For bcrypt hashing
