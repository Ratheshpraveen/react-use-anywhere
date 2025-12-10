const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

// Secret key for JWT (in a real-world scenario, use environment variables)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

/**
 * Generate JWT token for a user
 * @param {Object} user - User object containing user details
 * @returns {string} Generated JWT token
 */
const generateToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
  
  // Log token generation
  logAuthEvent('TOKEN_GENERATED', `Token generated for user: ${user.email}`);
  
  return token;
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    logAuthEvent('AUTH_ERROR', `Token verification failed: ${error.message}`);
    return null;
  }
};

/**
 * Middleware to protect routes
 */
const protectRoute = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    logAuthEvent('AUTH_ERROR', 'No token provided');
    return res.status(401).json({ message: 'No token provided' });
  }
  
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
  
  req.user = decoded;
  next();
};

/**
 * Log authentication events
 * @param {string} eventType - Type of authentication event
 * @param {string} message - Event message
 */
const logAuthEvent = (eventType, message) => {
  const logDir = path.resolve('logs');
  
  // Ensure logs directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
  
  const logPath = path.resolve(logDir, 'auth.log');
  const logEntry = `${new Date().toISOString()} - ${eventType}: ${message}\n`;
  
  fs.appendFile(logPath, logEntry, (err) => {
    if (err) {
      console.error('Failed to write to log file', err);
    }
  });
};

/**
 * Hash password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare provided password with stored hash
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Stored hashed password
 * @returns {Promise<boolean>} Password match result
 */
const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = {
  generateToken,
  verifyToken,
  protectRoute,
  logAuthEvent,
  hashPassword,
  comparePassword
};
