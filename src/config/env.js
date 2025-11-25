import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Export configuration
export const config = {
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_key_for_development',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h',

  // Other environment-specific configurations can be added here
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 3000,
};
