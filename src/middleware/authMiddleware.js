const { verifyToken } = require('../utils/tokenUtils');

/**
 * Middleware to protect routes requiring authentication
 */
const protectRoute = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'No token provided, authorization denied' 
    });
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = verifyToken(token);
    
    // Attach user to request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      message: 'Token is not valid' 
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
      return res.status(401).json({ 
        message: 'Not authorized' 
      });
    }

    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

module.exports = {
  protectRoute,
  checkRoles
};
