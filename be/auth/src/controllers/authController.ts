import { Request, Response } from 'express';
import { userModel } from '../models/userModel';
import { RegisterDto, LoginDto } from '../types/User';
import { generateToken } from '../utils/jwt';
import { config } from '../config';
import { blacklistToken } from '../utils/redis';

export const authController = {
  // POST /api/auth/register - Register new user
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, username }: RegisterDto = req.body;

      // Validation
      if (!email || !password || !username) {
        res.status(400).json({ error: 'Email, password, and username are required' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters long' });
        return;
      }

      // Check if user already exists
      const existingUser = await userModel.findByEmail(email);
      if (existingUser) {
        res.status(409).json({ error: 'User with this email already exists' });
        return;
      }

      // Create user
      const user = await userModel.create({ email, password, username });

      // Generate JWT token
      const token = generateToken({
        userId: (user._id as any).toString(),
        email: user.email,
      });

      // Set httpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: config.env === 'production', // HTTPS only in production
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Return response (without token in body)
      res.status(201).json({
        user: userModel.toResponse(user),
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/auth/login - Login user
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password }: LoginDto = req.body;

      // Validation
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
      }

      // Find user
      const user = await userModel.findByEmail(email);
      if (!user) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Verify password
      const isValidPassword = await userModel.verifyPassword(user, password);
      if (!isValidPassword) {
        res.status(401).json({ error: 'Invalid email or password' });
        return;
      }

      // Generate JWT token
      const token = generateToken({
        userId: (user._id as any).toString(),
        email: user.email,
      });

      // Set httpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: config.env === 'production', // HTTPS only in production
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      });

      // Return response (without token in body)
      res.json({
        user: userModel.toResponse(user),
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // GET /api/auth/me - Get current user info
  async me(req: Request, res: Response): Promise<void> {
    try {
      // This assumes we have authentication middleware that sets req.user
      const userId = (req as any).user?.userId;

      if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }

      const user = await userModel.findById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json(userModel.toResponse(user));
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },

  // POST /api/auth/logout - Logout user
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.cookies?.token;

      // Добавляем токен в blacklist если он есть
      if (token) {
        await blacklistToken(token, 86400); // 24 часа
      }

      // Clear the httpOnly cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: config.env === 'production',
        sameSite: 'lax',
      });

      res.json({ message: 'Logged out successfully' });
    } catch (error) {
      console.error('Logout error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
