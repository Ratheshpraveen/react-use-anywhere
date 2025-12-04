const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/keys');

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

    // Generate JWT token
    generateAuthToken() {
      return jwt.sign(
        { 
          id: this._id, 
          email: this.email, 
          role: this.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '15m' }
      );
    }
  }
});

// Create index for email to improve query performance
UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
