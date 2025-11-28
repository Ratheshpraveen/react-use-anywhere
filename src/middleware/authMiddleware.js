const jwt = require('jsonwebtoken');

const authMiddleware = {
  // Verify JWT token
  verifyToken: (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token is not valid' });
    }
  },

  // Refresh token mechanism
  refreshToken: (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(403).json({ error: 'Refresh token is required' });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      const newToken = jwt.sign(
        { id: decoded.id, username: decoded.username },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      res.json({ token: newToken });
    } catch (error) {
      res.status(403).json({ error: 'Invalid refresh token' });
    }
  },

  // Error handling middleware
  errorHandler: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Authentication error',
      message: err.message
    });
  }
};

module.exports = authMiddleware;
