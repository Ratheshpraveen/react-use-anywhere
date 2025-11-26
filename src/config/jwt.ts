import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'your_default_secret_key',
  expiresIn: '1h', // Token expiration time
  refreshExpiresIn: '7d', // Refresh token expiration time
};
