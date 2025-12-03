import mongoose, { Document, Schema } from 'mongoose';

// Define the User interface
export interface IUser extends Document {
  email: string;
  name: string;
  passwordHash: string;
  role?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Create the User Schema
const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create and export the User model
const User = mongoose.model<IUser>('User', UserSchema);

export default User;
