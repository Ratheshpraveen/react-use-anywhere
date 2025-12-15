const jwt = require('jsonwebtoken');
const { expressjwt: expressJWT } = require('express-jwt');

// Load environment variables
require('dotenv').config();

// JWT Verification Middleware
const verifyToken = expressJWT({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => req.headers.authorization?.split(' ')[1]
});

// Custom middleware to handle JWT errors
const handleJWTError = (err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ 
      error: 'Invalid or expired token', 
      message: 'Please log in again' 
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

// Token refresh middleware
const refreshToken = (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    // Generate new access token
    const newAccessToken = jwt.sign(
      { 
        id: decoded.id, 
        role: decoded.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    
    req.newAccessToken = newAccessToken;
    next();
  } catch (error) {
    res.status(401).json({ 
      error: 'Invalid refresh token', 
      message: 'Please log in again' 
    });
  }
};

module.exports = {
  verifyToken,
  handleJWTError,
  checkRole,
  refreshToken
};
