import React from 'react';
import {
  FaUserTie,
  FaProjectDiagram,
  FaBriefcase,
  FaMoneyBillWave,
  FaPlus,
  FaFolderOpen,
  FaThumbtack,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const stats = [
  {
    title: 'Total Clients',
    value: 12,
    icon: <FaUserTie className="text-2xl text-indigo-600" />,
  },
  {
    title: 'Ongoing Projects',
    value: 26,
    icon: <FaProjectDiagram className="text-2xl text-purple-600" />,
  },
  {
    title: 'Open Positions',
    value: 5,
    icon: <FaBriefcase className="text-2xl text-red-600" />,
  },
  {
    title: 'Over-Budget Projects',
    value: 3,
    icon: <FaMoneyBillWave className="text-2xl text-yellow-500" />,
  },
];

const alerts = [
  { id: 1, message: '🚨 Project "Initech Migration" is over budget by ₹50,000.' },
  { id: 2, message: '🕓 2 roles open > 7 days on "Compliance Portal"' },
  { id: 3, message: '⚠️ Highlight pending for project "Web Revamp"' },
];

const highlights = [
  {
    id: 1,
    title: 'Phase 1 Delivered',
    project: 'Website Revamp',
    date: '2024-06-20',
  },
  {
    id: 2,
    title: 'MVP Release',
    project: 'Compliance Portal',
    date: '2024-06-18',
  },
];


const Home = () => {

    const navigate = useNavigate();
  return (
    <div className="min-h-screen px-6 py-8 max-w-screen-xl mx-auto flex flex-col gap-8">
      {/* Top Section: Welcome + CTA side-by-side */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        {/* Welcome Card */}
        <div className="flex-grow max-w-2xl bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold">Welcome back, Admin👋</h1>
          <p className="text-sm text-indigo-100 mt-1">Here’s your project overview dashboard</p>
        </div>

        {/* Floating Vertical CTA */}
        <aside className="flex flex-row md:flex-col gap-4">
          {/* Add New Project */}
          <div className="group flex items-center cursor-pointer">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-md transition duration-200"
                                onClick={()=>navigate('projects/add')}>
              <FaProjectDiagram />
            </button>
            <span
              className="
                ml-2 bg-indigo-600 
                text-white px-3 py-1 rounded-md text-sm font-medium
                opacity-0 group-hover:opacity-100
                scale-90 group-hover:scale-100
                transition-all duration-200 origin-left whitespace-nowrap shadow-md
                "
            >
              Add New Project
            </span>
          </div>

          {/* Add Client */}
          <div className="group flex items-center cursor-pointer">
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-md transition duration-200"
                                onClick={()=>navigate('clients/add')}>
              <FaUserTie />
            </button>
            <span
              className="ml-2 bg-purple-600 text-white px-3 py-1 rounded-md text-sm font-medium
                opacity-0 group-hover:opacity-100
                scale-90 group-hover:scale-100
                transition-all duration-200 origin-left whitespace-nowrap shadow-md"
            >
              Add Client
            </span>
          </div>

          {/* Post Open Role */}
          <div className="group flex items-center cursor-pointer">
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-md transition duration-200"
                                onClick={()=>navigate('open-positions/add')}>
              <FaBriefcase />
            </button>
            <span
              className="ml-2 bg-yellow-500 text-white px-3 py-1 rounded-md text-sm font-medium
                opacity-0 group-hover:opacity-100
                scale-90 group-hover:scale-100
                transition-all duration-200 origin-left whitespace-nowrap shadow-md"
            >
              Post Open Role
            </span>
          </div>
        </aside>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4"
          >
            <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xl font-semibold text-gray-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-red-600 mb-3">⚠️ Alerts & Notifications</h2>
        <ul className="bg-white border border-red-200 p-4 rounded-xl space-y-2 shadow-sm">
          {alerts.map((alert) => (
            <li key={alert.id} className="text-sm text-red-700">
              {alert.message}
            </li>
          ))}
        </ul>
      </section>

      {/* Recent Highlights */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-indigo-700 mb-4">🎯 Recent Highlights</h2>
        <ol className="relative border-l-2 border-indigo-300 ml-4">
            {highlights.map((hl) => (
            <li key={hl.id} className="mb-8 pl-6 relative">
                {/* Dot */}
                <span className="absolute -left-3 top-2 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white" />
                <h4 className="text-sm font-bold text-indigo-800">{hl.title}</h4>
                <p className="text-xs text-gray-600">Project: {hl.project}</p>
                <p className="text-xs text-gray-400">Date: {hl.date}</p>
            </li>
            ))}
        </ol>
      </section>

    </div>
  );
};

export default Home;
