const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authMiddleware = (req, res, next) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  
  // Check if Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Extract token (remove 'Bearer ' prefix)
  const token = authHeader.split(' ')[1];

  try {
    // Verify token using secret from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      roles: decoded.roles
    };

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    // Handle token verification errors
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware for role-based access control
const roleMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    // Check if user has any of the required roles
    const hasRequiredRole = req.user.roles.some(role => 
      requiredRoles.includes(role)
    );

    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Access denied' });
    }

    next();
  };
};

module.exports = {
  authMiddleware,
  roleMiddleware
};
