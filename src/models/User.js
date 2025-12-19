const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

class User {
  constructor(username, email, password, roles = ['user']) {
    this.username = username;
    this.email = email;
    this.password = this.hashPassword(password);
    this.roles = roles;
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
        id: this.id, 
        username: this.username, 
        email: this.email,
        role: this.roles[0] // Assuming first role is primary
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: process.env.TOKEN_EXPIRATION || '1h' 
      }
    );
  }

  // Static method to create a new user
  static create(username, email, password, roles) {
    return new User(username, email, password, roles);
  }
}

module.exports = User;
