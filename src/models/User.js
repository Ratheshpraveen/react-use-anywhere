const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwtConfig');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  methods: {
    // Compare password method
    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    },

    // Generate access token
    generateAccessToken() {
      return jwt.sign(
        { id: this._id, role: this.role }, 
        jwtConfig.JWT_SECRET, 
        { expiresIn: jwtConfig.ACCESS_TOKEN_EXPIRY }
      );
    },

    // Generate refresh token
    generateRefreshToken() {
      return jwt.sign(
        { id: this._id }, 
        jwtConfig.REFRESH_TOKEN_SECRET, 
        { expiresIn: jwtConfig.REFRESH_TOKEN_EXPIRY }
      );
    }
  }
});

module.exports = mongoose.model('User', UserSchema);
