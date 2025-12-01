const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      error: 'No token provided', 
      message: 'Authentication token is required' 
    });
  }

  // Extract the token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the JWT secret (make sure to set this in your .env file)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach the decoded user information to the request object
    req.user = decoded;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    // Handle different types of JWT errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired', 
        message: 'Authentication token has expired' 
      });
    }
    
    return res.status(401).json({ 
      error: 'Invalid token', 
      message: 'Unable to authenticate' 
    });
  }
};

// Helper function to generate JWT token
const generateToken = (payload) => {
  return jwt.sign(
    payload, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: '1h' // Token expires in 1 hour
    }
  );
};

module.exports = {
  authMiddleware,
  generateToken
};
