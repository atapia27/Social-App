import { FC } from 'react';
import Link from 'next/link';
import { FiHome, FiUsers, FiBell, FiMessageCircle, FiSettings } from 'react-icons/fi';

const Navbar: FC = () => {
  return (
    <nav className="bg-[#FD9B63] text-white p-4 flex justify-between items-center h-14 sticky top-0 z-50 align-middle">
      <div className=''>
      <img src='/FULL_LOGO_COLOR.png' alt="Logo" className="h-8" />
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
      <div className="flex items-center space-x-4 text-sm ">
        <img src="/DogPFP.png" alt="Profile" className="w-8 h-8 rounded-full" />
        <span>Username</span>
        <FiSettings className="w-6 h-6" />
      </div>
    </nav>
  );
};

export default Navbar;
