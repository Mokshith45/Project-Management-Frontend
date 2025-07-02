import React from 'react';
import SideBar from './SideBar';
import Navbar from './NavBar';

const Layout = ({ children }) => {
  const role = localStorage.getItem('role') || 'user'; // Default to 'user' if role is not set

  return (
    <div className="flex">
      <SideBar userRole={role} />
      <div className="w-full">
        <Navbar />
        <main className="pt-6 px-6 bg-gray-100 min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
