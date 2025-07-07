import React from 'react';
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

// 📊 Dashboard Metrics
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

// ⚠️ Alerts Section
const alerts = [
  { id: 1, message: '🚨 Project "Initech Migration" is over budget by ₹50,000.' },
  { id: 2, message: '🕓 2 roles open > 7 days on "Compliance Portal"' },
  { id: 3, message: '⚠️ Highlight pending for project "Web Revamp"' },
];

// 🎯 Highlights (for banner + timeline)
const highlights = [
  { id: 1, title: 'Phase 1 Delivered', project: 'Website Revamp', date: '2024-06-20' },
  { id: 2, title: 'MVP Release', project: 'Compliance Portal', date: '2024-06-18' },
];

// 🔁 Banner-friendly version of highlights
const highlightTexts = highlights.map(
  (h) => `🎉 ${h.title} - ${h.project} on ${h.date}`
);

// 🛞 Slick carousel config
const carouselSettings = {
  infinite: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 4000,
  arrows: false,
  dots: false,
  pauseOnHover: true,
  swipeToSlide: true,
};

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen px-6 py-8 max-w-screen-xl mx-auto flex flex-col gap-8">

      {/* 🔁 Announcement Banner */}
      <div className="w-full fixed top-16 left-0 z-40 bg-blue-100 border-y border-blue-300">
        <Slider {...carouselSettings}>
          {highlightTexts.map((text, index) => (
            <div key={index} className="text-center py-2 text-blue-900 font-medium">
              {text}
            </div>
          ))}
        </Slider>
      </div>

      {/* ⬇️ Push content below fixed banner */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-24 flex flex-col md:flex-row items-start justify-between gap-6"
      >
        {/* 💬 Welcome Section */}
        <div className="flex-grow max-w-2xl bg-gradient-to-r from-indigo-700 to-purple-700 text-white p-6 rounded-xl shadow">
          <h1 className="text-3xl font-bold">Welcome back, Admin 👋</h1>
          <p className="text-sm text-indigo-100 mt-1">Here’s your dashboard</p>
        </div>

        {/* 🎯 Quick Action Buttons */}
        <aside className="flex flex-row md:flex-col gap-4">
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
            <motion.div
              key={i}
              whileHover={{ scale: 1.1 }}
              className="group flex items-center cursor-pointer"
            >
              <button
                className={`${cta.bgClass} ${cta.hoverClass} text-white p-3 rounded-full shadow-md transition duration-200`}
                onClick={() => navigate(cta.path)}
              >
                {cta.icon}
              </button>
              <span
                className={`${cta.bgClass} text-white ml-2 px-3 py-1 rounded-md text-sm font-medium
                  opacity-0 group-hover:opacity-100
                  scale-90 group-hover:scale-100
                  transition-all duration-200 origin-left whitespace-nowrap shadow-md`}
              >
                {cta.label}
              </span>
            </motion.div>
          ))}
        </aside>
      </motion.div>

      {/* 📊 Stat Cards */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.2,
            },
          },
        }}
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            className="bg-white shadow-md rounded-xl p-5 flex items-center gap-4"
          >
            <div className="bg-gray-100 p-3 rounded-full">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.title}</p>
              <p className="text-xl font-semibold text-gray-800">
                <CountUp end={stat.value} duration={1.5} />
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ⚠️ Alerts */}
      <motion.section
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-lg font-semibold text-red-600 mb-3">⚠️ Alerts & Notifications</h2>
        <ul className="bg-white border border-red-200 p-4 rounded-xl space-y-2 shadow-sm">
          {alerts.map((alert) => (
            <li key={alert.id} className="text-sm text-red-700">
              {alert.message}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* 🎯 Highlights Timeline */}
      <motion.section
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-lg font-semibold text-indigo-700 mb-4">🎯 Recent Highlights</h2>
        <ol className="relative border-l-2 border-indigo-300 ml-4">
          {highlights.map((hl) => (
            <li key={hl.id} className="mb-8 pl-6 relative">
              <span className="absolute -left-3 top-2 w-4 h-4 bg-indigo-600 rounded-full border-2 border-white" />
              <h4 className="text-sm font-bold text-indigo-800">{hl.title}</h4>
              <p className="text-xs text-gray-600">Project: {hl.project}</p>
              <p className="text-xs text-gray-400">Date: {hl.date}</p>
            </li>
          ))}
        </ol>
      </motion.section>
    </div>
  );
};

export default Home;
