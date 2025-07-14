import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const statusColors = {
  Open: 'bg-red-100 text-red-800',
  'In Progress': 'bg-yellow-100 text-yellow-800',
  Resolved: 'bg-green-100 text-green-800',
};

const severityColors = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const normalizeSeverity = (sev) => {
  if (!sev) return '';
  return sev.charAt(0).toUpperCase() + sev.slice(1).toLowerCase();
};

const Issues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem('token');

        const response = await axios.get('http://localhost:8080/api/issues', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setIssues(response.data || []);
      } catch (err) {
        console.error(err);
        setError('❌ Failed to load issues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  if (loading) return <p className="p-4 text-gray-600">Loading issues...</p>;
  if (error) return <p className="p-4 text-red-600">{error}</p>;

  return (
    <motion.div
      className="p-4 md:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.h2
        className="text-2xl font-bold text-indigo-700 mb-6"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        🐞 Project Issues
      </motion.h2>

      {issues.length === 0 ? (
        <p className="text-center text-gray-500">No issues found.</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {issues.map((issue) => {
            const sevKey = normalizeSeverity(issue.severity);
            const sevClass = severityColors[sevKey] || 'bg-gray-100 text-gray-700';
            const statusClass = statusColors[issue.status] || 'bg-gray-100 text-gray-700';

            return (
              <motion.div
                key={issue.id}
                variants={cardVariants}
                className="bg-white p-5 rounded-xl shadow-md border border-gray-200 relative hover:shadow-xl transition-all"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  {issue.description || 'Untitled Issue'}
                </h4>

                <p className="text-sm mt-1">
                  <strong>Severity:</strong>{' '}
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${sevClass}`}>
                    {sevKey || 'N/A'}
                  </span>
                </p>

                <p className="text-sm mt-1">
                  <strong>Status:</strong>{' '}
                  <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${statusClass}`}>
                    {issue.status || 'N/A'}
                  </span>
                </p>

                <p className="text-sm mt-1">
                  <strong>Created By:</strong> {issue.createdBy || 'N/A'}
                </p>

                <p className="text-sm mt-1">
                  <strong>Created On:</strong> {issue.createdDate || 'N/A'}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Issues;
