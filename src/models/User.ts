import bcrypt from 'bcryptjs';

export interface UserRole {
  ADMIN: 'admin';
  USER: 'user';
  MODERATOR: 'moderator';
}

export interface UserInterface {
  id: string;
  username: string;
  email: string;
  password: string;
  role: keyof UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export class User implements UserInterface {
  id: string;
  username: string;
  email: string;
  password: string;
  role: keyof UserRole;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Omit<UserInterface, 'createdAt' | 'updatedAt'>) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.role = data.role;
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // Method to hash password
  async hashPassword(): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(this.password, salt);
  }

  // Method to verify password
  async verifyPassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Method to update user details
  update(data: Partial<Omit<UserInterface, 'id' | 'createdAt'>>) {
    Object.assign(this, data);
    this.updatedAt = new Date();
  }

  // Method to sanitize user data for public consumption
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}
