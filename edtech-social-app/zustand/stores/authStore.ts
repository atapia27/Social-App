// edtech-social-app/store/authStore.ts

import {create} from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  user_id: string | null;
  token: string | null;
  first_name: string | null;
  last_name: string | null;
  loading: boolean;
  error: string | null;
  login: (data: { user_id: string; token: string; first_name: string; last_name: string }) => void;
  logout: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
}

// persist the state across page reloads or browser sessions
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user_id: null,
      token: null,
      first_name: null,
      last_name: null,
      loading: false,
      error: null,
      login: ({ user_id, token, first_name, last_name }) =>
        set(() => ({
          user_id,
          token,
          first_name,
          last_name,
          loading: false,
          error: null,
        })),
      logout: () =>
        set(() => ({
          user_id: null,
          token: null,
          first_name: null,
          last_name: null,
          loading: false,
          error: null,
        })),
      setError: (error) => set(() => ({ error })),
      setLoading: (loading) => set(() => ({ loading })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;