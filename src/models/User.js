const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  tokenVersion: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
UserSchema.methods.isValidPassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to increment token version (for invalidating tokens)
UserSchema.methods.incrementTokenVersion = function() {
  this.tokenVersion += 1;
  return this.save();
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
