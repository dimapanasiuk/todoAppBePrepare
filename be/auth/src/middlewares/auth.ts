import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { isTokenBlacklisted } from '../utils/redis';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    console.log('🔐 Auth middleware - cookies:', req.cookies);
    console.log('🔐 Auth middleware - token:', token ? 'present' : 'missing');

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Проверка blacklist
    const isBlacklisted = await isTokenBlacklisted(token);
    if (isBlacklisted) {
      res.status(401).json({ error: 'Token has been revoked' });
      return;
    }

    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Attach user info to request
    (req as AuthRequest).user = {
      userId: payload.userId,
      email: payload.email,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



