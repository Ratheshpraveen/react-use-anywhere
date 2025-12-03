const mongoose = require('mongoose');
const { hashPassword } = require('../middleware/authMiddleware');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    trim: true
  },
  lastName: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    this.password = await hashPassword(this.password);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if the provided password is correct
UserSchema.methods.isValidPassword = async function(password) {
  const { comparePassword } = require('../middleware/authMiddleware');
  return comparePassword(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
