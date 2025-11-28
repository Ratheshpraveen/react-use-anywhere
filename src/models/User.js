const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { generateToken, generateRefreshToken } = require('../utils/tokenUtils');

const UserSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

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

// Method to check password
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate access token
UserSchema.methods.generateAccessToken = function() {
  return generateToken({ 
    id: this._id, 
    username: this.username, 
    email: this.email 
  });
};

// Method to generate refresh token
UserSchema.methods.generateRefreshToken = function() {
  return generateRefreshToken({ 
    id: this._id 
  });
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
