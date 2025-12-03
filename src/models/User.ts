import mongoose, { Document, Schema } from 'mongoose';

// Define user roles
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  MANAGER = 'manager'
}

// User interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
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
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER
  },
  refreshToken: { 
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Create and export the User model
export const User = mongoose.model<IUser>('User', UserSchema);
