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
    // Method to compare password
    async comparePassword(candidatePassword) {
      return bcrypt.compare(candidatePassword, this.password);
    },

    // Method to generate access token
    generateAccessToken() {
      const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
      return jwt.sign(
        { 
          id: this._id, 
          email: this.email, 
          role: this.role 
        }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
      );
    },

    // Method to generate refresh token
    generateRefreshToken() {
      const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
      return jwt.sign(
        { 
          id: this._id 
        }, 
        JWT_SECRET, 
        { expiresIn: '7d' }
      );
    },

    // Method to validate token
    static async validateToken(token) {
      const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';
      try {
        return jwt.verify(token, JWT_SECRET);
      } catch (error) {
        return null;
      }
    }
  }
});

// Pre-save hook to hash password before saving
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
