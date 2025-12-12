import mongoose, { Document, Schema } from 'mongoose';

// Define User interface
export interface IUser extends Document {
  email: string;
  password: string;
  role: string;
  refreshToken?: string;
}

// Create User Schema
const UserSchema: Schema = new Schema({
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

// Create and export the User model
export const User = mongoose.model<IUser>('User', UserSchema);
