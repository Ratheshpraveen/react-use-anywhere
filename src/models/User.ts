import mongoose, { Schema, Document } from 'mongoose';

// User Role Enum
export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

// User Interface
export interface IUser extends Document {
  email: string;
  password: string;
  role: UserRole;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  lastLogin?: Date;
}

// User Schema
const UserSchema: Schema = new Schema({
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
  firstName: { 
    type: String, 
    trim: true 
  },
  lastName: { 
    type: String, 
    trim: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  lastLogin: { 
    type: Date 
  }
});

// Optional: Add methods to the schema
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  const bcrypt = require('bcryptjs');
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.updateLastLogin = function() {
  this.lastLogin = new Date();
  return this.save();
};

export const User = mongoose.model<IUser>('User', UserSchema);

export default User;
