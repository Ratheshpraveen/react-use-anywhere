const authMiddleware = require('./authMiddleware');

const protectedRoute = (req, res, next) => {
  authMiddleware(req, res, () => {
    // Additional role-based access control can be added here if needed
    next();
  });
};

module.exports = protectedRoute;
