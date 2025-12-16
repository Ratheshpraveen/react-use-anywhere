import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG, PASSWORD_SALT_ROUNDS } from '../config/jwtConfig';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles?: string[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

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
  roles: { 
    type: [String], 
    default: ['user'] 
  }
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(PASSWORD_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function(): string {
  return jwt.sign(
    { 
      id: this._id, 
      username: this.username, 
      roles: this.roles 
    }, 
    JWT_CONFIG.SECRET, 
    { 
      expiresIn: JWT_CONFIG.EXPIRES_IN,
      issuer: JWT_CONFIG.ISSUER 
    }
  );
};

export const User = mongoose.model<IUser>('User', UserSchema);
