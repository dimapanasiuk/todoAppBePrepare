import express, { Request, Response } from 'express';
import cors from 'cors';
import { Task, CreateTaskDto, UpdateTaskDto } from './types/Task';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for tasks
let tasks: Task[] = [];
let nextId = 1;

// Helper function to generate ID
const generateId = (): string => {
  return (nextId++).toString();
};

// GET /api/tasks - Get all tasks
app.get('/api/tasks', (req: Request, res: Response) => {
  res.json(tasks);
});

// GET /api/tasks/:id - Get single task by ID
app.get('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  res.json(task);
});

// POST /api/tasks - Create new task
app.post('/api/tasks', (req: Request, res: Response) => {
  const { title, description }: CreateTaskDto = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTask: Task = {
    id: generateId(),
    title: title.trim(),
    description: description?.trim(),
    completed: false,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /api/tasks/:id - Update task
app.put('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, completed }: UpdateTaskDto = req.body;
  
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const task = tasks[taskIndex];
  
  // Update only provided fields
  if (title !== undefined) {
    if (title.trim() === '') {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    task.title = title.trim();
  }
  
  if (description !== undefined) {
    task.description = description.trim();
  }
  
  if (completed !== undefined) {
    task.completed = completed;
  }
  
  task.updatedAt = new Date();
  tasks[taskIndex] = task;
  
  res.json(task);
});

// DELETE /api/tasks/:id - Delete task
app.delete('/api/tasks/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const taskIndex = tasks.findIndex(t => t.id === id);
  
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const deletedTask = tasks[taskIndex];
  tasks.splice(taskIndex, 1);
  
  res.json({ message: 'Task deleted successfully', task: deletedTask });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api/tasks`);
});

