import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Navbar from '../components/NavBar'
import Sidebar from '../components/SideBar'

import Clients from '../pages/Clients';
import Projects from '../pages/Projects';
import Issues from '../pages/Issues';
import RateCards from '../pages/RateCards';
import Highlights from '../pages/Highlights';
import OpenPositions from '../pages/OpenPositions';
import CostPlanning from '../pages/CostPlanning';

const AppRoutes = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-8 w-full">
        <Navbar />
        <main className="p-6 pt-20 bg-gray-100 min-h-[calc(100vh-4rem)]">
          <Routes>
            <Route path="/" element={<Navigate to="/" />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/rate-cards" element={<RateCards />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/open-positions" element={<OpenPositions />} />
            <Route path="/cost-planning" element={<CostPlanning />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppRoutes;
