import mongoose, { Document, Schema } from 'mongoose';

// Interface for User document
export interface IUser extends Document {
  email: string;
  password: string;
  name?: string;
  token?: string;
  tokenExpiry?: Date;
}

// User Schema
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
  name: {
    type: String,
    trim: true
  },
  token: {
    type: String
  },
  tokenExpiry: {
    type: Date
  }
}, {
  timestamps: true
});

// Method to update refresh token
UserSchema.methods.updateToken = function(token: string, expiresIn: number) {
  this.token = token;
  this.tokenExpiry = new Date(Date.now() + expiresIn);
};

// Method to check if token is valid
UserSchema.methods.isTokenValid = function() {
  return this.tokenExpiry && this.tokenExpiry > new Date();
};

// Create and export the User model
export const User = mongoose.model<IUser>('User', UserSchema);
