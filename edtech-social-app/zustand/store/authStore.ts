// edtech-social-app/zustand/store/authStore.ts

import { create } from "zustand"
import { persist } from "zustand/middleware"
import {
  registerUserAPI,
  loginUserAPI,
  logoutUserAPI,
  AuthResponse,
} from "../../api/auth"

interface AuthState {
  user_id: string | null
  icon: string | null
  first_name: string | null
  last_name: string | null
  loggedIn: boolean
  loading: boolean
  error: string | null
  login: (user_id: string) => void
  register: (first_name: string, last_name: string, icon: string) => void
  logout: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user_id: null,
      icon: null,
      first_name: null,
      last_name: null,
      loggedIn: false,
      loading: false,
      error: null,
      login: async (user_id: string) => {
        set({ loading: true, error: null })
        try {
          const data: AuthResponse = await loginUserAPI(user_id)
          set({
            user_id: data.user_id,
            icon: data.icon,
            first_name: data.first_name,
            last_name: data.last_name,
            loggedIn: data.loggedIn,
            loading: false,
            error: null,
          })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },
      register: async (first_name: string, last_name: string, icon: string) => {
        set({ loading: true, error: null })
        try {
          const data: AuthResponse = await registerUserAPI(
            first_name,
            last_name,
            icon,
          )
          set({
            user_id: data.user_id,
            icon: data.icon,
            first_name: data.first_name,
            last_name: data.last_name,
            loggedIn: data.loggedIn,
            loading: false,
            error: null,
          })
        } catch (error: any) {
          set({ error: error.message, loading: false })
        }
      },
      logout: async () => {
        const user_id = get().user_id
        if (user_id) {
          try {
            await logoutUserAPI(user_id)
            set({
              user_id: null,
              icon: null,
              first_name: null,
              last_name: null,
              loggedIn: false,
              loading: false,
              error: null,
            })
          } catch (error: any) {
            console.error("Logout failed", error)
          }
        }
      },
      setError: (error) => set({ error }),
      setLoading: (loading) => set({ loading }),
    }),
    {
      name: "auth-storage",
    },
  ),
)

export default useAuthStore
