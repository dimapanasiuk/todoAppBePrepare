import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '../api/authApi';
import { User, LoginDto, RegisterDto } from '../types/User';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      login: async (dto: LoginDto) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.login(dto);
          
          set({
            user: response.user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: unknown) {
          const errorMessage = (error as any).response?.data?.error || 'Ошибка входа';
          set({
            error: errorMessage,
            loading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      register: async (dto: RegisterDto) => {
        set({ loading: true, error: null });
        try {
          const response = await authApi.register(dto);
          
          set({
            user: response.user,
            isAuthenticated: true,
            loading: false,
          });
        } catch (error: unknown) {
          const errorMessage = (error as any).response?.data?.error || 'Ошибка регистрации';
          set({
            error: errorMessage,
            loading: false,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          await authApi.logout();
        } catch (error) {
          console.error('Logout error:', error);
        } finally {
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },

      checkAuth: async () => {
        try {
          const user = await authApi.me();
          set({ user, isAuthenticated: true });
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

