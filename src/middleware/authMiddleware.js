const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require('../utils/tokenUtils');

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    const decoded = verifyAccessToken(token);
    if (decoded) {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
  } else {
    res.status(401).json({ message: 'Authorization token required' });
  }
};

// Middleware for role-based access control
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const hasRequiredRole = roles.some(role => req.user.roles.includes(role));
    
    if (hasRequiredRole) {
      next();
    } else {
      res.status(403).json({ message: 'Insufficient permissions' });
    }
  };
};

// Error handling middleware for authentication
const authErrorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  next(err);
};

module.exports = {
  authenticateJWT,
  checkRole,
  authErrorHandler
};
