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

const initialState: AuthState = {
  token: null,
  username: null,
  icon: null,
  loading: false,
  error: null,
};

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
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.username = null;
      state.icon = null;
    },
  },
});


export const registerUser = (email: string, username: string, icon: string): AppThunk => async (dispatch) => {
  dispatch(authStart());
  try {
    const response = await fetch('http://localhost:8000/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, icon }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      dispatch(authSuccess({ token: data.access_token, username: data.username, icon: data.icon }));
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('username', data.username);
      localStorage.setItem('icon', data.icon);
    } else {
      const errorData = await response.json();
      dispatch(authFailure(errorData.detail || 'Registration failed'));
    }
  } catch (err: any) {
    dispatch(authFailure(err.toString()));
  }
};

export const loginUser = (email: string): AppThunk => async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await fetch(`http://localhost:8000/users/by-email/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        dispatch(authSuccess({ token: data.access_token, username: data.username, icon: data.icon }));
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('icon', data.icon);
      } else {
        const errorData = await response.json();
        dispatch(authFailure(errorData.detail || 'Login failed'));
      }
    } catch (err: any) {
      dispatch(authFailure(err.toString()));
    }
  };

export const logoutUser = (): AppThunk => async (dispatch) => {
const token = localStorage.getItem('token');
if (token) {
    try {
    await fetch('http://localhost:8000/logout', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
    });
    dispatch(logout());
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('icon');
    } catch (err: any) {
    console.error('Logout failed', err);
    }
}
};

export const { authStart, authSuccess, authFailure, logout } = authSlice.actions;
export default authSlice.reducer;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthUsername = (state: RootState) => state.auth.username;
export const selectAuthIcon = (state: RootState) => state.auth.icon;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;
