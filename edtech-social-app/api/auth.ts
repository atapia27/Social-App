// edtech-social-app/api/auth.ts

export interface AuthResponse {
  user_id: string
  first_name: string
  last_name: string
  icon: string
  loggedIn: boolean // Add loggedIn property
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL_AUTH;

export const registerUserAPI = async (
  first_name: string,
  last_name: string,
  icon: string,
): Promise<AuthResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/auth/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ first_name, last_name, icon }),
    },
  )

  if (response.ok) {
    return await response.json()
  } else {
    const errorData = await response.json()
    throw new Error(errorData.detail || "Registration failed")
  }
}

export const loginUserAPI = async (user_id: string): Promise<AuthResponse> => {
  const response = await fetch(
    `${API_BASE_URL}/auth/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id }),
    },
  )

  if (response.ok) {
    return await response.json()
  } else {
    const errorData = await response.json()
    if (errorData.detail === "User already logged in") {
      throw new Error("User already logged in")
    } else if (errorData.errors) {
      throw new Error(JSON.stringify(errorData.errors))
    } else {
      throw new Error(errorData.detail || "Login failed")
    }
  }
}

export const logoutUserAPI = async (user_id: string): Promise<void> => {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_id }),
  })
}
