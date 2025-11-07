import axios from 'axios';
import { LoginDto, RegisterDto, User } from '../types/User';

const API_BASE_URL = '/api/auth';

export interface AuthResponse {
  user: User;
}

export const authApi = {
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/register`, dto);
    return response.data;
  },

  async login(dto: LoginDto): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/login`, dto);
    return response.data;
  },

  async logout(): Promise<void> {
    await axios.post(`${API_BASE_URL}/logout`);
  },

  async me(): Promise<User> {
    const response = await axios.get<User>(`${API_BASE_URL}/me`);
    return response.data;
  },
};



