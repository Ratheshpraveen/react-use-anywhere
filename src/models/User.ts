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
    enum: ['user', 'admin', 'moderator'], 
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

// Generate access token method
UserSchema.methods.generateAccessToken = function() {
  const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '15m' }
  );
};

export const User = mongoose.model<IUser>('User', UserSchema);
