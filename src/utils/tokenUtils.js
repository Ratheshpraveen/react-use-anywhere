const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Generate an access token for a user
 * @param {Object} user - User object containing user details
 * @returns {string} JWT access token
 */
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY 
    }
  );
};

/**
 * Generate a refresh token for a user
 * @param {Object} user - User object containing user details
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (user) => {
  return jwt.sign(
    { 
      id: user.id 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY 
    }
  );
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken
};
