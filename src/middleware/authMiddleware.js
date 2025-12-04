const jwt = require('jsonwebtoken');
const { expressjwt: expressJWT } = require('express-jwt');
const bcrypt = require('bcryptjs');

// Secret key for JWT - in a real-world scenario, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Generate JWT Token
 * @param {Object} user - User object containing user details
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email,
      role: user.role || 'user' 
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

/**
 * Compare password with hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password from database
 * @returns {Promise<boolean>} Password match result
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * JWT Verification Middleware
 * Checks for valid JWT token and attaches user info to request
 */
const verifyToken = expressJWT({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
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
 * Role-based Access Control Middleware
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    // Check if user is authenticated and has required role
    if (!req.auth || !allowedRoles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

/**
 * Error handler for JWT authentication errors
 */
const handleAuthError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      details: err.message
    });
  }
  next(err);
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  verifyToken,
  checkRole,
  handleAuthError,
  JWT_SECRET
};
