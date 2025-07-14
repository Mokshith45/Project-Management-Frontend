import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Animation config
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, type: 'spring', stiffness: 80 },
  }),
};

const RateCards = () => {
  const [globalRates, setGlobalRates] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectRates, setProjectRates] = useState([]);

  const token = localStorage.getItem('token');
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // 🟡 Fetch global rate card and store as master template
  const fetchGlobalRates = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/ratecards/global', axiosConfig);
      setGlobalRates(res.data);
    } catch (err) {
      console.error('Failed to load global rate card:', err);
    }
  };

  // 🟡 Fetch all projects, then fetch client names for each
  const fetchProjectsList = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/projects', axiosConfig);
      const projects = res.data;

      const enriched = await Promise.all(
        projects.map(async (project) => {
          try {
            const clientRes = await axios.get(
              `http://localhost:8080/api/clients/${project.clientId}`,
              axiosConfig
            );
            return {
              ...project,
              client: clientRes.data.name || 'N/A',
            };
          } catch {
            return { ...project, client: 'Unknown' };
          }
        })
      );

      setProjectsList(enriched);
      if (enriched.length > 0) setSelectedProjectId(enriched[0].id);
    } catch (err) {
      console.error('Failed to fetch projects:', err);
    }
  };

  // 🔁 Merge global template with project-specific values
  const mergeProjectRatesWithGlobal = (projectRatesFromAPI) => {
    return globalRates.map((global) => {
      const match = projectRatesFromAPI.find((p) => p.level === global.level);
      return {
        id: match?.id || null,
        level: global.level,
        rate: match?.rate || 0,
      };
    });
  };

  // 🟡 Fetch project-specific rate card and normalize
  const fetchProjectRates = async (projectId) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/ratecards/project/${projectId}`,
        axiosConfig
      );
      const mergedRates = mergeProjectRatesWithGlobal(res.data);
      setProjectRates(mergedRates);
    } catch (err) {
      console.error('Failed to load project rate card:', err);
      // fallback: show all global levels with 0
      setProjectRates(globalRates.map((g) => ({ ...g, rate: 0 })));
    }
  };

  useEffect(() => {
    fetchGlobalRates();
    fetchProjectsList();
  }, []);

  useEffect(() => {
    if (selectedProjectId && globalRates.length > 0) {
      fetchProjectRates(selectedProjectId);
    }
  }, [selectedProjectId, globalRates]);

  // 🔧 Handlers
  const handleGlobalRateChange = (level, newRate) => {
    setGlobalRates((prev) =>
      prev.map((item) => (item.level === level ? { ...item, rate: newRate } : item))
    );
  };

  const handleProjectRateChange = (level, newRate) => {
    setProjectRates((prev) =>
      prev.map((item) => (item.level === level ? { ...item, rate: newRate } : item))
    );
  };

  // 💾 Save handlers
  const saveGlobalRate = async () => {
    try {
      await axios.post('http://localhost:8080/api/ratecards/global', globalRates, axiosConfig);
      alert('Global rate card saved!');
    } catch (err) {
      console.error('Failed to save global rates:', err);
      alert('Error saving global rate card.');
    }
  };

  const saveProjectRate = async () => {
    try {
      await axios.post(
        `http://localhost:8080/api/ratecards/project/${selectedProjectId}`,
        projectRates,
        axiosConfig
      );
      alert('Project rate card saved!');
    } catch (err) {
      console.error('Failed to save project rates:', err);
      alert('Error saving project rate card.');
    }
  };

  return (
    <div className="space-y-12">
      {/* Global Rate Card */}
      <div>
        <motion.h2
          className="text-2xl font-bold text-indigo-700 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Global Rate Card (INR per Day)
        </motion.h2>

        <div className="overflow-x-auto">
          <motion.table
            className="min-w-full bg-white rounded-xl shadow-md border border-gray-200"
            initial="hidden"
            animate="visible"
          >
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Level</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Rate (₹)</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Save</th>
              </tr>
            </thead>
            <tbody>
              {globalRates.map((item, index) => (
                <motion.tr
                  key={item.level}
                  custom={index}
                  variants={rowVariants}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-700">{item.level}</td>
                  <td className="px-6 py-4">
                    <motion.input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleGlobalRateChange(item.level, parseInt(e.target.value))
                      }
                      className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveGlobalRate}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm"
                    >
                      Save
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>

      {/* Project Rate Card */}
      <div>
        <motion.h2
          className="text-2xl font-bold text-indigo-700 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Project Rate Card (INR per Day)
        </motion.h2>

        <div className="mb-4">
          <label className="mr-2 font-medium text-gray-700">Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {projectsList.map((project) => (
              <option key={project.id} value={project.id}>
                {project.projectName} (Client: {project.client})
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <motion.table
            className="min-w-full bg-white rounded-xl shadow-md border border-gray-200"
            initial="hidden"
            animate="visible"
          >
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">Level</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Rate (₹)</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Save</th>
              </tr>
            </thead>
            <tbody>
              {projectRates.map((item, index) => (
                <motion.tr
                  key={item.level}
                  custom={index}
                  variants={rowVariants}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-700">{item.level}</td>
                  <td className="px-6 py-4">
                    <motion.input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleProjectRateChange(item.level, parseInt(e.target.value))
                      }
                      className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      whileFocus={{ scale: 1.02 }}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={saveProjectRate}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm"
                    >
                      Save
                    </motion.button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </motion.table>
        </div>
      </div>
    </div>
  );
};

export default RateCards;
