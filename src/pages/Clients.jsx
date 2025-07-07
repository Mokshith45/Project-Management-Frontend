import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios'; // ✅ Axios for API calls

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true); // For optional loader
  const [error, setError] = useState(null);

  // 🔁 Fetch clients from API on component mount
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8080/api/clients', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
      } catch (err) {
        setError('Failed to load clients');
      } finally {
        setLoading(false);
      }
    };
  
    fetchClients();
  }, []);
  

  return (
    <motion.div
      className="p-4 md:p-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Header + Button */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-indigo-700">👥 Clients Dashboard</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/clients/add')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow"
        >
          ➕ Add Client
        </motion.button>
      </motion.div>

      {/* Loading/Error State */}
      {loading ? (
        <p className="text-gray-600">Loading clients...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : clients.length === 0 ? (
        <p className="text-gray-600">No clients found.</p>
      ) : (
        // Clients Grid
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {clients.map((client) => (
            <motion.div
              key={client.id}
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={client.logo || 'https://via.placeholder.com/40'}
                  alt="Logo"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
                  <p className="text-sm text-gray-500">{client.contact}</p>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p><strong>Projects:</strong> {client.totalProjects}</p>
                <p><strong>Total Spend:</strong> {client.totalSpend}</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors"
                onClick={() => navigate(`/clients/${client.id}/projects`)}
              >
                View Projects
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Clients;
