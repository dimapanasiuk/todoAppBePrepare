import { Router } from 'express';
import { taskController } from '../controllers/taskController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/tasks - Get all tasks
router.get('/', taskController.getAllTasks);

// GET /api/tasks/:id - Get single task by ID
router.get('/:id', taskController.getTaskById);

// POST /api/tasks - Create new task
router.post('/', taskController.createTask);

// PUT /api/tasks/:id - Update task
router.put('/:id', taskController.updateTask);

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', taskController.deleteTask);

export default router;

