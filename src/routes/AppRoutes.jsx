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
import Home from '../pages/Home';
import Profile from '../pages/Profile';

import AddProject from '../pages/AddProject';
import AddClient from '../pages/AddClient';
import AddPosition from '../pages/AddPosition';

import Resources from '../pages/Resources';
import SignIn from '../pages/auth/SignIn';
import AddAdmin from '../pages/AddAdmin';


const AppRoutes = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-8 w-full">
        <Navbar />
        <main className="p-6 pt-20 bg-gray-100 min-h-[calc(100vh-4rem)]">
          
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path='/projects' element={<Projects/>} />
            <Route path="/clients" element={<Clients />} />
            <Route path='/resources' element={<Resources/>} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/highlights" element={<Highlights />} />
            <Route path="/rate-cards" element={<RateCards />} />

            <Route path='/projects/add' element={<AddProject/>}/>
            <Route path='/clients/add' element={<AddClient/>}/>
            <Route path='/open-positions/add' element={<AddPosition/>}/>

            <Route path='/profile' element={<Profile/>} />

            <Route path='/admin/add' element={<AddAdmin/>} />

          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppRoutes;
