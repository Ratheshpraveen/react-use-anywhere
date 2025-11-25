const jwt = require('jsonwebtoken');

// Secret key for JWT - in a real application, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// Middleware to verify JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        // Token is invalid or expired
        return res.status(403).json({ 
          message: 'Invalid or expired token',
          error: err.message 
        });
      }

      // Attach the decoded user information to the request
      req.user = user;
      next();
    });
  } else {
    // No token provided
    res.status(401).json({ message: 'Authorization token is required' });
  }
};

module.exports = {
  authenticateJWT
};
