import { Task, CreateTaskDto, UpdateTaskDto } from '../types/Task';
import { generateId } from '../utils/generateId';

// In-memory storage for tasks
let tasks: Task[] = [];

export const taskModel = {
  // Get all tasks
  findAll(): Task[] {
    return tasks;
  },

  // Find task by ID
  findById(id: string): Task | undefined {
    return tasks.find(task => task.id === id);
  },

  // Create new task
  create(dto: CreateTaskDto): Task {
    const newTask: Task = {
      id: generateId(),
      title: dto.title.trim(),
      description: dto.description?.trim(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tasks.push(newTask);
    return newTask;
  },

  // Update task
  update(id: string, dto: UpdateTaskDto): Task | null {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
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

  // Delete task
  delete(id: string): Task | null {
    const taskIndex = tasks.findIndex(task => task.id === id);
    
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
  }
};

