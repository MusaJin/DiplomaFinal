import { create } from 'zustand';
import { User } from '../types';
import { login as loginService, logout as logoutService, getMe, getStoredToken } from '../services/auth.service';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,

  login: async (email: string, password: string) => {
    const data = await loginService(email, password);
    set({ user: data.user, token: data.token, isAuthenticated: true });
  },

  logout: async () => {
    await logoutService();
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const token = await getStoredToken();
      if (!token) {
        set({ isLoading: false });
        return;
      }

      const user = await getMe();
      set({ user, token, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
