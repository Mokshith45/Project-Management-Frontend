import React, { useEffect, useState } from 'react';
import {
  FaUserTie, FaProjectDiagram, FaBriefcase,
  FaMoneyBillWave, FaUserShield
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import axiosInstance from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const carouselSettings = {
  infinite: true,
  speed: 300,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: false,
  dots: false,
  pauseOnHover: true,
  swipeToSlide: true,
  cssEase: 'ease-in-out',
};

const Home = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [issues, setIssues] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [username, setUsername] = useState('Admin');
  const [showAllHighlights, setShowAllHighlights] = useState(false);

  const capitalizeName = (name) => {
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      axiosInstance.get(`/api/users/${userId}`)
        .then((res) => setUsername(capitalizeName(res.data.userName || 'Admin')))
        .catch(() => setUsername('Admin'));
    } catch {
      setUsername('Admin');
    }
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [
          clientsRes,
          projectsRes,
          positionsRes,
          highlightsRes,
          issuesRes,
        ] = await Promise.all([
          axiosInstance.get('/api/clients'),
          axiosInstance.get('/api/projects'),
          axiosInstance.get('/api/open-positions'),
          axiosInstance.get('/api/highlights'),
          axiosInstance.get('/api/issues'),
        ]);

        const clientsList = Array.isArray(clientsRes.data) ? clientsRes.data : clientsRes.data?.data || [];
        const projectsList = Array.isArray(projectsRes.data) ? projectsRes.data : projectsRes.data?.data || [];
        const positionsList = Array.isArray(positionsRes.data) ? positionsRes.data : positionsRes.data?.data || [];
        const highlightsList = Array.isArray(highlightsRes.data) ? highlightsRes.data : highlightsRes.data?.data || [];
        const issuesList = Array.isArray(issuesRes.data) ? issuesRes.data : issuesRes.data?.data || [];

        const projectIdMap = {};
        projectsList.forEach(p => {
          const key = String(p.id);
          projectIdMap[key] = p.name || p.projectName || p.title || 'Unnamed Project';
        });

        const newStats = [
          {
            title: 'Total Clients',
            value: clientsList.length,
            icon: <FaUserTie className="text-xl text-indigo-600" />,
          },
          {
            title: 'Ongoing Projects',
            value: projectsList.filter(p => p.status === 'ACTIVE').length,
            icon: <FaProjectDiagram className="text-xl text-purple-600" />,
          },
          {
            title: 'Open Positions',
            value: positionsList.length,
            icon: <FaBriefcase className="text-xl text-red-600" />,
          },
          {
            title: 'Over-Budget Projects',
            value: projectsList.filter(p => p.overBudget === true).length,
            icon: <FaMoneyBillWave className="text-xl text-yellow-500" />,
          },
        ];

        const highlightsWithProjectNames = highlightsList.map(hl => ({
          id: hl.id,
          title: hl.description,
          project: projectIdMap[String(hl.projectId)] || 'Unknown Project',
          date: new Date(hl.createdOn).toLocaleDateString(),
        }));

        const issuesWithProjectNames = issuesList.map(issue => ({
          ...issue,
          project: projectIdMap[String(issue.projectId)] || 'Unknown Project',
          date: new Date(issue.createdOn).toLocaleDateString(),
        }));

        setStats(newStats);
        setHighlights(highlightsWithProjectNames);
        setIssues(issuesWithProjectNames);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    fetchContent();
  }, []);

  const highlightTexts = highlights.map(
    (h) => `🎉 ${h.title} - ${h.project} on ${h.date}`
  );

  return (
    <div className="min-h-screen px-4 py-6 max-w-screen-xl mx-auto flex flex-col gap-5">

      {/* Carousel */}
      <div className="w-full fixed top-16 left-28 right-0 z-40">
        <div className="bg-gradient-to-r from-blue-100 to-indigo-100 border-y border-indigo-300 shadow-sm">
          <Slider {...carouselSettings}>
            {highlightTexts.length > 0 ? (
              highlightTexts.map((text, index) => (
                <div key={index} className="py-2 px-6 text-center text-indigo-900 font-medium text-sm tracking-wide">
                  {text}
                </div>
              ))
            ) : (
              <div className="py-2 px-6 text-center text-gray-600">No highlights available</div>
            )}
          </Slider>
        </div>
      </div>

      {/* Welcome & Actions */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-10 flex flex-col md:flex-row items-start justify-between gap-5"
      >
        <div className="flex-grow max-w-2xl bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-5 rounded-xl shadow">
          <h1 className="text-2xl font-bold">Welcome back, {username} 👋</h1>
          <p className="text-sm text-indigo-100 mt-1">Here’s your dashboard</p>
        </div>

        <aside className="flex flex-row md:flex-col gap-3">
          {[
            {
              icon: <FaUserShield />,
              label: 'Add New Admin',
              path: 'admin/add',
              bgClass: 'bg-indigo-600',
              hoverClass: 'hover:bg-indigo-700',
            },
            {
              icon: <FaUserTie />,
              label: 'Add Client',
              path: 'clients/add',
              bgClass: 'bg-purple-600',
              hoverClass: 'hover:bg-purple-700',
            },
            {
              icon: <FaBriefcase />,
              label: 'Post Open Role',
              path: 'open-positions/add',
              bgClass: 'bg-yellow-500',
              hoverClass: 'hover:bg-yellow-600',
            },
          ].map((cta, i) => (
            <div
              key={i}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate(cta.path)}
            >
              <button className={`${cta.bgClass} ${cta.hoverClass} text-white p-2.5 rounded-full shadow-md`}>
                {cta.icon}
              </button>
              <span className="text-sm font-medium text-gray-700">{cta.label}</span>
            </div>
          ))}
        </aside>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
      >
        {stats.map((stat, index) => {
          const isNavigable = stat.title === 'Total Clients' || stat.title === 'Ongoing Projects';
          const targetPath =
            stat.title === 'Total Clients' ? '/clients' :
            stat.title === 'Ongoing Projects' ? '/projects?status=ACTIVE' :
            null;

          return (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              className={`bg-white shadow-md rounded-xl p-4 flex items-center gap-4 ${
                isNavigable ? 'cursor-pointer hover:shadow-lg transition' : ''
              }`}
              onClick={() => {
                if (targetPath) navigate(targetPath);
              }}
            >
              <div className="bg-gray-100 p-2 rounded-full">{stat.icon}</div>
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-lg font-semibold text-gray-800">
                  <CountUp end={stat.value} duration={1.5} />
                </p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Highlights Section */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-base font-semibold text-indigo-700 mb-3">🎯 Recent Highlights</h2>
        <ol className="relative border-l-2 border-indigo-300 ml-2">
          {(showAllHighlights ? highlights : highlights.slice(0, 3)).map((hl) => (
            <li key={hl.id} className="mb-4 pl-6 relative">
              <span className="absolute -left-3 top-2 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white" />
              <h4 className="text-sm font-semibold text-indigo-800">{hl.project}</h4>
              <p className="text-xs text-gray-600">{hl.title}</p>
              <p className="text-xs text-gray-400">Date: {hl.date}</p>
            </li>
          ))}
        </ol>
        {highlights.length > 3 && (
          <div className="mt-1 ml-2">
            <button
              onClick={() => setShowAllHighlights((prev) => !prev)}
              className="flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition duration-200"
            >
              <span>{showAllHighlights ? 'View Less' : 'View More'}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${
                  showAllHighlights ? 'rotate-180' : 'rotate-0'
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
      </motion.section>

      {/* Issues Section */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-base font-semibold text-red-600 mb-3">🐞 Reported Issues</h2>
        <ul className="bg-white border border-red-200 p-4 rounded-xl space-y-1 shadow-sm">
          {issues.length === 0 ? (
            <li className="text-sm text-gray-500">No reported issues found</li>
          ) : (
            issues.map((issue) => (
              <li key={issue.id} className="text-sm text-red-700">
                <h4>Project: {issue.project}</h4>
                <p className="text-xs text-gray-500">{issue.description}</p>
                <p className="text-xs text-gray-400">Date: {issue.createdDate}</p>
              </li>
            ))
          )}
        </ul>
      </motion.section>
    </div>
  );
};

export default Home;
