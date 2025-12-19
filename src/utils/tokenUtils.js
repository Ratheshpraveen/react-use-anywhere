const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class TokenUtils {
  // Generate a new token
  static generateToken(payload, secret = process.env.JWT_SECRET, expiresIn = '1h') {
    return jwt.sign(payload, secret, { expiresIn });
  }

  // Verify token
  static verifyToken(token, secret = process.env.JWT_SECRET) {
    try {
      return jwt.verify(token, secret);
    } catch (error) {
      return null;
    }
  }

  // Decode token without verification
  static decodeToken(token) {
    return jwt.decode(token);
  }

  // Generate refresh token
  static generateRefreshToken(payload) {
    return this.generateToken(
      payload, 
      process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET, 
      '7d'
    );
  }

  // Verify refresh token
  static verifyRefreshToken(token) {
    try {
      return jwt.verify(
        token, 
        process.env.REFRESH_TOKEN_SECRET || process.env.JWT_SECRET
      );
    } catch (error) {
      return null;
    }
  }
}

module.exports = TokenUtils;
