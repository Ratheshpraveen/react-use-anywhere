const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

class User {
  constructor(username, email, password, role = 'user') {
    this.username = username;
    this.email = email;
    this.password = this.hashPassword(password);
    this.role = role;
  }

  // Hash password using bcrypt
  hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  // Verify password
  comparePassword(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  }

  // Generate JWT token
  generateToken() {
    return jwt.sign(
      { 
        id: this.id, 
        username: this.username, 
        email: this.email, 
        role: this.role 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );
  }

  // Static method to authenticate user
  static authenticate(users, email, password) {
    const user = users.find(u => u.email === email);
    if (user && user.comparePassword(password)) {
      return user;
    }
    return null;
  }
}

module.exports = User;
