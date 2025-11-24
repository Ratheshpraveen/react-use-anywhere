import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'fallback_secret',
  expiresIn: process.env.JWT_EXPIRATION || '1h',
  issuer: 'react-use-anywhere-app'
};
