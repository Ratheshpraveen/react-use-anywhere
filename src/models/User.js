const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

class User {
  constructor(username, email, password, role = 'user') {
    this.username = username;
    this.email = email;
    this.password = this.hashPassword(password);
    this.role = role;
  }

  /**
   * Hash password using bcrypt
   * @param {string} password - Plain text password
   * @returns {string} Hashed password
   */
  hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  /**
   * Compare provided password with stored hash
   * @param {string} password - Plain text password to check
   * @returns {boolean} Password match result
   */
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  /**
   * Generate JWT access token
   * @returns {string} JWT access token
   */
  generateAccessToken() {
    return jwt.sign(
      { 
        id: this.username, 
        email: this.email, 
        role: this.role 
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: process.env.JWT_EXPIRATION || '1h' 
      }
    );
  }

  /**
   * Generate JWT refresh token
   * @returns {string} JWT refresh token
   */
  generateRefreshToken() {
    return jwt.sign(
      { 
        id: this.username 
      }, 
      process.env.TOKEN_REFRESH_SECRET, 
      { 
        expiresIn: '7d' 
      }
    );
  }

  /**
   * Get user profile information
   * @returns {Object} User profile data
   */
  getProfile() {
    return {
      username: this.username,
      email: this.email,
      role: this.role
    };
  }
}

module.exports = User;
