const jsonwebtoken = require('jsonwebtoken');

// Secret key for JWT - in a real-world scenario, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Generate an access token
 * @param {Object} payload - User information to encode in the token
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
const generateAccessToken = (payload, expiresIn = '1h') => {
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Generate a refresh token
 * @param {Object} payload - User information to encode in the token
 * @param {string} expiresIn - Token expiration time
 * @returns {string} Refresh token
 */
const generateRefreshToken = (payload, expiresIn = '7d') => {
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jsonwebtoken.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Check if a token is expired
 * @param {string} token - JWT token to check
 * @returns {boolean} Whether the token is expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jsonwebtoken.decode(token);
    return Date.now() >= decoded.exp * 1000;
  } catch (error) {
    return true;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  isTokenExpired
};
