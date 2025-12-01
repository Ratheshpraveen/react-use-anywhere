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
      message: 'No token, authorization denied' 
    });
  }

  // Extract token
  const token = authHeader.split(' ')[1];

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      message: 'Token is not valid' 
    });
  }

  // Attach user to request object
  req.user = decoded;
  next();
};

module.exports = {
  protectRoute
};
