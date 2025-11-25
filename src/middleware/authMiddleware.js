const User = require('../models/User');

const authMiddleware = {
  // Middleware to verify JWT token
  async verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = User.verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  },

  // Middleware for protected routes
  async protectedRoute(req, res, next) {
    try {
      await this.verifyToken(req, res, next);
    } catch (error) {
      res.status(500).json({ error: 'Authentication error' });
    }
  }
};

module.exports = authMiddleware;
