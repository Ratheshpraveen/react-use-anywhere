const TokenService = require('../services/tokenService');

const authMiddleware = (req, res, next) => {
  // Get the authorization header
  const authHeader = req.headers.authorization;

  // Check if authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract the token
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token
    const decoded = TokenService.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    // Attach user info to the request object
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

module.exports = authMiddleware;
