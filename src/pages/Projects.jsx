import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const dummyProjects = [
  {
    id: 1,
    title: 'Website Revamp',
    duration: 'Jan 2024 - May 2024',
    type: 'Development',
    client: 'Acme Corp',
    required: 5,
    allocated: 4,
    status: 'Ongoing',
  },
  {
    id: 2,
    title: 'Infrastructure Audit',
    duration: 'Mar 2024 - Apr 2024',
    type: 'Consulting',
    client: 'Globex Inc',
    required: 2,
    allocated: 2,
    status: 'Completed',
  },
  {
    id: 3,
    title: 'Product Support Q2',
    duration: 'Apr 2024 - Jun 2024',
    type: 'Support',
    client: 'Initech',
    required: 3,
    allocated: 1,
    status: 'On Hold',
  },
];

const statusStyles = {
  Ongoing: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  'On Hold': 'bg-red-100 text-red-800',
};

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
  show: { opacity: 1, y: 0 },
};

const Projects = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      className="p-4 md:p-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      {/* Header + Add Project */}
      <motion.div
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-indigo-700">📊 Projects Dashboard</h2>
        <button
          onClick={() => navigate('/projects/add')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow transition duration-200"
        >
          ➕ Add Project
        </button>
      </motion.div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyProjects.map((project) => {
          const mismatch = project.allocated < project.required;

          return (
            <motion.div
              key={project.id}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300"
              variants={cardVariants}
              whileHover={{ scale: 1.03 }}
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.duration}</p>
              </div>

              <div className="text-sm text-gray-700 space-y-2">
                <p><strong>Client:</strong> {project.client}</p>
                <p><strong>Type:</strong> {project.type}</p>
                <p>
                  <strong>Resources:</strong> {project.allocated} / {project.required}
                  {mismatch && (
                    <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold animate-pulse">
                      ⚠ Mismatch
                    </span>
                  )}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusStyles[project.status]}`}
                  >
                    {project.status}
                  </span>
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default Projects;
