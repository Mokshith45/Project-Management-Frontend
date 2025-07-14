import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { UserContext } from './UserContext';
import { FaPlusCircle, FaRegCalendarAlt, FaBuilding, FaFolderOpen } from 'react-icons/fa';

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      when: 'beforeChildren',
      staggerChildren: 0.12
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: 10, scale: 0.9, transition: { duration: 0.2 } }
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

      try {
        const projectRes = await axiosInstance.get(`/api/projects/lead/${user.id}`);
        const project = projectRes.data;
        const projectId = project.id;
        setProjectName(project.projectName);

        try {
          const clientRes = await axiosInstance.get(`/api/clients/project/${projectId}`);
          setClientName(clientRes.data.name);
        } catch {
          setClientName('Unknown Client');
        }

        const highlightRes = await axiosInstance.get(`/api/highlights/project/${projectId}`);
        setHighlights(highlightRes.data);
      } catch (err) {
        console.error('Error fetching highlights:', err);
        setError('Failed to load project highlights.');
      }
    };

    fetchData();
  }, [user]);

  if (loadingUser) return <div className="p-4 text-sm">Loading user...</div>;
  if (userError || error) return <div className="p-4 text-red-600 text-sm">{userError || error}</div>;

  return (
    <motion.div
      className="p-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex justify-between items-center mb-3" variants={itemVariants}>
        <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2">
          📌 Highlights
        </h2>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/highlight/add"
            className="flex items-center gap-2 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700"
          >
            <FaPlusCircle /> Add
          </Link>
        </motion.div>
      </motion.div>

      <motion.div className="mb-3 space-y-1 text-sm" variants={itemVariants}>
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FaBuilding /> Client: <strong>{clientName}</strong>
        </div>
        <div className="flex items-center gap-2 text-indigo-600">
          <FaFolderOpen /> Project Name: <strong>{projectName}</strong>
        </div>
      </motion.div>

      {highlights.length === 0 ? (
        <motion.div variants={itemVariants} className="text-gray-500 italic mt-2 text-sm">
          No highlights available.
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
          variants={containerVariants}
        >
          <AnimatePresence>
            {highlights.map((hl) => (
              <motion.div
                key={hl.id}
                className="bg-white p-3 rounded-md shadow-sm border hover:shadow-md transition text-sm"
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <h5 className="text-indigo-700 font-medium mb-1 truncate">{hl.description}</h5>
                <div className="flex items-center text-xs text-gray-500 mt-1">
                  <FaRegCalendarAlt className="mr-1" />
                  {hl.createdOn}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyHighlights;
