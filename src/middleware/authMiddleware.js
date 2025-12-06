const jwt = require('jsonwebtoken');
const { expressjwt: expressJWT } = require('express-jwt');

// Load environment variables
require('dotenv').config();

// JWT Secret Key (should be stored in .env file)
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION';

/**
 * Middleware to verify JWT token
 * Checks token validity, expiration, and optionally role-based access
 */
const verifyToken = expressJWT({
  secret: JWT_SECRET,
  algorithms: ['HS256'], // Specify the algorithm used for signing
  getToken: (req) => {
    // Check for token in Authorization header or query parameter
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
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
 * Role-based access control middleware
 * @param {string|string[]} allowedRoles - Roles allowed to access the route
 */
const checkRoles = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure roles are always an array
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // Check if user has a valid role
    if (!req.auth || !req.auth.role || !roles.includes(req.auth.role)) {
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
 * @param {Object} payload - User data to be encoded in the token
 * @param {Object} options - JWT signing options
 */
const generateToken = (payload, options = {}) => {
  const defaultOptions = {
    expiresIn: '1h' // Default expiration of 1 hour
  };
  
  return jwt.sign(
    payload, 
    JWT_SECRET, 
    { ...defaultOptions, ...options }
  );
};

module.exports = {
  verifyToken,
  handleAuthError,
  checkRoles,
  generateToken
};
