const { verifyToken } = require('../utils/tokenUtils');

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'No token provided',
      message: 'Authentication required. Please log in.'
    });
  }

  // Extract token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ 
      error: 'Invalid token',
      message: 'Authentication failed. Please log in again.'
    });
  }

  // Attach user ID to request object for further use
  req.userId = decoded.id;
  next();
};

module.exports = authMiddleware;
