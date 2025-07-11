import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const statusStyles = {
  ACTIVE: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-green-100 text-green-800',
  'ON_HOLD': 'bg-red-100 text-red-800',
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
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Read status from query param (e.g., ?status=ACTIVE)
  const queryParams = new URLSearchParams(location.search);
  const statusFilter = queryParams.get('status');

  useEffect(() => {
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/api/projects', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Error ${res.status}: ${errorText}`);
        }
        return res.json();
      })
      .then((data) => {
        setProjects(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Failed to fetch projects:', error);
        setErrorMsg(error.message);
        setLoading(false);
      });
  }, []);

  // Apply filter if statusFilter exists
  const filteredProjects = statusFilter
    ? projects.filter((p) => p.status === statusFilter)
    : projects;

  return (
    <motion.div
      className="p-4 md:p-6"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
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

      {loading && (
        <p className="text-center text-gray-600">Loading projects...</p>
      )}
      {errorMsg && (
        <p className="text-center text-red-500">Failed to load projects: {errorMsg}</p>
      )}
      {!loading && !errorMsg && filteredProjects.length === 0 && (
        <p className="text-center text-gray-500">No projects found.</p>
      )}

      {!loading && !errorMsg && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const mismatch = (project.allocated || 0) < (project.required || 0);
            return (
              <motion.div
                key={project.id}
                className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                variants={cardVariants}
                whileHover={{ scale: 1.03 }}
              >
                <div>
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{project.projectName}</h3>
                    <p className="text-sm text-gray-500">Department: {project.department || 'N/A'}</p>
                  </div>

                  <div className="text-sm text-gray-700 space-y-2">
                    <p><strong>Type:</strong> {project.type}</p>
                    <p>
                      {mismatch && (
                        <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-700 text-xs font-semibold animate-pulse">
                          ⚠ Mismatch
                        </span>
                      )}
                    </p>
                    <p>
                      <strong>Status:</strong>{' '}
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${statusStyles[project.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {project.status}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="mt-4 self-end">
                  <button
                    onClick={() => navigate(`/projects/${project.id}`)}
                    className="text-sm items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-md shadow-md hover:bg-indigo-700 transition duration-200"
                  >
                    View Project 
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default Projects;
