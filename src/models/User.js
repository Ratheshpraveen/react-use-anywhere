const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenUtils');

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

  // Compare provided password with stored hash
  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  // Generate JWT token for the user
  generateAuthToken() {
    // Assuming we use email or username as unique identifier
    return generateToken(this.email || this.username);
  }
}

module.exports = User;
