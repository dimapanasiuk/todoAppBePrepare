import { Request, Response } from 'express';
import { taskModel } from '../models/taskModel';
import { CreateTaskDto, UpdateTaskDto } from '../types/Task';

export const taskController = {
  // GET /api/tasks - Get all tasks
  getAllTasks(req: Request, res: Response): void {
    const tasks = taskModel.findAll();
    res.json(tasks);
  },

  // GET /api/tasks/:id - Get single task by ID
  getTaskById(req: Request, res: Response): void {
    const { id } = req.params;
    const task = taskModel.findById(id);

    if (!task) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(task);
  },

  // POST /api/tasks - Create new task
  createTask(req: Request, res: Response): void {
    const { title, description }: CreateTaskDto = req.body;

    if (!title || title.trim() === '') {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const newTask = taskModel.create({ title, description });
    res.status(201).json(newTask);
  },

  // PUT /api/tasks/:id - Update task
  updateTask(req: Request, res: Response): void {
    const { id } = req.params;
    const { title, description, completed }: UpdateTaskDto = req.body;

    if (title !== undefined && title.trim() === '') {
      res.status(400).json({ error: 'Title cannot be empty' });
      return;
    }

    const updatedTask = taskModel.update(id, { title, description, completed });

    if (!updatedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json(updatedTask);
  },

  // DELETE /api/tasks/:id - Delete task
  deleteTask(req: Request, res: Response): void {
    const { id } = req.params;
    const deletedTask = taskModel.delete(id);

    if (!deletedTask) {
      res.status(404).json({ error: 'Task not found' });
      return;
    }

    res.json({
      message: 'Task deleted successfully',
       task: deletedTask
    });
  },
};
