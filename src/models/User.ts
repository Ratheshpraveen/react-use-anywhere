import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Define the interface for the User document
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  
  // Method to check if the password is correct
  comparePassword(candidatePassword: string): Promise<boolean>;
  
  // Method to generate JWT token
  generateAuthToken(): string;
}

// Create the User Schema
const UserSchema: Schema<IUser> = new Schema({
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
    trim: true,
    lowercase: true
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

// Method to compare password
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function(): string {
  const JWT_SECRET = process.env.JWT_SECRET || 'your_default_secret_key_change_in_production';
  
  return jwt.sign(
    { 
      userId: this._id, 
      role: this.role 
    }, 
    JWT_SECRET, 
    { expiresIn: '1h' }
  );
};

// Pre-save hook to hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Create and export the User model
export const User = mongoose.model<IUser>('User', UserSchema);
