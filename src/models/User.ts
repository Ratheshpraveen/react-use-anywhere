import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define User interface
export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
}

// Create User Schema
const UserSchema: Schema<IUser> = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  refreshToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate access token method
UserSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role 
    }, 
    process.env.JWT_SECRET || 'fallback_secret', 
    { 
      expiresIn: process.env.JWT_EXPIRATION || '1h' 
    }
  );
};

// Pre-save hook for password hashing
UserSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Create and export the User model
export const User = mongoose.model<IUser>('User', UserSchema);
