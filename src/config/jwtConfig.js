require('dotenv').config();
const crypto = require('crypto');

// Generate a secure random secret key if not provided
const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

module.exports = {
  // JWT Secret for access tokens
  JWT_SECRET: process.env.JWT_SECRET || generateSecretKey(),
  
  // Separate secret for refresh tokens for added security
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || generateSecretKey(),
  
  // Token expiration times
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY || '15m', // 15 minutes
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY || '7d', // 7 days
  
  // Additional configuration options
  ISSUER: process.env.JWT_ISSUER || 'MyApp',
  AUDIENCE: process.env.JWT_AUDIENCE || 'MyAppUsers'
};
