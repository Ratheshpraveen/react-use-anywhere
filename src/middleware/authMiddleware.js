const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = User.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Token is not valid' });
    }

    // Attach user to request object
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};

module.exports = authMiddleware;
