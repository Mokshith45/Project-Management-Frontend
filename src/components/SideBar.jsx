import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaProjectDiagram,
  FaUserTie,
  FaBug,
  FaMoneyBill,
  FaMedal,
  FaBriefcase,
} from 'react-icons/fa';

const navItems = [
  { path: '/clients', label: 'Clients', icon: <FaUserTie /> },
  { path: '/projects', label: 'Projects', icon: <FaProjectDiagram /> },
  { path: '/issues', label: 'Issues', icon: <FaBug /> },
  { path: '/rate-cards', label: 'Rate Cards', icon: <FaMoneyBill /> },
  { path: '/highlights', label: 'Highlights', icon: <FaMedal /> },
  { path: '/open-positions', label: 'Open Positions', icon: <FaBriefcase /> },
];

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gradient-to-b from-[#1e293b] via-[#2c2d55] to-[#1e293b] text-white fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 text-2xl font-bold tracking-wide text-center bg-gradient-to-r from-indigo-700 to-purple-600 shadow-md rounded-br-3xl">
        Bounteous X <span className="text-indigo-300">Accolite</span>
      </div>

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
