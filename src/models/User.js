const bcrypt = require('bcryptjs');
const { generateToken } = require('../utils/tokenUtils');

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = this.hashPassword(password);
  }

  hashPassword(password) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  comparePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  generateAuthToken() {
    return generateToken(this.email);
  }
}

module.exports = User;
