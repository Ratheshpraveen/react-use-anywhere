const Redis = require('ioredis');

// Create Redis client (configure based on your Redis setup)
const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
});

// Prefix for token blacklist keys
const TOKEN_BLACKLIST_PREFIX = 'blacklist:';

/**
 * Blacklist a token
 * @param {string} token - JWT token to blacklist
 * @param {number} [expiresIn=3600] - Expiration time in seconds (default 1 hour)
 */
const blacklistToken = async (token, expiresIn = 3600) => {
  try {
    // Store token in Redis with an expiration
    await redisClient.setex(`${TOKEN_BLACKLIST_PREFIX}${token}`, expiresIn, 'blacklisted');
  } catch (error) {
    console.error('Error blacklisting token:', error);
    throw error;
  }
};

/**
 * Check if a token is blacklisted
 * @param {string} token - JWT token to check
 * @returns {Promise<boolean>} - Whether the token is blacklisted
 */
const isTokenBlacklisted = async (token) => {
  try {
    const result = await redisClient.exists(`${TOKEN_BLACKLIST_PREFIX}${token}`);
    return result === 1;
  } catch (error) {
    console.error('Error checking token blacklist:', error);
    throw error;
  }
};

/**
 * Remove a token from the blacklist
 * @param {string} token - JWT token to remove from blacklist
 */
const removeBlacklistedToken = async (token) => {
  try {
    await redisClient.del(`${TOKEN_BLACKLIST_PREFIX}${token}`);
  } catch (error) {
    console.error('Error removing blacklisted token:', error);
    throw error;
  }
};

module.exports = {
  blacklistToken,
  isTokenBlacklisted,
  removeBlacklistedToken
};
