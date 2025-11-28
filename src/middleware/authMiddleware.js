const { verifyToken } = require('../utils/tokenUtils');

/**
 * Middleware to protect routes that require authentication
 */
const protectRoute = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if token exists
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'No token provided, authorization denied' 
    });
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      error: 'Token is not valid' 
    });
  }

  // Attach user to the request object
  req.user = decoded;
  next();
};

/**
 * Middleware to handle authentication errors
 */
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized access'
    });
  }

  res.status(500).json({
    error: 'Internal server error'
  });
};

module.exports = {
  protectRoute,
  errorHandler
};
