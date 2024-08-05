// // edtech-social-app\api\auth.ts

// export interface RegisterResponse {
//     user_id: string,
//     first_name: string,
//     last_name: string,
//     icon: string,
//     token: string, // to be used for future requests
//   }
  
//   export interface RegisterData {
//     user_id: string,
//     first_name: string,
//     last_name: string,
//     icon: string,
//   }



// export const registerUser =
//   (
//     user_id: string,
//     first_name: string,
//     last_name: string,
//     icon: string,
//   ): AppThunk =>
//   async (dispatch) => {
//     dispatch(authStart())
//     try {
//       const response = await fetch("http://localhost:8000/auth/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, first_name, last_name, username, icon }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         dispatch(
//           authSuccess({
//             user_id: data.id, // Assuming your backend response includes user_id
//             token: data.access_token,
//             first_name: data.first_name,
//             last_name: data.last_name,
//             username: data.username,
//             icon: data.icon,
//           }),
//         )
//       } else {
//         const errorData = await response.json()
//         dispatch(authFailure(errorData.detail || "Registration failed"))
//       }
//     } catch (err: any) {
//       dispatch(authFailure(err.toString()))
//     }
//   }




// export const loginUser =
//   (username: string): AppThunk =>
//   async (dispatch) => {
//     dispatch(authStart())
//     try {
//       const response = await fetch("http://localhost:8000/auth/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username }),
//       })

//       if (response.ok) {
//         const data = await response.json()
//         dispatch(
//           authSuccess({
//             user_id: data.id, // Assuming your backend response includes user_id
//             token: data.access_token,
//             first_name: data.first_name,
//             last_name: data.last_name,
//             username: data.username,
//             icon: data.icon,
//           }),
//         )
//       } else {
//         const errorData = await response.json()
//         if (errorData.detail === "User already logged in") {
//           // Handle the case where another user is already logged in
//           dispatch(authFailure("User already logged in"))
//         } else if (errorData.errors) {
//           // Handle validation errors
//           dispatch(authFailure(JSON.stringify(errorData.errors)))
//         } else {
//           dispatch(authFailure(errorData.detail || "Login failed"))
//         }
//       }
//     } catch (err: any) {
//       dispatch(authFailure(err.toString()))
//     }
//   }

// export const logoutUser = (): AppThunk => async (dispatch) => {
//   const token = localStorage.getItem("token")
//   if (token) {
//     try {
//       await fetch("http://localhost:8000/auth/logout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // Include the token in the request header
//         },
//         body: JSON.stringify({ token }),
//       })
//       dispatch(logout())
//     } catch (err: any) {
//       console.error("Logout failed", err)
//     }
//   }
// }
