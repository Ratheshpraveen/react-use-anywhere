const authMiddleware = require('./authMiddleware');

const protectedRouteMiddleware = (req, res, next) => {
  // Use the existing auth middleware
  authMiddleware(req, res, () => {
    // Additional role-based or custom authorization checks can be added here
    // For now, we'll just ensure the user is authenticated
    next();
  });
};

module.exports = protectedRouteMiddleware;
