import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from './UserContext';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, when: 'beforeChildren', staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const MyHighlights = () => {
  const { user, loadingUser, error: userError } = useContext(UserContext);

  const [highlights, setHighlights] = useState([]);
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const token = localStorage.getItem('token');

      try {
        // Get project by lead ID
        const projectRes = await axios.get(`http://localhost:8080/api/projects/lead/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const project = projectRes.data;
        const projectId = project.id;
        setProjectName(project.projectName);

        // Get client name
        try {
          const clientRes = await axios.get(`http://localhost:8080/api/clients/project/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setClientName(clientRes.data.name);
        } catch (clientErr) {
          console.error('Error fetching client:', clientErr);
          setClientName('Unknown Client');
        }

        // Get highlights
        const highlightRes = await axios.get(`http://localhost:8080/api/highlights/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setHighlights(highlightRes.data);
      } catch (err) {
        console.error('Error fetching highlights:', err);
        setError('Failed to load project highlights.');
      }
    };

    fetchData();
  }, [user]);

  if (loadingUser) return <div className="p-6">Loading user...</div>;
  if (userError || error) return <div className="p-6 text-red-600">{userError || error}</div>;

  return (
    <motion.div
      className="pt-5 px-5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h2 className="text-2xl font-bold text-indigo-700" variants={itemVariants}>
          📌 Project Highlights
        </motion.h2>
        <motion.div variants={itemVariants}>
          <Link
            to="/highlight/add"
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          >
            ➕ Add Highlight
          </Link>
        </motion.div>
      </div>

      <motion.div className="mb-8" variants={itemVariants}>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">🏢 {clientName}</h3>
        <h4 className="text-lg text-indigo-600 font-semibold">📁 {projectName}</h4>
      </motion.div>

      {highlights.length === 0 ? (
        <motion.div variants={itemVariants} className="text-gray-500 italic">
          No highlights available for this project.
        </motion.div>
      ) : (
        <ol className="relative border-l border-indigo-300 ml-2">
          {highlights.map((hl) => (
            <motion.li key={hl.id} className="mb-6 ml-6" variants={itemVariants}>
              <span className="absolute w-4 h-4 bg-indigo-600 rounded-full -left-2 top-1"></span>
              <h5 className="font-semibold text-indigo-700">{hl.description}</h5>
              <p className="text-sm text-gray-500">
                🗓️ {hl.createdOn} | 📁 Project ID: {hl.projectId}
              </p>
            </motion.li>
          ))}
        </ol>
      )}
    </motion.div>
  );
};

export default MyHighlights;
