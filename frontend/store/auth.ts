import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface User {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: 'Admin' | 'User';
  status: 'Active' | 'Inactive';
  password?: string;
  address: {
    street: string;
    number: string;
    city: string;
    postalCode: string;
  };
  profilePicture: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null, 
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }), 
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);