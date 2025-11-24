import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const authConfig = {
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret_key',
  jwtExpiration: process.env.JWT_EXPIRATION || '1h',
  jwtIssuer: process.env.JWT_ISSUER || 'react-use-anywhere-app',
};
