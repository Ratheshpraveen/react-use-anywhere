const jwt = require('express-jwt');
const { expressjwt: expressJwt } = require('express-jwt');
const dotenv = require('dotenv');

dotenv.config();

// Middleware to verify JWT token
const verifyToken = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } 
    return null;
  }
});

// Role-based access control middleware
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
      message: 'Invalid or expired token',
      error: err.message 
    });
  }
  next(err);
};

module.exports = {
  verifyToken,
  checkRole,
  handleAuthError
};
