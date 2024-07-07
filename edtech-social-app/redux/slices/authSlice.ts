// edtech-social-app\redux\slices\authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../store';

interface AuthState {
  token: string | null;
  username: string | null;
  icon: string | null;
  loading: boolean;
  error: string | null;
}

// Utility function to get the initial state from localStorage if available
const getInitialState = (): AuthState => {
  if (typeof window !== 'undefined') {  // Check if window is defined
    return {
      token: localStorage.getItem('token'),
      username: localStorage.getItem('username'),
      icon: localStorage.getItem('icon'),
      loading: false,
      error: null,
    };
  } else {
    return {
      token: null,
      username: null,
      icon: null,
      loading: false,
      error: null,
    };
  }
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(state, action: PayloadAction<{ token: string, username: string, icon: string }>) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.icon = action.payload.icon;
      state.loading = false;
      if (typeof window !== 'undefined') {  // Check if window is defined
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('username', action.payload.username);
        localStorage.setItem('icon', action.payload.icon);
      }
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.username = null;
      state.icon = null;
      if (typeof window !== 'undefined') {  // Check if window is defined
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('icon');
      }
    },
  },
});

export const { authStart, authSuccess, authFailure, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthUsername = (state: RootState) => state.auth.username;
export const selectAuthIcon = (state: RootState) => state.auth.icon;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

export const checkAuthToken = (): AppThunk => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const response = await fetch('http://localhost:8000/token', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(authSuccess({ token, username: data.username, icon: data.icon }));
      } else {
        dispatch(logout());
      }
    } catch (error) {
      dispatch(logout());
    }
  } else {
    dispatch(logout());
  }
};

// Thunks for handling async logic (e.g., login, register, logout)
export const registerUser =
  (email: string, username: string, icon: string): AppThunk =>
  async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await fetch("http://localhost:8000/auth/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, icon }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(
          authSuccess({
            token: data.access_token,
            username: data.username,
            icon: data.icon,
          })
        );
      } else {
        const errorData = await response.json();
        dispatch(authFailure(errorData.detail || "Registration failed"));
      }
    } catch (err: any) {
      dispatch(authFailure(err.toString()));
    }
  };

export const loginUser =
  (email: string): AppThunk =>
  async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(
          authSuccess({
            token: data.access_token,
            username: data.username,
            icon: data.icon,
          })
        );
      } else {
        const errorData = await response.json();
        if (errorData.detail === "User already logged in") {
          // Handle the case where another user is already logged in
          dispatch(authFailure("User already logged in"));
        } else {
          dispatch(authFailure(errorData.detail || "Login failed"));
        }
      }
    } catch (err: any) {
      dispatch(authFailure(err.toString()));
    }
  };

/*Updated the logoutUser function to include the token in the request header and call the /logout endpoint. It also dispatches the logout action to reset the authentication state. */
export const logoutUser = (): AppThunk => async (dispatch) => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await fetch('http://localhost:8000/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Include the token in the request header
        },
        body: JSON.stringify({ token }),
      });
      dispatch(logout());
    } catch (err: any) {
      console.error('Logout failed', err);
    }
  }
};
