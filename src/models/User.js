const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, TOKEN_EXPIRATION } = require('../config/jwtConfig');

class User {
  constructor(username, password, email) {
    this.username = username;
    this.password = password;
    this.email = email;
  }

  // Hash password before saving
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Compare provided password with stored hash
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Generate JWT token
  generateToken() {
    return jwt.sign(
      { 
        id: this.id, 
        username: this.username, 
        email: this.email 
      }, 
      JWT_SECRET, 
      { expiresIn: TOKEN_EXPIRATION }
    );
  }

  // Static method to verify token
  static verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = User;
