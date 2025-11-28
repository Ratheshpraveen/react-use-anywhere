import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface UserInterface {
  id?: string;
  email: string;
  password: string;
}

class User {
  private static users: UserInterface[] = [];

  static async create(email: string, password: string): Promise<UserInterface> {
    // Check if user already exists
    const existingUser = this.users.find(user => user.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: UserInterface = {
      id: Date.now().toString(), // Simple ID generation
      email,
      password: hashedPassword
    };

    this.users.push(newUser);
    return newUser;
  }

  static async authenticate(email: string, password: string): Promise<string> {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email }, 
      process.env.JWT_SECRET || 'default_secret', 
      { expiresIn: process.env.JWT_EXPIRATION || '1h' }
    );

    return token;
  }

  static findById(id: string): UserInterface | undefined {
    return this.users.find(user => user.id === id);
  }
}

export default User;
