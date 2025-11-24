import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import JwtService from '../../lib/services/jwtService';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthTokens(): { accessToken: string; refreshToken: string };
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
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' 
  }
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate authentication tokens
UserSchema.methods.generateAuthTokens = function() {
  const payload = {
    userId: this._id,
    role: this.role
  };

  return {
    accessToken: JwtService.generateAccessToken(payload),
    refreshToken: JwtService.generateRefreshToken(payload)
  };
};

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
