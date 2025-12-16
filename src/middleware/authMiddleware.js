const jwt = require('express-jwt');
const { expressjwt: expressJwt } = require('express-jwt');
const { JWT_SECRET } = require('../config/jwtConfig');

// Middleware to verify JWT token
const verifyToken = expressJwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } 
    return null;
  }
});

// Error handling middleware for JWT authentication
const handleAuthError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      message: err.message
    });
  }
  next();
};

// Middleware to check user roles
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({
        error: 'Access denied',
        message: 'Insufficient permissions'
      });
    }
    next();
  };
};

module.exports = {
  verifyToken,
  handleAuthError,
  checkRole
};
