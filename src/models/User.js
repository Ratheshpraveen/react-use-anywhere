const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const TokenUtils = require('../utils/tokenUtils');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  refreshTokens: [{
    token: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '7d'
    }
  }]
}, { timestamps: true });

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate access token
UserSchema.methods.generateAccessToken = function() {
  return TokenUtils.generateAccessToken(this);
};

// Method to generate refresh token
UserSchema.methods.generateRefreshToken = function() {
  const refreshToken = TokenUtils.generateRefreshToken(this);
  
  // Store refresh token
  this.refreshTokens.push({ token: refreshToken });
  
  return refreshToken;
};

// Method to remove old refresh tokens
UserSchema.methods.removeOldRefreshTokens = function() {
  const now = new Date();
  this.refreshTokens = this.refreshTokens.filter(
    token => token.createdAt > new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  );
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
