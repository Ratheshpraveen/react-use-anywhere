import mongoose, { Schema, Document } from 'mongoose';

// Define User interface
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create User Schema
const UserSchema: Schema = new Schema({
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
    lowercase: true,
    trim: true
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
  }
}, {
  timestamps: true
});

// Create and export the User model
export const User = mongoose.model<IUser>('User', UserSchema);
