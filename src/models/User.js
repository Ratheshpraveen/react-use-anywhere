const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

  // Compare password for login
  async comparePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Generate JWT token
  generateToken() {
    return jwt.sign(
      { 
        id: this.username, 
        email: this.email 
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: process.env.JWT_EXPIRATION 
      }
    );
  }

  // Static method to verify token
  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

module.exports = User;
