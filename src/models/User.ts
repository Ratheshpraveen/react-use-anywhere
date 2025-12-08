import bcrypt from 'bcryptjs';
import { jwtConfig } from '../config/jwtConfig';

export interface UserRole {
  ADMIN: 'ADMIN';
  USER: 'USER';
}

export interface IUser {
  username: string;
  email: string;
  password: string;
  roles: string[];
}

export class User {
  private user: IUser;

  constructor(userData: IUser) {
    this.user = userData;
  }

  // Hash password before saving
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.user.password = await bcrypt.hash(this.user.password, salt);
  }

  // Verify password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.user.password);
  }

  // Generate access token
  generateAccessToken() {
    const payload = {
      username: this.user.username,
      email: this.user.email,
      roles: this.user.roles
    };
    return jwtConfig.generateAccessToken(payload);
  }

  // Generate refresh token
  generateRefreshToken() {
    const payload = {
      username: this.user.username,
      email: this.user.email,
      roles: this.user.roles
    };
    return jwtConfig.generateRefreshToken(payload);
  }

  // Get user data without password
  getUserData() {
    const { password, ...userData } = this.user;
    return userData;
  }
}
