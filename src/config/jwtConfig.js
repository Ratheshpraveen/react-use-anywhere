const crypto = require('crypto');

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex'),
  ACCESS_TOKEN_EXPIRATION: '15m', // Short-lived access token
  REFRESH_TOKEN_EXPIRATION: '7d', // Longer-lived refresh token
  REFRESH_TOKEN_COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  },
  // Enhanced security configurations
  JWT_ISSUER: 'react-use-anywhere-app',
  JWT_AUDIENCE: 'react-use-anywhere-users',
  // Recommended minimum salt rounds for bcrypt
  SALT_ROUNDS: 12
};
