import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

  // Generate JWT token
  generateToken(): string {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    return jwt.sign(
      { 
        id: this.id, 
        username: this.username, 
        email: this.email 
      }, 
      process.env.JWT_SECRET, 
      { 
        expiresIn: process.env.JWT_EXPIRATION || '1h' 
      }
    );
  }
}

export default User;
