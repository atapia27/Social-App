  // edtech-social-app\redux\slices\authSlice.ts
  import { createSlice, PayloadAction } from "@reduxjs/toolkit"
  import { AppThunk, RootState } from "../store"
  import { CreateUser } from "../../schemas/schemas"

  interface AuthState {
    user_id: string | null; // Add this line
    token: string | null;
    first_name: string | null;
    last_name: string | null;
    username: string | null;
    icon: string | null;
    loading: boolean;
    error: string | null;
  }

  // Utility function to get the initial state from localStorage if available
  const getInitialState = (): AuthState => {
    if (typeof window !== "undefined") {
      return {
        user_id: localStorage.getItem("user_id"), // Retrieve user_id
        token: localStorage.getItem("token"),
        first_name: localStorage.getItem("first_name"),
        last_name: localStorage.getItem("last_name"),
        username: localStorage.getItem("username"),
        icon: localStorage.getItem("icon"),
        loading: false,
        error: null,
      }
    } else {
      return {
        user_id: null, // Default to null
        token: null,
        first_name: null,
        last_name: null,
        username: null,
        icon: null,
        loading: false,
        error: null,
      }
    }
  }

  const initialState: AuthState = getInitialState()

  const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
      authStart(state) {
        state.loading = true
        state.error = null
      },
      authSuccess(
        state,
        action: PayloadAction<{ user_id: string; token: string; first_name: string; last_name: string; username: string; icon: string; }>,
      ) {
        state.user_id = action.payload.user_id; // Add this line
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.icon = action.payload.icon;
        state.loading = false;
        if (typeof window !== "undefined") {
          localStorage.setItem("user_id", action.payload.user_id); // Save user_id
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("first_name", action.payload.first_name);
          localStorage.setItem("last_name", action.payload.last_name);
          localStorage.setItem("username", action.payload.username);
          localStorage.setItem("icon", action.payload.icon);
        }
      },
      authFailure(state, action: PayloadAction<string>) {
        state.loading = false
        state.error = action.payload
      },
      logout(state) {
        state.user_id = null; // Add this line
        state.token = null;
        state.username = null;
        state.icon = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("user_id"); // Remove user_id
          localStorage.removeItem("token");
          localStorage.removeItem("first_name");
          localStorage.removeItem("last_name");
          localStorage.removeItem("username");
          localStorage.removeItem("icon");
        }
      }
    },
  })

  export const { authStart, authSuccess, authFailure, logout } = authSlice.actions
  export default authSlice.reducer
  export const selectAuthToken = (state: RootState) => state.auth.token
  export const selectAuthUsername = (state: RootState) => state.auth.username
  export const selectAuthIcon = (state: RootState) => state.auth.icon
  export const selectAuthLoading = (state: RootState) => state.auth.loading
  export const selectAuthError = (state: RootState) => state.auth.error

  // not yet defined
  export const checkAuthToken = (): AppThunk => async (dispatch) => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        const response = await fetch("http://localhost:8000/token", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          dispatch(
            authSuccess({ 
              user_id: data.id, // Assuming your backend response includes user_id
              token: data.access_token,
              first_name: data.first_name,
              last_name: data.last_name,
              username: data.username,
              icon: data.icon,
             }),
          )
        } else {
          dispatch(logout())
        }
      } catch (error) {
        dispatch(logout())
      }
    } else {
      dispatch(logout())
    }
  }

  // Thunks for handling async logic (e.g., login, register, logout)
  export const registerUser =
    (email: string, first_name: string, last_name:string, username: string, icon: string): AppThunk =>
    async (dispatch) => {
      dispatch(authStart())
      try {
        const response = await fetch("http://localhost:8000/auth/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, first_name, last_name, username, icon }),
        })

        if (response.ok) {
          const data = await response.json()
          dispatch(
            authSuccess({
              user_id: data.id, // Assuming your backend response includes user_id
              token: data.access_token,
              first_name: data.first_name,
              last_name: data.last_name,
              username: data.username,
              icon: data.icon,
            }),
          )
        } else {
          const errorData = await response.json()
          dispatch(authFailure(errorData.detail || "Registration failed"))
        }
      } catch (err: any) {
        dispatch(authFailure(err.toString()))
      }
    }

  export const loginUser =
    (email: string): AppThunk =>
    async (dispatch) => {
      dispatch(authStart())
      try {
        const response = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        })

        if (response.ok) {
          const data = await response.json()
          dispatch(
            authSuccess({
              user_id: data.id, // Assuming your backend response includes user_id
              token: data.access_token,
              first_name: data.first_name,
              last_name: data.last_name,
              username: data.username,
              icon: data.icon,
            }),
          )
        } else {
          const errorData = await response.json()
          if (errorData.detail === "User already logged in") {
            // Handle the case where another user is already logged in
            dispatch(authFailure("User already logged in"))
          } else {
            dispatch(authFailure(errorData.detail || "Login failed"))
          }
        }
      } catch (err: any) {
        dispatch(authFailure(err.toString()))
      }
    }

  /*Updated the logoutUser function to include the token in the request header and call the /logout endpoint. It also dispatches the logout action to reset the authentication state. */
  export const logoutUser = (): AppThunk => async (dispatch) => {
    const token = localStorage.getItem("token")
    if (token) {
      try {
        await fetch("http://localhost:8000/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token in the request header
          },
          body: JSON.stringify({ token }),
        })
        dispatch(logout())
      } catch (err: any) {
        console.error("Logout failed", err)
      }
    }
  }

// // Helper function to decode JWT token and check expiry
// function isTokenExpired(token: string): boolean {
//   const payloadBase64 = token.split('.')[1];
//   const decodedJson = Buffer.from(payloadBase64, 'base64').toString();
//   const decoded = JSON.parse(decodedJson);
//   const exp = decoded.exp;
//   const now = Date.now() / 1000;
//   return exp < now;
// }

// // Thunk for refreshing the token
// export const refreshToken = (): AppThunk => async (dispatch, getState) => {
//   const token = selectAuthToken(getState());
//   if (token && isTokenExpired(token)) {
//     try {
//       const response = await fetch("http://localhost:8000/auth/refresh", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         dispatch(authSuccess({
//           token: data.access_token,
//           username: data.username,
//           icon: data.icon,
//         }));
//       } else {
//         dispatch(logout());
//       }
//     } catch (error) {
//       console.error("Token refresh failed", error);
//       dispatch(logout());
//     }
//   }
// };

// // Modify loginUser and other thunks to check for token expiry
// export const loginUser = (email: string): AppThunk => async (dispatch) => {
//   dispatch(authStart());
//   try {
//     // Your existing login logic here

//     // After successful login, check and refresh token if needed
//     dispatch(refreshToken());
//   } catch (err: any) {
//     dispatch(authFailure(err.toString()));
//   }
// };