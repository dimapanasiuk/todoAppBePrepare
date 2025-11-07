import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  userId: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    userId: {
      type: String,
      required: true,
      index: true, // Индекс для быстрого поиска по userId
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true, // Индекс для фильтрации по статусу
    },
  },
  {
    timestamps: true, // Автоматически добавляет createdAt и updatedAt
  }
);

// Составной индекс для быстрого поиска задач пользователя
taskSchema.index({ userId: 1, createdAt: -1 });

export const TaskModel = mongoose.model<ITask>('Task', taskSchema);
