const jwt = require('jsonwebtoken');

class TokenUtils {
  // Generate access token
  static generateAccessToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' }
    );
  }

  // Generate refresh token
  static generateRefreshToken(user) {
    return jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
    );
  }

  // Verify access token
  static verifyAccessToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Check if token is expired
  static isTokenExpired(token) {
    try {
      const decoded = jwt.decode(token);
      return decoded.exp < Date.now() / 1000;
    } catch (error) {
      return true;
    }
  }
}

module.exports = TokenUtils;
