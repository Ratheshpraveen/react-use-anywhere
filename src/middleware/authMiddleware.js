const jwt = require('jsonwebtoken');
const { expressjwt: expressJWT } = require('express-jwt');
const jwtConfig = require('../config/jwtConfig');

// Middleware to verify JWT token
const verifyToken = expressJWT({
  secret: jwtConfig.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } 
    return null;
  }
});

// Custom error handler for unauthorized access
const handleUnauthorizedError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      message: err.message
    });
  }
  next(err);
};

// Role-based access control middleware
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'You do not have permission to access this resource'
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  handleUnauthorizedError,
  checkRole
};
