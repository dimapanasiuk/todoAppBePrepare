import axios from 'axios';
import { Task, CreateTaskDto, UpdateTaskDto } from '../types/Task';

const API_BASE_URL = '/api/tasks';

export const taskApi = {
  async getAllTasks(): Promise<Task[]> {
    const response = await axios.get<Task[]>(API_BASE_URL);
    return response.data;
  },

  async getTaskById(id: string): Promise<Task> {
    const response = await axios.get<Task>(`${API_BASE_URL}/${id}`);
    return response.data;
  },

  async createTask(dto: CreateTaskDto): Promise<Task> {
    const response = await axios.post<Task>(API_BASE_URL, dto);
    return response.data;
  },

  async updateTask(id: string, dto: UpdateTaskDto): Promise<Task> {
    const response = await axios.put<Task>(`${API_BASE_URL}/${id}`, dto);
    return response.data;
  },

  async deleteTask(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
  }
};

