const User = require('../models/User');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: 'No token provided' });
  }

  // Extract the token (assuming "Bearer TOKEN" format)
  const token = authHeader.split(' ')[1];

  // Verify the token
  const decoded = User.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  // Attach the user information to the request object
  req.user = decoded;
  next();
};

module.exports = authMiddleware;
