import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [projectMap, setProjectMap] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔁 Fetch resources & project names
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [resResponse, projResponse] = await Promise.all([
          axios.get('http://localhost:8080/api/resources', { headers }),
          axios.get('http://localhost:8080/api/projects', { headers }),
        ]);

        const resourcesList = resResponse.data || [];
        const projectsList = projResponse.data || [];

        const projMap = {};
        projectsList.forEach((proj) => {
          projMap[proj.id] = proj.projectName || proj.name || `Project ${proj.id}`;
        });

        setProjectMap(projMap);
        setResources(resourcesList);
      } catch (err) {
        console.error('Failed to load resources:', err);
        setError('Error loading resources');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = resources.filter((res) => {
    if (filter === 'available') return !res.allocated;
    if (filter === 'allocated') return res.allocated;
    return true;
  });

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">🧑‍💻 Resource Management</h2>
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
      </div>

      {/* Loading / Error */} 
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
                <th className="px-4 py-3">Project</th>
                <th className="px-4 py-3">Timeline</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((res, index) => (
                <motion.tr
                  key={res.id}
                  className="border-b hover:bg-gray-50 transition"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-4 py-3 font-medium">{res.resourceName}</td>
                  <td className="px-4 py-3">{res.level || '-'}</td>
                  <td className="px-4 py-3">
                    <motion.span
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        res.allocated
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {res.allocated ? 'Allocated' : 'Available'}
                    </motion.span>
                  </td>
                  <td className="px-4 py-3">
                    {projectMap[res.projectId] || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {res.startDate} → {res.endDate}
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
