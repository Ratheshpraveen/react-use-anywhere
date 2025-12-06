import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  password: string;
}

export class UserModel {
  // In a real application, this would be a database
  private static users: User[] = [];

  // Create a new user
  static async createUser(username: string, password: string): Promise<User> {
    // Check if user already exists
    if (this.users.find(u => u.username === username)) {
      throw new Error('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      id: String(this.users.length + 1),
      username,
      password: hashedPassword
    };

    this.users.push(newUser);
    return newUser;
  }

  // Authenticate user
  static async authenticateUser(username: string, password: string): Promise<User | null> {
    const user = this.users.find(u => u.username === username);
    
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    return isPasswordValid ? user : null;
  }

  // Find user by ID
  static findUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }
}
