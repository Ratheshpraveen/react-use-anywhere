import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  username: string;
  password: string;
}

export class UserService {
  // In a real app, this would be a database
  private static users: User[] = [];

  // Hash password before storing
  private static hashPassword(password: string): string {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  }

  // Create a new user
  static createUser(username: string, password: string): User {
    const existingUser = this.users.find(u => u.username === username);
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const newUser: User = {
      id: String(this.users.length + 1),
      username,
      password: this.hashPassword(password)
    };

    this.users.push(newUser);
    return newUser;
  }

  // Authenticate user
  static authenticateUser(username: string, password: string): User | null {
    const user = this.users.find(u => u.username === username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }

  // Get user by ID
  static getUserById(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }
}
