const { verifyToken } = require('../utils/tokenUtils');

/**
 * Middleware to protect routes requiring authentication
 */
const protectRoute = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if token exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      message: 'No token provided, authorization denied' 
    });
  }

  // Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  // Verify the token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      message: 'Token is not valid' 
    });
  }

  // Attach user information to the request
  req.user = decoded;
  next();
};

module.exports = {
  protectRoute
};
