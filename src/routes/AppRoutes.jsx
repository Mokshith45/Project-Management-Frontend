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

import UserHome from '../pages/userPages/UserHome';
import MyHighlights from '../pages/userPages/MyHighlights';
import MyClient from '../pages/userPages/MyClient';
import MyIssues from '../pages/userPages/MyIssues';
import UserProfile from '../pages/userPages/UserProfile';
import MyProject from '../pages/userPages/MyProject';
import AddHighlight from '../pages/userPages/AddHighlight';
import Resource from '../pages/userPages/Resource';
import ProjectDetail from '../pages/ProjectDetail';
import ClientDetail from '../pages/ClientDetail';



const AppRoutes = () => {
  const role = localStorage.getItem('role');
  return (
    <div className="flex">
      <Sidebar userRole={role === 'ADMIN' ? 'admin' : 'user'} />
      <div className="ml-64 w-full">
        <Navbar />
        <main className="p-6 pt-20 bg-gray-100 min-h-[calc(100vh-4rem)]">
          <Routes>
            {role === 'ADMIN' && (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/add" element={<AddProject />} />
                <Route path="/projects/:id" element={<ProjectDetail/>} />


                <Route path="/clients" element={<Clients />} />
                <Route path="/clients/add" element={<AddClient />} />
                <Route path="/clients/:id" element={<ClientDetail/>}/>

                <Route path="/resources" element={<Resources />} />
                <Route path="/issues" element={<Issues />} />
                <Route path="/highlights" element={<Highlights />} />
                <Route path="/rate-cards" element={<RateCards />} />
    
                <Route path="/open-positions/add" element={<AddPosition />} />
                <Route path="/profile" element={<Profile />} />
                <Route path='/admin/add' element={<AddAdmin/>}/>
              </>
            )}

            {role === 'USER' && (
              <>
                <Route path="/user/home" element={<UserHome />} />
                <Route path="/user/my-project" element={<MyProject />} />
                <Route path="/user/my-highlights" element={<MyHighlights />} />
                <Route path="/user/my-client" element={<MyClient />} />
                <Route path="/user/my-issues" element={<MyIssues />} />
                <Route path="/user/UserProfile" element={<UserProfile />} />
                <Route path="/highlight/add" element={<AddHighlight />} />
                <Route path="/user/my-resouces" element={<Resource />} />
              </>
            )}

            {/* Fallback: Redirect based on role */}
            <Route path="*" element={<Navigate to={role === 'ADMIN' ? '/' : '/user/home'} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AppRoutes;
