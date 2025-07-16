import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('all');
  const [projectFilter, setProjectFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔁 Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [resRes, projRes] = await Promise.all([
          axios.get('http://localhost:8080/api/resources', { headers }),
          axios.get('http://localhost:8080/api/projects', { headers }),
        ]);

        setResources(resRes.data || []);
        setProjects(projRes.data || []);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🎯 Filter logic
  const filteredResources = resources.filter((res) => {
    const matchesAllocation =
      filter === 'all' ||
      (filter === 'allocated' && res.allocated) ||
      (filter === 'available' && !res.allocated);

    const matchesProject =
      projectFilter === 'all' || res.projectId?.toString() === projectFilter;

    return matchesAllocation && matchesProject;
  });

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">🧑‍💻 Resource Management</h2>

        {/* 🔘 Filter by Allocation */}
        <motion.select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          whileHover={{ scale: 1.03 }}
          className="border border-gray-300 text-sm rounded-md px-3 py-2 text-gray-700"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="allocated">Allocated</option>
        </motion.select>

        {/* 🔘 Filter by Project (always enabled) */}
        <motion.select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          whileHover={{ scale: 1.03 }}
          className="border border-gray-300 text-sm rounded-md px-3 py-2 text-gray-700"
        >
          <option value="all">All Projects</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id.toString()}>
              {proj.projectName}
            </option>
          ))}
        </motion.select>
      </div>

      {/* Table display */}
      {loading ? (
        <p className="text-gray-500">Loading resources...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg shadow-sm">
            <thead className="text-xs text-white uppercase bg-gradient-to-r from-indigo-600 to-purple-600">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Level</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Start Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((res, index) => (
                <motion.tr
                  key={res.id}
                  className="border-b hover:bg-gray-50 transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <td className="px-4 py-3 font-medium">{res.resourceName}</td>
                  <td className="px-4 py-3">{res.level || '-'}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        res.allocated
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {res.allocated ? 'Allocated' : 'Available'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {res.startDate
                      ? new Date(res.startDate).toLocaleDateString()
                      : '-'}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default Resources;
