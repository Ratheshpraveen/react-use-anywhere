import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define User interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  refreshToken?: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// User Schema
const UserSchema: Schema = new Schema({
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
  },
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  },
  refreshToken: { 
    type: String 
  }
}, { timestamps: true });

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate Access Token
UserSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role }, 
    process.env.JWT_SECRET || '', 
    { expiresIn: '15m' }
  );
};

// Generate Refresh Token
UserSchema.methods.generateRefreshToken = function() {
  const refreshToken = jwt.sign(
    { id: this._id, role: this.role },
    process.env.REFRESH_TOKEN_SECRET || '',
    { expiresIn: '7d' }
  );
  
  // Optional: Store refresh token in the database
  this.refreshToken = refreshToken;
  this.save();

  return refreshToken;
};

// Create and export the model
export const User = mongoose.model<IUser>('User', UserSchema);
