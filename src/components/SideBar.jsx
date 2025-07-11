import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaProjectDiagram,
  FaUserTie,
  FaBug,
  FaMoneyBill,
  FaMedal,
  FaBriefcase,
  FaHome,
  FaBuilding,
  FaTrophy,
  FaUsers,
} from 'react-icons/fa';

const adminNavItems = [
  { path: '/', label: 'Home', icon: <FaHome /> },
  { path: '/projects', label: 'Projects', icon: <FaProjectDiagram /> },
  { path: '/clients', label: 'Clients', icon: <FaUserTie /> },
  { path: '/resources', label: 'Resources', icon: <FaUsers /> },
  { path: '/issues', label: 'Issues', icon: <FaBug /> },
  { path: '/highlights', label: 'Highlights', icon: <FaMedal /> },
  { path: '/rate-cards', label: 'Rate Cards', icon: <FaMoneyBill /> },
  // { path: '/open-positions', label: 'Open Positions', icon: <FaBriefcase /> },
];

const userNavItems = [
  { path: '/user/home', label: 'Home', icon: <FaHome /> },
  { path: '/user/my-project', label: 'My Project', icon: <FaBriefcase /> },
  { path: '/user/my-highlights', label: 'My Highlights', icon: <FaMedal /> },
  { path: '/user/my-client', label: 'My Client', icon: <FaBuilding /> },
  { path: '/user/my-issues', label: 'My Issues', icon: <FaBug /> },
  { path: '/user/my-resouces', label: 'My Resources', icon: <FaUsers /> },
  
];

const Sidebar = ({ userRole = 'admin' }) => {
  const navItems = userRole === 'user' ? userNavItems : adminNavItems;

  return (
    <aside className="w-64 h-screen pt-16 bg-gradient-to-b from-[#1e293b] via-[#2c2d55] to-[#1e293b] text-white fixed left-0 top-0 shadow-xl z-50">

      {/* Navigation Links */}
      <nav className="mt-10 flex flex-col gap-3 px-4">
        {navItems.map((item) => (
          <NavLink
            to={item.path}
            key={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 text-sm rounded-lg font-medium transition duration-200 
              ${
                isActive
                  ? 'bg-white/10 backdrop-blur-md border-l-4 border-indigo-400 text-indigo-300 shadow-inner'
                  : 'text-gray-300 hover:bg-white/5 hover:scale-[1.01] hover:shadow-sm'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
