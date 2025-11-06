import { create } from 'zustand';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/Task';
import { taskApi } from '../api/taskApi';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  error: string | null;

  fetchTasks: () => Promise<void>;
  createTask: (dto: CreateTaskDto) => Promise<void>;
  updateTask: (id: string, dto: UpdateTaskDto) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  toggleTaskCompletion: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const tasks = await taskApi.getAllTasks();
      set({ tasks, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch tasks',
        loading: false,
      });
    }
  },

  createTask: async (dto: CreateTaskDto) => {
    set({ error: null });
    try {
      const newTask = await taskApi.createTask(dto);
      set(state => ({ tasks: [...state.tasks, newTask] }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to create task' });
      throw error;
    }
  },

  updateTask: async (id: string, dto: UpdateTaskDto) => {
    set({ error: null });
    try {
      const updatedTask = await taskApi.updateTask(id, dto);
      set(state => ({
        tasks: state.tasks.map(task => (task.id === id ? updatedTask : task)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to update task' });
      throw error;
    }
  },

  deleteTask: async (id: string) => {
    set({ error: null });
    try {
      await taskApi.deleteTask(id);
      set(state => ({
        tasks: state.tasks.filter(task => task.id !== id),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : 'Failed to delete task' });
      throw error;
    }
  },

  toggleTaskCompletion: async (id: string) => {
    const task = get().tasks.find(t => t.id === id);
    if (task) {
      await get().updateTask(id, { completed: !task.completed });
    }
  },
}));
