import { create } from 'zustand';
import api from '../api/client';
import type { User } from '../types';

interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
}

/**
 * Safely parses a JSON string and returns the parsed object or null if parsing fails.
 */
function safeParseJSON<T>(value: string | null): T | null {
  if (!value || value === 'undefined' || value === 'null') return null;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    return null;
  }
}

const storage = {
  get: (key: string) => (typeof window === 'undefined' ? null : window.localStorage.getItem(key)),
  set: (key: string, value: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(key, value);
  },
  remove: (key: string) => {
    if (typeof window === 'undefined') return;
    window.localStorage.removeItem(key);
  },
};

const getStoredUser = (): User | null => {
  const userData = storage.get('cvs_user');
  const parsed = safeParseJSON<User>(userData);
  if (!parsed) {
    storage.remove('cvs_user');
    return null;
  }
  return parsed;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getStoredUser(),
  token: storage.get('cvs_token'),
  loading: false,
  error: null,
  isAuthenticated: !!storage.get('cvs_token'),
  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      console.log('Attempting login with:', { email });
      
      // Make the login request to /auth/login (will be combined with baseURL)
      const response = await api.post<LoginResponse>('/auth/login', { email, password });
      
      // Check if response has the expected structure
      if (!response.data.success || !response.data.data?.token) {
        throw new Error(response.data.message || 'Login failed');
      }
      
      const { token, user } = response.data.data;
      
      storage.set('cvs_token', token);
      storage.set('cvs_user', JSON.stringify(user));
      
      set({ 
        user, 
        token, 
        isAuthenticated: true,
        loading: false, 
        error: null 
      });
    } catch (err: any) {
      let errorMessage = 'Unable to login';
      
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (err.response.status === 404) {
          errorMessage = 'Login endpoint not found. Please check your API configuration.';
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      } else if (err.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please check your connection.';
      }
      
      console.error('Login error:', err);
      set({
        loading: false,
        error: errorMessage,
      });
      throw new Error(errorMessage);
    }
  },
  logout: () => {
    storage.remove('cvs_token');
    storage.remove('cvs_user');
    set({ 
      user: null, 
      token: null, 
      isAuthenticated: false 
    });
  },
  hydrate: async () => {
    return new Promise<void>((resolve) => {
      set({ loading: true });
      const token = storage.get('cvs_token');
      const user = getStoredUser();
      
      if (token && user) {
        set({ 
          user,
          token,
          isAuthenticated: true,
          loading: false,
          error: null
        });
      } else {
        // Clear any invalid auth state
        storage.remove('cvs_token');
        storage.remove('cvs_user');
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false, 
          loading: false,
          error: null
        });
      }
      resolve();
    });
  },
}));
