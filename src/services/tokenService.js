const jwt = require('jsonwebtoken');
require('dotenv').config();

class TokenService {
  // Generate access token
  static generateAccessToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
  }

  // Generate refresh token
  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
  }

  // Verify token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Refresh access token
  static refreshAccessToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
      // Create a new access token with the same user info
      return this.generateAccessToken({
        id: decoded.id,
        email: decoded.email
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}

module.exports = TokenService;
