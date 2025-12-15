import mongoose, { Document, Schema } from 'mongoose';
import jwt from 'jsonwebtoken';

// Define User interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  generateAuthToken(): string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Create User Schema
const UserSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
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
    enum: ['user', 'admin', 'moderator'], 
    default: 'user' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Method to generate authentication token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role 
    }, 
    process.env.JWT_SECRET || 'default_secret',
    { expiresIn: process.env.TOKEN_EXPIRATION || '1h' }
  );
};

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the User model
export const User = mongoose.model<IUser>('User', UserSchema);
