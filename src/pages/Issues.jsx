import React from 'react';
import { motion } from 'framer-motion';

const dummyIssues = [
  {
    id: 1,
    type: 'Bug',
    title: 'Login not working on mobile',
    startDate: '2024-06-01',
    endDate: '2024-06-05',
    status: 'Open',
    isCritical: true,
  },
  {
    id: 2,
    type: 'Risk',
    title: 'Server migration delay',
    startDate: '2024-06-03',
    endDate: '',
    status: 'In Progress',
    isCritical: false,
  },
  {
    id: 3,
    type: 'Change Request',
    title: 'Update UI theme',
    startDate: '2024-05-20',
    endDate: '2024-05-30',
    status: 'Resolved',
    isCritical: false,
  },
];

const statusColors = {
  Open: 'bg-red-100 text-red-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800',
};

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const Issues = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">🐞 Project Issues</h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {dummyIssues.map((issue) => (
          <motion.div
            key={issue.id}
            variants={cardVariants}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200 relative hover:shadow-lg transition"
          >
            {issue.isCritical && (
              <span className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                Critical
              </span>
            )}
            <div className="mb-2 text-sm text-gray-500">{issue.type}</div>
            <h3 className="text-lg font-semibold text-gray-800">{issue.title}</h3>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Duration:</strong>{' '}
              {issue.startDate} – {issue.endDate || 'Ongoing'}
            </p>
            <p className="text-sm mt-2">
              <strong>Status:</strong>{' '}
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[issue.status]}`}
              >
                {issue.status}
              </span>
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Issues;
