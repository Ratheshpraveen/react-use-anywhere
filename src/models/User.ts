import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_CONFIG, PASSWORD_SALT_ROUNDS } from '../config/jwtConfig';

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
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
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
}, { timestamps: true });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  // Only hash the password if it has been modified (or is new)
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
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      username: this.username, 
      role: this.role 
    }, 
    JWT_CONFIG.SECRET, 
    { 
      expiresIn: JWT_CONFIG.EXPIRES_IN,
      issuer: JWT_CONFIG.ISSUER 
    }
  );
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;
