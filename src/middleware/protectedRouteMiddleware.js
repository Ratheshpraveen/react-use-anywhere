const { authenticateJWT } = require('./authMiddleware');

/**
 * Middleware to protect routes that require authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protectRoute = (req, res, next) => {
  authenticateJWT(req, res, () => {
    // Additional role-based authorization can be added here if needed
    next();
  });
};

module.exports = { protectRoute };
