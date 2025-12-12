const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key for JWT - in a real-world scenario, this should be in an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

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

  // Compare password for login
  comparePassword(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  }

  // Generate JWT token
  generateToken() {
    return jwt.sign(
      { 
        id: this.username, 
        email: this.email, 
        role: this.role 
      }, 
      JWT_SECRET, 
      { 
        expiresIn: '1h' 
      }
    );
  }

  // Static method to create a user
  static create(username, email, password, role) {
    return new User(username, email, password, role);
  }
}

module.exports = User;
