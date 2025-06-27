import React from 'react';
import SideBar from './SideBar';
import Navbar from './NavBar';

const Layout = ({ children }) => {
  return (
    <div className="flex">
      <SideBar/>
      <div className="ml-64 w-full">
        <Navbar />
        <main className="p-6 bg-gray-100 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
