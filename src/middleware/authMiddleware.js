const jwt = require('jsonwebtoken');
const { expressjwt: expressJWT } = require('express-jwt');

// Load environment variables
require('dotenv').config();

// Secret key for JWT (should be stored in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION';

/**
 * Middleware to verify JWT token
 */
const verifyToken = expressJWT({
  secret: JWT_SECRET,
  algorithms: ['HS256'], // Specify the algorithm used for signing
  getToken: (req) => {
    // Check for token in Authorization header or cookies
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return req.cookies.token;
  }
});

/**
 * Custom error handler for JWT authentication
 */
const handleAuthError = (err, req, res, next) => {
  // Handle specific JWT errors
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      message: err.message
    });
  }
  next(err);
};

/**
 * Middleware to check user roles/permissions
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const checkRoles = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.auth) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check if user has the required role
    const userRole = req.auth.role;
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

/**
 * Generate JWT Token
 * @param {Object} payload - User information to encode in the token
 * @param {string} expiresIn - Token expiration time
 */
const generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, JWT_SECRET, { 
    algorithm: 'HS256',
    expiresIn 
  });
};

/**
 * Refresh JWT Token
 * @param {string} token - Existing token to refresh
 */
const refreshToken = (token) => {
  try {
    // Verify the existing token
    const decoded = jwt.verify(token, JWT_SECRET, { ignoreExpiration: true });
    
    // Remove exp and iat for new token generation
    const { exp, iat, ...payload } = decoded;
    
    // Generate a new token
    return generateToken(payload);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  verifyToken,
  handleAuthError,
  checkRoles,
  generateToken,
  refreshToken
};
