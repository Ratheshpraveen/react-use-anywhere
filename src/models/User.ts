import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

interface UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;
}

class User implements UserInterface {
  id?: string;
  username: string;
  email: string;
  password: string;

  constructor(user: UserInterface) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
  }

  // Hash password before saving
  async hashPassword() {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  // Compare password for login
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Generate access token
  generateAccessToken(): string {
    return jwt.sign(
      { id: this.id, email: this.email }, 
      process.env.JWT_SECRET || 'fallback_secret', 
      { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );
  }

  // Generate refresh token
  generateRefreshToken(): string {
    return jwt.sign(
      { id: this.id, email: this.email }, 
      process.env.REFRESH_TOKEN_SECRET || 'refresh_fallback_secret', 
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION || '7d' }
    );
  }
}

export default User;
