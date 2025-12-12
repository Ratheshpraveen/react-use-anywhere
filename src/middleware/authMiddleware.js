const jwt = require('express-jwt');
const { expressjwt: expressJwt } = require('express-jwt');
const jsonwebtoken = require('jsonwebtoken');

// Secret key for JWT - in a real-world scenario, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

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

// Custom middleware for role-based access control
const checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    next();
  };
};

// Function to generate JWT token
const generateToken = (user) => {
  return jsonwebtoken.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

// Error handling middleware for authentication
const handleAuthError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Invalid or expired token',
      details: err.message
    });
  }
  next(err);
};

module.exports = {
  verifyToken,
  checkRole,
  generateToken,
  handleAuthError
};
