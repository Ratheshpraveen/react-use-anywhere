import dotenv from 'dotenv';

dotenv.config();

export const JWT_CONFIG = {
  // Use a strong, randomly generated secret from environment variable
  SECRET_KEY: process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION',
  
  // Token expiration times
  ACCESS_TOKEN_EXPIRATION: '15m',   // Short-lived access token
  REFRESH_TOKEN_EXPIRATION: '7d',   // Longer-lived refresh token
  
  // Token generation options
  ISSUER: 'your-app-name',
  AUDIENCE: 'your-app-users'
};

// Ensure secret key is set in production
if (!process.env.JWT_SECRET && process.env.NODE_ENV === 'production') {
  console.error('CRITICAL: JWT Secret key is not set in production!');
  process.exit(1);
}
