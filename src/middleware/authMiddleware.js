const jwt = require('jsonwebtoken');

// Ensure you have a secure secret key - typically stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_CHANGE_IN_PRODUCTION';

/**
 * Middleware to verify JWT token and extract user information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const authMiddleware = (req, res, next) => {
  // Get the token from Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'No token provided', 
      message: 'Authentication required' 
    });
  }

  // Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach user information to the request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'user' // Default to 'user' if no role specified
    };

    // Proceed to the next middleware/route handler
    next();
  } catch (error) {
    // Handle different types of JWT errors
    let errorMessage = 'Authentication failed';
    let statusCode = 401;

    switch (error.name) {
      case 'TokenExpiredError':
        errorMessage = 'Token has expired';
        break;
      case 'JsonWebTokenError':
        errorMessage = 'Invalid token';
        break;
      case 'NotBeforeError':
        errorMessage = 'Token not yet active';
        break;
      default:
        // Log the actual error for server-side debugging
        console.error('JWT Verification Error:', error);
    }

    return res.status(statusCode).json({ 
      error: errorMessage,
      message: 'Authentication failed' 
    });
  }
};

/**
 * Middleware to check user roles/permissions
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const checkRoles = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(403).json({ 
        error: 'Access denied', 
        message: 'User not authenticated' 
      });
    }

    // Check if user's role is in the allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions', 
        message: 'You do not have permission to access this resource' 
      });
    }

    // User has required role, proceed
    next();
  };
};

/**
 * Utility function to generate JWT token
 * @param {Object} payload - User information to encode in the token
 * @param {Object} options - JWT signing options
 * @returns {string} Generated JWT token
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
  authMiddleware,
  checkRoles,
  generateToken
};
