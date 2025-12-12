import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  SECRET: process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION',
  EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1h',
  ISSUER: process.env.JWT_ISSUER || 'your-app-name',
  AUDIENCE: process.env.JWT_AUDIENCE || 'your-app-users'
};

export enum UserRoles {
  USER = 'user',
  ADMIN = 'admin'
}
