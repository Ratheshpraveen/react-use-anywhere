const jwt = require('express-jwt');
const { JWT_SECRET } = require('../config/jwtConfig');

// JWT Verification Middleware
const verifyToken = jwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => {
    // Check Authorization header
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    // Check cookies
    return req.cookies.accessToken;
  }
});

// Role-based Access Control Middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    // Ensure user is authenticated first
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

// Error handling middleware for authentication
const authErrorHandler = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Invalid or expired token',
      error: err.message
    });
  }
  next(err);
};

module.exports = {
  verifyToken,
  checkRole,
  authErrorHandler
};
