import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../api/axios';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 80 } },
};

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hlRes, projRes] = await Promise.all([
          axiosInstance.get('/api/highlights'),
          axiosInstance.get('/api/projects'),
        ]);

        setHighlights(Array.isArray(hlRes.data) ? hlRes.data : []);
        setProjects(Array.isArray(projRes.data) ? projRes.data : []);
      } catch (err) {
        console.error(err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const projectMap = projects.reduce((map, p) => {
    map[p.id] = p.name || p.projectName || p.title || 'Unnamed Project';
    return map;
  }, {});

  const grouped = highlights.reduce((acc, hl) => {
    const pid = hl.projectId;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(hl);
    return acc;
  }, {});


  return (
    <motion.div
      className="p-4 md:p-6 space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2 variants={itemVariants} className="text-2xl font-bold text-indigo-700">
        📌 Highlights
      </motion.h2>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-gray-500">No highlights available.</p>
      ) : (
        Object.entries(grouped).map(([projectId, items]) => (
          <motion.div
            key={projectId}
            variants={itemVariants}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-5"
          >
            <h3 className="text-lg font-semibold text-indigo-800 mb-4">
              📁 {projectMap[projectId] || 'Unknown Project'}
            </h3>
            <ul className="space-y-4">
              {items.map(({ id, description, createdOn }) => (
                <li
                  key={id}
                  className="border-l-2 border-indigo-300 pl-4 ml-2 hover:bg-gray-50 transition-colors rounded-md p-3"
                >
                  <p className="font-medium text-gray-800">{description}</p>
                  <p className="text-xs text-gray-500 mt-1">📅 {createdOn}</p>
                </li>
              ))}
            </ul>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default Highlights;
