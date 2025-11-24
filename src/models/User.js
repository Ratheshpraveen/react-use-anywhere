const bcrypt = require('bcryptjs');

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  // Method to hash password before saving
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    return this.password;
  }

  // Method to validate password
  async validatePassword(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  }

  // Validate user input
  validate() {
    if (!this.username || this.username.length < 3) {
      throw new Error('Username must be at least 3 characters long');
    }
    if (!this.password || this.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }
  }
}

module.exports = User;
