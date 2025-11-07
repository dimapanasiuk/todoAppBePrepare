import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// POST /api/auth/register - Register new user
router.post('/register', authController.register);

// POST /api/auth/login - Login user
router.post('/login', authController.login);

// GET /api/auth/me - Get current user (protected route)
router.get('/me', authMiddleware, authController.me);

// POST /api/auth/logout - Logout user
router.post('/logout', authController.logout);

export default router;



