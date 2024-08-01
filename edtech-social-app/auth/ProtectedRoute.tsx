// edtech-social-app\auth\ProtectedRoute.tsx
import React, { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/router"
import { selectAuthToken, checkAuthToken } from "../redux/auth/authSlice"
import { AppDispatch } from "../redux/store"

interface ProtectedRouteProps {
  children: React.ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>()
  const token = useSelector(selectAuthToken)
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (!token) {
      dispatch(checkAuthToken())
    }
  }, [dispatch, token])

  useEffect(() => {
    if (mounted && !token) {
      router.push("/register")
    }
  }, [mounted, token, router])

  if (!mounted || !token) {
    return null // or a loading spinner, etc.
  }

  return <>{children}</>
}

export default ProtectedRoute
