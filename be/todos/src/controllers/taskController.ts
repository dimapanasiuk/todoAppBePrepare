import { Request, Response } from 'express';
import { taskModel } from '../models/taskModel';
import { CreateTaskDto, UpdateTaskDto } from '../types/Task';
import { AuthRequest } from '../middlewares/auth';
import { getCachedTodos, cacheTodos } from '../utils/redis';

export const taskController = {
  // GET /api/tasks - Get all tasks for current user
  async getAllTasks(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Проверяем кеш
    const cachedTasks = await getCachedTodos(userId);
    if (cachedTasks) {
      console.log('📦 Returning cached todos for user:', userId);
      res.json(cachedTasks);
      return;
    }

    // Если нет в кеше, получаем из БД
    const tasks = taskModel.findAllByUserId(userId);
    
    // Сохраняем в кеш
    await cacheTodos(userId, tasks);
    
    res.json(tasks);
  },

  // GET /api/tasks/:id - Get single task by ID (only if belongs to user)
  getTaskById(req: Request, res: Response): void {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const task = taskModel.findByIdAndUserId(id, userId);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  },

  // POST /api/tasks - Create new task for current user
  async createTask(req: Request, res: Response): Promise<void> {
    const userId = (req as AuthRequest).user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, description }: CreateTaskDto = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const newTask = taskModel.create({ title, description }, userId);
    
    // Обновляем кеш свежими данными
    const allTasks = taskModel.findAllByUserId(userId);
    await cacheTodos(userId, allTasks);
    console.log('🔄 Cache updated after creating task');
    
    res.status(201).json(newTask);
  },

  // PUT /api/tasks/:id - Update task (only if belongs to user)
  async updateTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { title, description, completed }: UpdateTaskDto = req.body;

    if (title !== undefined && title.trim() === '') {
      res.status(400).json({ error: 'Title cannot be empty' });
      return;
    }

    const updatedTask = taskModel.update(id, userId, { title, description, completed });

    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Обновляем кеш свежими данными
    const allTasks = taskModel.findAllByUserId(userId);
    await cacheTodos(userId, allTasks);
    console.log('🔄 Cache updated after updating task');

    res.json(updatedTask);
  },

  // DELETE /api/tasks/:id - Delete task (only if belongs to user)
  async deleteTask(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const userId = (req as AuthRequest).user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const deletedTask = taskModel.delete(id, userId);

    if (!deletedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    // Обновляем кеш свежими данными
    const allTasks = taskModel.findAllByUserId(userId);
    await cacheTodos(userId, allTasks);
    console.log('🔄 Cache updated after deleting task');

    res.json({
      message: 'Task deleted successfully',
       task: deletedTask
    });
  },
};

