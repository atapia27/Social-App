import { FC } from 'react';
import Link from 'next/link';
import { FiHome, FiUsers, FiBell, FiMessageCircle, FiSettings } from 'react-icons/fi';

const Navbar: FC = () => {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex space-x-6">
        <Link href="/" className="flex items-center space-x-1">
          <FiHome />
          <span>Home</span>
        </Link>
        <Link href="/friends" className="flex items-center space-x-1">
          <FiUsers />
          <span>Friends</span>
        </Link>
        <Link href="/notifications" className="flex items-center space-x-1">
          <FiBell />
          <span>Notifications</span>
        </Link>
        <Link href="/chat" className="flex items-center space-x-1">
          <FiMessageCircle />
          <span>Chat</span>
        </Link>
      </div>
      <div className="flex items-center space-x-4">
        <img src="/profile.jpg" alt="Profile" className="w-8 h-8 rounded-full" />
        <span>Username</span>
        <FiSettings className="w-6 h-6" />
      </div>
    </nav>
  );
};

export default Navbar;
