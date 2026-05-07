import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { api } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.login(email, password);
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Login failed';
          set({ error: msg, isLoading: false });
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await api.signup(name, email, password);
          localStorage.setItem('token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Signup failed';
          set({ error: msg, isLoading: false });
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        set({ user: null, token: null });
      },

      loadUser: async () => {
        const token = get().token || localStorage.getItem('token');
        if (!token) return;
        set({ isLoading: true });
        try {
          const data = await api.getMe();
          set({ user: data.user, token, isLoading: false });
        } catch {
          localStorage.removeItem('token');
          set({ user: null, token: null, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
      updateUser: (data) => set((s) => ({ user: s.user ? { ...s.user, ...data } : null })),
    }),
    { name: 'auth-storage', partialize: (state) => ({ token: state.token }) }
  )
);
