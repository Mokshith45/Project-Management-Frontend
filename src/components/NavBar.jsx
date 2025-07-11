import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from '../api/axios'
import { useNavigate, Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';
import { FiSearch, FiLogOut } from 'react-icons/fi';
import { BsPerson } from 'react-icons/bs';
import BxaLogo from '../assets/logobxa.png'; // Ensure the path is correct

const Navbar = () => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const role = localStorage.getItem('role') || 'user'; 
  const isAdmin = role === 'ADMIN';
  const [username, setUsername] = useState('User');
  useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      axios.get(`/api/users/${userId}`)
        .then((res) => setUsername(res.data.userName))
        .catch(() => setUsername('User'));
    } catch {
      setUsername('User');
    }
  }
}, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); 
    setDropdownOpen(false);
    navigate('/signin');
  };

  return (
    <header className="h-16 w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-md backdrop-blur-md bg-opacity-90 z-50 flex items-center px-4 md:px-6 justify-between fixed top-0 left-0 rounded-b-xl transition-all duration-300">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 pl-1 cursor-pointer hover:opacity-90 transition">
        <img src={BxaLogo } alt="Logo" className="h-40 md:h-40 w-52 md:w-72 object-contain ml-[-28px]" />
      </Link>

      {/* Search */}
      <div className="hidden sm:flex justify-center mx-4 md:mx-6 flex-1">
        <div className="relative w-full max-w-sm">
          <input
            type="text"
            placeholder="Search projects or clients..."
            className="w-full pl-4 pr-10 py-2 font-medium rounded-md bg-white/10 text-white placeholder:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:bg-white/20 transition-all duration-200 shadow-lg"
          />
          <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white text-lg pointer-events-none" />
        </div>
      </div>

      {/* User Profile + Dropdown */}
      <div className="relative">
        <div
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center gap-2 md:gap-3 cursor-pointer hover:opacity-90 whitespace-nowrap"
        >
          <FaUserCircle className="text-white text-2xl md:text-3xl drop-shadow-sm hover:text-indigo-200 transition duration-200" />
          <span className="hidden sm:inline text-sm font-bold text-white/90 drop-shadow-sm hover:text-white transition duration-200">
            {username}
          </span>
        </div>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-md shadow-lg z-50 overflow-hidden">
            <button
              onClick={() => {
                setDropdownOpen(false);
                navigate(isAdmin ? '/profile' : '/user/UserProfile');
              }}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-indigo-50"
            >
              <BsPerson className="mr-2" />
              Profile
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
