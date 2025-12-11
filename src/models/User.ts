import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: UserRole;
  tokenVersion: number;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

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
    required: true 
  },
  role: { 
    type: String, 
    enum: Object.values(UserRole), 
    default: UserRole.USER 
  },
  tokenVersion: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

// Password hashing middleware
UserSchema.pre<IUser>('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    return next(error);
  }
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate access token
UserSchema.methods.generateAccessToken = function(): string {
  return jwt.sign(
    { 
      id: this._id, 
      username: this.username, 
      role: this.role 
    }, 
    JWT_CONFIG.SECRET_KEY, 
    {
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }
  );
};

// Method to generate refresh token
UserSchema.methods.generateRefreshToken = function(): string {
  return jwt.sign(
    { 
      id: this._id, 
      tokenVersion: this.tokenVersion 
    }, 
    JWT_CONFIG.SECRET_KEY, 
    {
      expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }
  );
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
