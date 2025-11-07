import { Task, CreateTaskDto, UpdateTaskDto } from '../types/Task';
import { TaskModel, ITask } from './Task.schema';

export const taskModel = {
  // Get all tasks for a user
  async findAllByUserId(userId: string): Promise<Task[]> {
    const tasks = await TaskModel.find({ userId })
      .sort({ createdAt: -1 }) // Сортировка по дате создания (новые первые)
      .lean();
    
    return tasks.map(task => this.toResponse(task));
  },

  // Find task by ID and userId
  async findByIdAndUserId(id: string, userId: string): Promise<Task | null> {
    const task = await TaskModel.findOne({ _id: id, userId }).lean();
    return task ? this.toResponse(task) : null;
  },

  // Create new task
  async create(dto: CreateTaskDto, userId: string): Promise<Task> {
    const newTask = new TaskModel({
      userId,
      title: dto.title.trim(),
      description: dto.description?.trim(),
      completed: false,
    });

    await newTask.save();
    return this.toResponse(newTask.toObject());
  },

  // Update task (only if belongs to user)
  async update(id: string, userId: string, dto: UpdateTaskDto): Promise<Task | null> {
    const updateData: any = {};

    if (dto.title !== undefined) {
      updateData.title = dto.title.trim();
    }

    if (dto.description !== undefined) {
      updateData.description = dto.description.trim();
    }

    if (dto.completed !== undefined) {
      updateData.completed = dto.completed;
    }

    const task = await TaskModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: updateData },
      { new: true } // Вернуть обновленный документ
    ).lean();

    return task ? this.toResponse(task) : null;
  },

  // Delete task (only if belongs to user)
  async delete(id: string, userId: string): Promise<Task | null> {
    const task = await TaskModel.findOneAndDelete({ _id: id, userId }).lean();
    return task ? this.toResponse(task) : null;
  },

  // Convert MongoDB document to Task response
  toResponse(task: any): Task {
    return {
      id: task._id.toString(),
      userId: task.userId,
      title: task.title,
      description: task.description,
      completed: task.completed,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    };
  },

  // Clear all tasks (useful for testing)
  async clear(): Promise<void> {
    await TaskModel.deleteMany({});
  },
};

