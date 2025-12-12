const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwtConfig');

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  // Extract token (assuming "Bearer TOKEN")
  const token = authHeader.split(' ')[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach user information to request object
    req.user = decoded;
    next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// Middleware for role-based access control
const checkRole = (roles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(403).json({ message: 'Authentication required' });
    }

    // Check if user has any of the required roles
    const hasRequiredRole = roles.some(role => req.user.roles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole
};
