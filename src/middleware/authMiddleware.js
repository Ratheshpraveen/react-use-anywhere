const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(403).json({ 
      error: 'No token provided', 
      message: 'Authentication token is required' 
    });
  }

  // Extract token (assuming "Bearer TOKEN" format)
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to request object
    req.user = decoded;
    
    // Proceed to next middleware
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired', 
        message: 'Authentication token has expired' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid authentication token' 
    });
  }
};

/**
 * Middleware to check user role/permissions
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 */
const checkRoles = (allowedRoles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(403).json({ 
        error: 'Access Denied', 
        message: 'User not authenticated' 
      });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Forbidden', 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRoles
};
