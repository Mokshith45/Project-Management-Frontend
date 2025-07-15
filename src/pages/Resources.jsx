import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [projectMap, setProjectMap] = useState({});
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [projectFilter, setProjectFilter] = useState('all');
  const [projectsList, setProjectsList] = useState([]); // to populate dropdown


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
        setProjectsList(projectsList); // below setProjectMap
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
  const matchesAllocation =
    filter === 'available' ? !res.allocated :
    filter === 'allocated' ? res.allocated :
    true;

  const matchesProject =
    projectFilter === 'all' ? true : String(res.projectId) === String(projectFilter);
    return matchesAllocation && matchesProject;
});


  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row gap-3 justify-end items-center mb-4">
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Allocation:</label>
        <motion.select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          whileHover={{ scale: 1.03 }}
          className="border border-gray-300 text-sm rounded-md px-3 py-1.5 text-gray-700"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="allocated">Allocated</option>
        </motion.select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Project:</label>
        <motion.select
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          whileHover={{ scale: 1.03 }}
          className="border border-gray-300 text-sm rounded-md px-3 py-1.5 text-gray-700"
        >
          <option value="all">All Projects</option>
          {projectsList.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.projectName || proj.name}
            </option>
          ))}
        </motion.select>
      </div>
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
