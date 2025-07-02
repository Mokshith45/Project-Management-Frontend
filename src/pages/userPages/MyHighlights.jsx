import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const dummyProject = {
  clientName: 'Acme Corp',
  projectName: 'Website Revamp',
  projectId: 101,
  highlights: [
    { id: 1, description: 'MVP Released', createdOn: '2024-05-10', projectId: 101 },
    { id: 2, description: 'User Feedback Round', createdOn: '2024-06-05', projectId: 101 },
    { id: 3, description: 'API Enhancement', createdOn: '2024-06-20', projectId: 101 }
  ]
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, when: "beforeChildren", staggerChildren: 0.15 } }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const MyHighlights = () => {
  const { clientName, projectName, highlights } = dummyProject;

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
    </motion.div>
  );
};

export default MyHighlights;
