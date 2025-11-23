const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/environment');

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = this.hashPassword(password);
  }

  // Hash password using bcrypt
  hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  }

  // Compare password for login
  comparePassword(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  }

  // Generate JWT token
  generateToken() {
    return jwt.sign(
      { 
        username: this.username, 
        email: this.email 
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRATION }
    );
  }

  // Static method to verify JWT token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = User;
