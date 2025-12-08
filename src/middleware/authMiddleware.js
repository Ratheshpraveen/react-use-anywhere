const jwt = require('jsonwebtoken');
const { expressjwt: expressJwt } = require('express-jwt');
const bcrypt = require('bcryptjs');

// Secret key for JWT - in a real-world scenario, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object containing user details
 * @returns {string} JWT token
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { 
      expiresIn: '1h' 
    }
  );
};

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} plainPassword - Plain text password
 * @param {string} hashedPassword - Hashed password to compare against
 * @returns {Promise<boolean>} Whether passwords match
 */
const comparePassword = async (plainPassword, hashedPassword) => {
  return bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * JWT verification middleware
 * Checks for a valid JWT token in the Authorization header
 */
const verifyToken = expressJwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  }
});

/**
 * Role-based access control middleware
 * @param {string[]} roles - Allowed roles for the route
 * @returns {Function} Middleware function
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

/**
 * Error handling middleware for JWT authentication
 */
const handleAuthError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
  next(err);
};

module.exports = {
  generateToken,
  hashPassword,
  comparePassword,
  verifyToken,
  requireRole,
  handleAuthError
};
