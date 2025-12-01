const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Secret key for JWT - in a real project, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_jwt_refresh_secret_key';

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Mock user database (replace with your actual user model/database)
const users = [
  {
    id: '1',
    username: 'testuser',
    password: bcrypt.hashSync('password123', 10)
  }
];

class AuthController {
  // User login method
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Find user
      const user = users.find(u => u.username === username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate tokens
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);

      res.json({
        accessToken,
        refreshToken,
        user: { id: user.id, username: user.username }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error during login', error: error.message });
    }
  }

  // Token refresh method
  static async refreshToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
      
      // Find user
      const user = users.find(u => u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Invalid refresh token' });
      }

      // Generate new access token
      const newAccessToken = this.generateAccessToken(user);

      res.json({ accessToken: newAccessToken });
    } catch (error) {
      res.status(403).json({ message: 'Invalid refresh token' });
    }
  }

  // Middleware to verify access token
  static verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  }

  // Generate access token
  static generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username }, 
      JWT_SECRET, 
      { expiresIn: ACCESS_TOKEN_EXPIRY }
    );
  }

  // Generate refresh token
  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, username: user.username }, 
      JWT_REFRESH_SECRET, 
      { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
  }
}

module.exports = AuthController;
