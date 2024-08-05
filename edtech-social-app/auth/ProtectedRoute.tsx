// edtech-social-app/auth/ProtectedRoute.tsx

import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import useAuthStore from "../zustand/store/authStore"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user_id, loggedIn, login } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!loggedIn) {
      const storedUserId = localStorage.getItem("user_id")
      if (storedUserId) {
        login(storedUserId)
      }
    }
  }, [loggedIn, login])

  useEffect(() => {
    if (mounted && !loggedIn) {
      router.push("/register")
    }
  }, [mounted, loggedIn, router])

  if (!mounted || !loggedIn) {
    return null // or a loading spinner, etc.
  }

  return <>{children}</>
}

export default ProtectedRoute
