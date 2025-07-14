import React, { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../api/axios';
import { motion } from 'framer-motion';
import { UserContext } from './UserContext';

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: 'beforeChildren',
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const MyClient = () => {
  const { user, loadingUser, error: userError } = useContext(UserContext);
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchClientAndProjects = async () => {
      try {
        // Step 1: Get project by user
        const projectRes = await axiosInstance.get(`/api/projects/lead/${user.id}`);
        const projectId = projectRes.data.id;

        // Step 2: Get client by project
        const clientRes = await axiosInstance.get(`/api/clients/${projectId}`);
        const clientData = clientRes.data;
        setClient(clientData);

        // Step 3: Get all projects for this client
        const projectListRes = await axiosInstance.get(`/api/projects/client/${clientData.id}`);
        setProjects(projectListRes.data);
      } catch (err) {
        console.error('Error fetching client/project info:', err);
        setError('Failed to load client details.');
      }
    };

    fetchClientAndProjects();
  }, [user]);

  if (loadingUser) return <div className="p-6">Loading user info...</div>;
  if (userError || error) return <div className="p-6 text-red-600">{userError || error}</div>;
  if (!client) return <div className="p-6">Loading client info...</div>;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long' };
    return `Working with us since ${date.toLocaleDateString(undefined, options)}`;
  };

  const renderStars = (rating) => '⭐'.repeat(rating) + '☆'.repeat(5 - rating);

  return (
    <motion.div
      className="pt-10 px-4 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl font-bold text-indigo-700 mb-6"
        variants={itemVariants}
      >
        🏢 Client Company Details
      </motion.h2>

      <motion.div
        className="bg-white shadow rounded-xl p-6 border border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Client Name</h3>
          <p className="text-gray-700">{client.name}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Client Email</h3>
          <p className="text-gray-700">{client.email}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Engagement</h3>
          <p className="text-gray-700">{formatDate(client.onBoardedOn)}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Client Rating</h3>
          <p className="text-yellow-500 text-lg">{renderStars(client.clientRating)}</p>
        </motion.div>

        <motion.div className="md:col-span-2" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Projects with Us</h3>
          {projects.length === 0 ? (
            <p className="text-gray-500 italic">No projects found for this client.</p>
          ) : (
            <motion.ul className="list-disc pl-5 text-gray-700 text-sm">
              {projects.map((project, idx) => (
                <motion.li key={idx} variants={itemVariants}>
                  {project.projectName || project.name || `Project ${idx + 1}`}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MyClient;
