const { verifyToken } = require('../utils/tokenUtils');

const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract token (assuming "Bearer TOKEN" format)
  const token = authHeader.split(' ')[1];

  // Verify token
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user ID to request object
  req.userId = decoded.id;
  next();
};

module.exports = authMiddleware;
