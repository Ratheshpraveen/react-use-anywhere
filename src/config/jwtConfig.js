require('dotenv').config();

// JWT Configuration
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'your_default_secret_key_here',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '1h', // 1 hour default expiration
  REFRESH_TOKEN_EXPIRATION: process.env.REFRESH_TOKEN_EXPIRATION || '7d', // 7 days default
  
  // Additional JWT-related configurations can be added here
  TOKEN_TYPES: {
    ACCESS: 'access',
    REFRESH: 'refresh'
  }
};
