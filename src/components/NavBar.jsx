import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
  return (
    <header className="h-16 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-md backdrop-blur-md bg-opacity-90 rounded-b-lg z-50 flex items-centern justify-center px-6 fixed top-0 left-0 ml-64">
      {/* Logo or App Name */}
      <h1 className="text-xl md:text-2xl font-bold tracking-wide drop-shadow-sm">
        
      </h1>

      {/* User Info */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-white/90 drop-shadow-sm">
          PM - Mokshith
        </span>
        <FaUserCircle className="text-white text-2xl drop-shadow-sm" />
      </div>
    </header>
  );
};

export default Navbar;
