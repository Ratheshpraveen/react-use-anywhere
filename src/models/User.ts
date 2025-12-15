import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define User Interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
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
    unique: true, 
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
  }
}, { timestamps: true });

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate Access Token
UserSchema.methods.generateAccessToken = function() {
  const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
  const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

  return jwt.sign(
    { 
      id: this._id, 
      role: this.role 
    }, 
    JWT_SECRET, 
    { expiresIn: TOKEN_EXPIRATION }
  );
};

// Generate Refresh Token
UserSchema.methods.generateRefreshToken = function() {
  const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'fallback_refresh_secret';

  return jwt.sign(
    { id: this._id }, 
    REFRESH_TOKEN_SECRET, 
    { expiresIn: '7d' }
  );
};

// Pre-save hook for password hashing
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

export const User = mongoose.model<IUser>('User', UserSchema);
