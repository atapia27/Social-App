//edtech-social-app\components\Navbar.tsx
import { FC, useEffect, useState } from "react";
import Link from "next/link";
import {
  FiHome,
  FiUsers,
  FiBell,
  FiMessageCircle,
  FiSettings,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import {
  logoutUser,
  selectAuthToken,
  selectAuthUsername,
  selectAuthIcon,
} from "../redux/slices/authSlice";
import { AppDispatch } from "../redux/store";

const Navbar: FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectAuthToken);
  const username = useSelector(selectAuthUsername);
  const icon = useSelector(selectAuthIcon);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 flex h-14 items-center justify-between bg-[#FD9B63] p-4 align-middle text-white">
      <div className="">
        <img src="/FULL_LOGO_COLOR.png" alt="Logo" className="h-8" />
      </div>
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
      <div className="flex items-center space-x-4 text-sm">
        {token ? (
          <>
            <img
              src={icon ? `/icons/${icon}.png` : "/defaultIcon.png"}
              alt="Profile"
              className="h-8 w-8 rounded-full"
            />
            <span>{username}</span>
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
  );
};

export default Navbar;
