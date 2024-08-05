// edtech-social-app/pages/login.tsx

import React, { useState } from "react"
import { useRouter } from "next/router"
import useAuthStore from "../zustand/store/authStore"

const Login = () => {
  const [user_id, setUserId] = useState("")
  const { login } = useAuthStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login(user_id)
      router.push("/")
    } catch (error) {
      console.error("Login failed", error)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-lg space-y-4">
        <div>
          <label
            htmlFor="user_id"
            className="block text-sm font-medium text-gray-700"
          >
            User ID:
          </label>
          <input
            type="text"
            id="user_id"
            value={user_id}
            onChange={(e) => setUserId(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md border border-transparent bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Login
        </button>
      </form>
    </div>
  )
}

export default Login
