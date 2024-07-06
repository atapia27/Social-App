// edtech-social-app\redux\slices\authSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../store";

interface AuthState {
  token: string | null;
  username: string | null;
  icon: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"), // Ensure the token is fetched from localStorage
  username: localStorage.getItem("username"),
  icon: localStorage.getItem("icon"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(
      state,
      action: PayloadAction<{ token: string; username: string; icon: string }>
    ) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      state.icon = action.payload.icon;
      state.loading = false;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("username", action.payload.username);
      localStorage.setItem("icon", action.payload.icon);
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.token = null;
      state.username = null;
      state.icon = null;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("icon");
    },
  },
});

export const { authStart, authSuccess, authFailure, logout } =
  authSlice.actions;
export default authSlice.reducer;
export const selectAuthToken = (state: RootState) => state.auth.token;
export const selectAuthUsername = (state: RootState) => state.auth.username;
export const selectAuthIcon = (state: RootState) => state.auth.icon;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAuthError = (state: RootState) => state.auth.error;

// Thunks for handling async logic (e.g., login, register, logout)
export const registerUser =
  (email: string, username: string, icon: string): AppThunk =>
  async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await fetch("http://localhost:8000/users/", {
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

/**
 * This function loginUser is an asynchronous action creator that is used to log in a user.
 * It takes an email as a parameter and returns an AppThunk, which is a function that can be dispatched by Redux.
 * Inside the function, it dispatches the authStart action to set the loading state to true and clear any previous error.
 * Then, it makes a GET request to the server to fetch the user data based on the provided email.
 * If the response is successful (status code 200), it extracts the data from the response and dispatches the authSuccess action
 * to update the token, username, and icon in the state. It also stores the token, username, and icon in the local storage.
 * If the response is not successful, it extracts the error data from the response and dispatches the authFailure action
 * to update the error state with the error message.
 * If any error occurs during the process, it catches the error and dispatches the authFailure action with the error message.
 *
 * This function is used in the project to handle the login functionality. When a user enters their email and clicks the login button,
 * this function is called to authenticate the user and retrieve their data from the server. The retrieved data is then stored in the state
 * and local storage for further use in the application.
 */
export const loginUser =
  (email: string): AppThunk =>
  async (dispatch) => {
    dispatch(authStart());
    try {
      const response = await fetch(
        `http://localhost:8000/users/by-email/${email}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
        dispatch(authFailure(errorData.detail || "Login failed"));
      }
    } catch (err: any) {
      dispatch(authFailure(err.toString()));
    }
  };

export const logoutUser = (): AppThunk => async (dispatch) => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      await fetch("http://localhost:8000/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
      dispatch(logout());
    } catch (err: any) {
      console.error("Logout failed", err);
    }
  }
};
