import jwt from 'jsonwebtoken';
import axios from 'axios';

const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

/**
 * Generate an access token
 * @param {Object} payload - User information to encode in the token
 * @param {number} expiresIn - Token expiration time in seconds
 * @returns {string} Generated JWT token
 */
export const generateAccessToken = (payload, expiresIn = 3600) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Generate a refresh token
 * @param {Object} payload - User information to encode in the token
 * @param {number} expiresIn - Token expiration time in seconds
 * @returns {string} Generated refresh token
 */
export const generateRefreshToken = (payload, expiresIn = 7 * 24 * 3600) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn });
};

/**
 * Verify an access token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Verify a refresh token
 * @param {string} token - Refresh token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Refresh access token using a refresh token
 * @param {string} refreshToken - Refresh token to use for obtaining new access token
 * @returns {Promise<{accessToken: string, refreshToken: string}>} New access and refresh tokens
 */
export const refreshTokens = async (refreshToken) => {
  // Verify the refresh token
  const decoded = verifyRefreshToken(refreshToken);
  
  if (!decoded) {
    throw new Error('Invalid refresh token');
  }

  // Remove sensitive information from payload
  const { password, ...userPayload } = decoded;

  // Generate new tokens
  const newAccessToken = generateAccessToken(userPayload);
  const newRefreshToken = generateRefreshToken(userPayload);

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  };
};

/**
 * Decode a token without verification (use carefully)
 * @param {string} token - JWT token to decode
 * @returns {Object|null} Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshTokens,
  decodeToken
};
