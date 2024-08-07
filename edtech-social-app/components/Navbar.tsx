// edtech-social-app/components/Navbar.tsx

import { FC, useEffect, useState } from "react"
import Link from "next/link"
import {
  FiHome,
  FiUsers,
  FiBell,
  FiMessageCircle,
  FiSettings,
} from "react-icons/fi"
import Image from "next/image"
import useAuthStore from "../zustand/store/authStore"

const Navbar: FC = () => {
  const { user_id, icon, loggedIn, logout } = useAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logout()
  }

  if (!mounted) return null

  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between gap-3 bg-[#FD9B63] p-4 align-middle text-white">
      <Link href="/">
        <Image
          src="/FULL_LOGO_COLOR.png"
          alt="Logo"
          width={100}
          height={100}
          className="ml-10 h-auto w-auto"
        />
      </Link>
      <div className="flex space-x-20 text-xl">
        <Link href="/" className="flex items-center space-x-1">
          <FiHome />
        </Link>
        <Link href="/friends" className="flex items-center space-x-1">
          <FiUsers />
        </Link>
        <Link href="/notifications" className="flex items-center space-x-1">
          <FiBell />
        </Link>
        <Link href="/chat" className="flex items-center space-x-1">
          <FiMessageCircle />
        </Link>
      </div>
      <div className="mr-10 flex items-center space-x-4 text-sm">
        {loggedIn ? (
          <>
            <Image
              src={icon ? `/icons/${icon}.png` : "/defaultIcon.png"}
              alt="Profile"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
            <span>{user_id}</span>
            <FiSettings className="h-6 w-6" />
            <button onClick={handleLogout} className="text-sm text-white">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm text-white">
              Login
            </Link>
            <Link href="/register" className="text-sm text-white">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
