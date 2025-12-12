const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION } = process.env;

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
});

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role 
    }, 
    JWT_SECRET, 
    { expiresIn: JWT_EXPIRATION }
  );
};

// Method to validate token
UserSchema.methods.validateToken = function(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id === this._id.toString();
  } catch (error) {
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema);
