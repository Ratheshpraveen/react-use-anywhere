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
  
  // Refresh token settings
  REFRESH_TOKEN_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
  }
};
