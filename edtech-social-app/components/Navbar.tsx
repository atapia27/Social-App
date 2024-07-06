//edtech-social-app\components\Navbar.tsx
import { FC } from "react";
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

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <nav className="bg-[#FD9B63] text-white p-4 flex justify-between items-center h-14 sticky top-0 z-50 align-middle">
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
              src={icon ? `/Icons/${icon}.png` : "/defaultIcon.png"}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <span>{username}</span>
            <FiSettings className="w-6 h-6" />
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
