import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken } from '../config/jwtConfig';

export interface UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export class User {
  private user: UserInterface;

  constructor(userData: UserInterface) {
    this.user = userData;
  }

  // Hash password before saving
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.user.password = await bcrypt.hash(this.user.password, salt);
  }

  // Verify password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.user.password);
  }

  // Generate access token
  generateAccessToken() {
    const payload = {
      id: this.user.id,
      username: this.user.username,
      email: this.user.email,
      role: this.user.role
    };
    return generateAccessToken(payload);
  }

  // Generate refresh token
  generateRefreshToken() {
    const payload = {
      id: this.user.id,
      username: this.user.username
    };
    return generateRefreshToken(payload);
  }

  // Get user data without password
  getUserData() {
    const { password, ...userWithoutPassword } = this.user;
    return userWithoutPassword;
  }
}
