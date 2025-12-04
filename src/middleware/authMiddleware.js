const jwt = require('express-jwt');
const { expressjwt: expressJwt } = require('express-jwt');
const { JWT_SECRET } = require('../config/keys'); // Assuming you have a keys configuration file

// Middleware to verify JWT token
const verifyToken = expressJwt({
  secret: JWT_SECRET,
  algorithms: ['HS256'], // Specify the algorithm used for signing
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } 
    return null;
  }
});

// Middleware to check user roles (optional)
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

// Error handling middleware for JWT authentication
const handleAuthError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      message: err.message
    });
  }
  next(err);
};

module.exports = {
  verifyToken,
  checkRole,
  handleAuthError
};
