import bcrypt from 'bcrypt';
import { User, RegisterDto, UserResponse } from '../types/User';
import { generateId } from '../utils/generateId';
import { config } from '../config';

// In-memory storage for users
let users: User[] = [];

export const userModel = {
  // Get all users (for admin purposes)
  findAll(): UserResponse[] {
    return users.map(user => this.toResponse(user));
  },

  // Find user by ID
  findById(id: string): User | undefined {
    return users.find(user => user.id === id);
  },

  // Find user by email
  findByEmail(email: string): User | undefined {
    return users.find(user => user.email === email.toLowerCase());
  },

  // Create new user
  async create(dto: RegisterDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, config.bcryptSaltRounds);

    const newUser: User = {
      id: generateId(),
      email: dto.email.toLowerCase(),
      password: hashedPassword,
      username: dto.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    users.push(newUser);
    return newUser;
  },

  // Verify password
  async verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  },

  // Convert User to UserResponse (exclude password)
  toResponse(user: User): UserResponse {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  // Clear all users (useful for testing)
  clear(): void {
    users = [];
  },
};



