import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
  generateRefreshToken(): string;
}

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// Password hashing middleware
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password comparison method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate access token
UserSchema.methods.generateAuthToken = function(): string {
  return jwt.sign(
    { userId: this._id }, 
    process.env.JWT_SECRET!, 
    { expiresIn: process.env.JWT_EXPIRATION }
  );
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function(): string {
  return jwt.sign(
    { userId: this._id }, 
    process.env.REFRESH_TOKEN_SECRET!, 
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
  );
};

export const User = mongoose.model<IUser>('User', UserSchema);
