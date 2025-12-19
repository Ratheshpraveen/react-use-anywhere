const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
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
      return res.status(401).json({ message: 'Token expired' });
    }
    
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
