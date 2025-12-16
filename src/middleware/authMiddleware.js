const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Extract the token (assuming "Bearer TOKEN" format)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    req.user = decoded;
    
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Middleware to protect routes that require authentication
const requireAuth = (req, res, next) => {
  authMiddleware(req, res, next);
};

module.exports = {
  authMiddleware,
  requireAuth
};
