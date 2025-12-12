const crypto = require('crypto');

// Generate a secure random secret key
const generateSecretKey = () => {
  return crypto.randomBytes(64).toString('hex');
};

module.exports = {
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || generateSecretKey(),
  
  // Token expiration times
  ACCESS_TOKEN_EXPIRY: '15m',     // 15 minutes
  REFRESH_TOKEN_EXPIRY: '7d',     // 7 days
  
  // Token issuer
  ISSUER: 'YourAppName',
  
  // Audience (optional)
  AUDIENCE: 'YourAppDomain',
  
  // Refresh token rotation
  ROTATE_REFRESH_TOKENS: true
};
