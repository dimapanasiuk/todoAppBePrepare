import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get token from cookie
    const token = req.cookies?.token;

    console.log('🔐 Auth middleware - cookies:', req.cookies);
    console.log('🔐 Auth middleware - token:', token ? 'present' : 'missing');

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
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



