import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ClientsList = [
  {
    id: 1,
    name: 'Acme Corp',
    logo: 'https://via.placeholder.com/40',
    contact: 'contact@acme.com',
    totalProjects: 5,
    totalSpend: '$120,000',
  },
  {
    id: 2,
    name: 'Globex Inc',
    logo: 'https://via.placeholder.com/40',
    contact: 'hello@globex.com',
    totalProjects: 3,
    totalSpend: '$90,000',
  },
  {
    id: 3,
    name: 'Initech',
    logo: 'https://via.placeholder.com/40',
    contact: 'support@initech.com',
    totalProjects: 7,
    totalSpend: '$200,000',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const Clients = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header + Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">Clients Dashboard</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/clients/add')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition shadow"
        >
          ➕ Add Client
        </motion.button>
      </div>

      {/* Clients Grid with Animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {ClientsList.map((client) => (
          <motion.div
            key={client.id}
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <img src={client.logo} alt="Logo" className="w-10 h-10 rounded-full" />
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
            >
              View Projects
            </motion.button>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Clients;
