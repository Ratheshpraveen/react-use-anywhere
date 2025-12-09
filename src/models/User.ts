import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwtConfig';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator'
}

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  roles: UserRole[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

const UserSchema = new mongoose.Schema<IUser>({
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
  roles: { 
    type: [String], 
    enum: Object.values(UserRole), 
    default: [UserRole.USER] 
  }
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as mongoose.CallbackError);
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
      roles: this.roles 
    }, 
    JWT_CONFIG.SECRET,
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
      id: this._id 
    }, 
    JWT_CONFIG.SECRET,
    {
      expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY,
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE
    }
  );
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
