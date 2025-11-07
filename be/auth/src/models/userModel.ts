import { RegisterDto, UserResponse } from '../types/User';
import { UserModel, IUser } from './User.schema';

export const userModel = {
  // Get all users (for admin purposes)
  async findAll(): Promise<UserResponse[]> {
    const users = await UserModel.find().select('-password').lean();
    return users.map(user => this.toResponse(user));
  },

  // Find user by ID
  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id);
  },

  // Find user by email
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email: email.toLowerCase() });
  },

  // Create new user
  async create(dto: RegisterDto): Promise<IUser> {
    const newUser = new UserModel({
      email: dto.email.toLowerCase(),
      password: dto.password, // Будет автоматически захеширован в pre-save hook
      username: dto.username,
    });

    await newUser.save();
    return newUser;
  },

  // Verify password
  async verifyPassword(user: IUser, plainPassword: string): Promise<boolean> {
    return user.comparePassword(plainPassword);
  },

  // Convert User to UserResponse (exclude password)
  toResponse(user: any): UserResponse {
    return {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  },

  // Clear all users (useful for testing)
  async clear(): Promise<void> {
    await UserModel.deleteMany({});
  },
};



