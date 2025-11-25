const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate access token
UserSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      username: this.username 
    }, 
    process.env.JWT_SECRET, 
    { 
      expiresIn: process.env.JWT_EXPIRATION 
    }
  );
};

// Method to generate refresh token
UserSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { 
      id: this._id 
    }, 
    process.env.REFRESH_TOKEN_SECRET, 
    { 
      expiresIn: process.env.REFRESH_TOKEN_EXPIRATION 
    }
  );
};

module.exports = mongoose.model('User', UserSchema);
