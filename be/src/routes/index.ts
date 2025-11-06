import { Router } from 'express';
import taskRoutes from './taskRoutes';

const router = Router();

// Mount task routes
router.use(
  '/tasks',

  taskRoutes
);

export default router;
