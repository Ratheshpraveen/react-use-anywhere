import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG, PASSWORD_SALT_ROUNDS } from '../config/jwtConfig';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const UserSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(PASSWORD_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate access token
UserSchema.methods.generateAccessToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      username: this.username, 
      email: this.email,
      role: this.role 
    }, 
    JWT_CONFIG.SECRET, 
    { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function() {
  return jwt.sign(
    { 
      id: this._id 
    }, 
    JWT_CONFIG.SECRET, 
    { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model<IUser>('User', UserSchema);
