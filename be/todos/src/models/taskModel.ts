import { Task, CreateTaskDto, UpdateTaskDto } from '../types/Task';
import { generateId } from '../utils/generateId';

// In-memory storage for tasks
let tasks: Task[] = [];

export const taskModel = {
  // Get all tasks for a user
  findAllByUserId(userId: string): Task[] {
    return tasks.filter(task => task.userId === userId);
  },

  // Find task by ID and userId
  findByIdAndUserId(id: string, userId: string): Task | undefined {
    return tasks.find(task => task.id === id && task.userId === userId);
  },

  // Create new task
  create(dto: CreateTaskDto, userId: string): Task {
    const newTask: Task = {
      id: generateId(),
      userId,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    tasks.push(newTask);
    return newTask;
  },

  // Update task (only if belongs to user)
  update(id: string, userId: string, dto: UpdateTaskDto): Task | null {
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === userId);

    if (taskIndex === -1) {
      return null;
    }

    const task = tasks[taskIndex];

    if (dto.title !== undefined) {
      task.title = dto.title.trim();
    }

    if (dto.description !== undefined) {
      task.description = dto.description.trim();
    }

    if (dto.completed !== undefined) {
      task.completed = dto.completed;
    }

    task.updatedAt = new Date();
    tasks[taskIndex] = task;

    return task;
  },

  // Delete task (only if belongs to user)
  delete(id: string, userId: string): Task | null {
    const taskIndex = tasks.findIndex(task => task.id === id && task.userId === userId);

    if (taskIndex === -1) {
      return null;
    }

    const deletedTask = tasks[taskIndex];
    tasks.splice(taskIndex, 1);

    return deletedTask;
  },

  // Clear all tasks (useful for testing)
  clear(): void {
    tasks = [];
  },
};

