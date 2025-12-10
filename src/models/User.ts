import bcrypt from 'bcryptjs';
import { tokenConfig } from '../config/tokenConfig';

export interface UserRole {
  id: string;
  name: 'admin' | 'user' | 'moderator';
}

export interface UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
  roles: UserRole[];
}

export class User implements UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
  roles: UserRole[];

  constructor(user: UserInterface) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.roles = user.roles || [];
  }

  // Hash password before saving
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Compare password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Generate access token
  generateAccessToken() {
    const payload = {
      id: this.id,
      username: this.username,
      email: this.email,
      roles: this.roles.map(role => role.name)
    };
    return tokenConfig.generateAccessToken(payload);
  }

  // Generate refresh token
  generateRefreshToken() {
    const payload = {
      id: this.id,
      username: this.username
    };
    return tokenConfig.generateRefreshToken(payload);
  }

  // Check if user has a specific role
  hasRole(roleName: string): boolean {
    return this.roles.some(role => role.name === roleName);
  }

  // Sanitize user data for sending to client
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
