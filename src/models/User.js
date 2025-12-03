const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = this.hashPassword(password);
  }

  // Hash password using bcrypt
  hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  // Verify password
  verifyPassword(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  }

  // Generate JWT token
  generateToken() {
    return jwt.sign(
      { 
        username: this.username, 
        email: this.email 
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: process.env.JWT_EXPIRATION 
      }
    );
  }

  // Static method to authenticate user
  static authenticate(username, password, users) {
    const user = users.find(u => u.username === username);
    if (user && user.verifyPassword(password)) {
      return user.generateToken();
    }
    return null;
  }
}

module.exports = User;
