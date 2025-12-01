const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/jwtUtils');

class User {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
  }

  /**
   * Hash the user's password
   * @returns {string} Hashed password
   */
  hashPassword() {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(this.password, salt);
  }

  /**
   * Verify user password
   * @param {string} inputPassword - Password to verify
   * @returns {boolean} Whether password is correct
   */
  verifyPassword(inputPassword) {
    return bcrypt.compareSync(inputPassword, this.password);
  }

  /**
   * Generate JWT token for the user
   * @returns {string} JWT token
   */
  generateAuthToken() {
    return generateToken(this);
  }

  /**
   * Create a new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {User} New user instance
   */
  static create(email, password) {
    const user = new User(null, email, password);
    user.password = user.hashPassword();
    return user;
  }
}

module.exports = User;
