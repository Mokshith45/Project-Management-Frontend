import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Sample initial data for roles
const initialRateCard = [
  { id: 1, role: 'Junior Developer', rate: 1500 },
  { id: 2, role: 'Mid Developer', rate: 2500 },
  { id: 3, role: 'Senior Developer', rate: 3500 },
  { id: 4, role: 'Advanced Developer', rate: 4500 },
  { id: 5, role: 'Expert', rate: 7000 },
];

// Animation config
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 80 },
  }),
};

// Each project includes a client name
const projectsList = [
  { id: 'p1', name: 'Compliance Portal', client: 'Morgan Stanley' },
  { id: 'p2', name: 'Website Revamp', client: 'Goldman sachs' },
  { id: 'p3', name: 'HR Automation', client: 'JP Morgan' },
];

const RateCards = () => {
  const [globalRates, setGlobalRates] = useState(initialRateCard);

  const [projectRateCards, setProjectRateCards] = useState(() => {
    const initial = {};
    projectsList.forEach((project) => {
      initial[project.id] = initialRateCard.map((item) => ({ ...item }));
    });
    return initial;
  });

  const [selectedProjectId, setSelectedProjectId] = useState(projectsList[0].id);

  const selectedProject = projectsList.find(p => p.id === selectedProjectId);

  const handleGlobalRateChange = (id, newRate) => {
    const updated = globalRates.map((item) =>
      item.id === id ? { ...item, rate: newRate } : item
    );
    setGlobalRates(updated);
  };

  const handleProjectRateChange = (id, newRate) => {
    setProjectRateCards((prev) => ({
      ...prev,
      [selectedProjectId]: prev[selectedProjectId].map((item) =>
        item.id === id ? { ...item, rate: newRate } : item
      ),
    }));
  };

  const saveGlobalRate = () => {
    console.log('Global rate card saved:', globalRates);
  };

  const saveProjectRate = () => {
    console.log(`Rate card for project ${selectedProject.name} saved:`, projectRateCards[selectedProjectId]);
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
                <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Per Day (₹)</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {globalRates.map((item, index) => (
                <motion.tr
                  key={item.id}
                  custom={index}
                  variants={rowVariants}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-700">{item.role}</td>
                  <td className="px-6 py-4">
                    <motion.input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleGlobalRateChange(item.id, parseInt(e.target.value))
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
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm transition-all"
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

      {/* Project-Specific Rate Card */}
      <div>
        <motion.h2
          className="text-2xl font-bold text-indigo-700 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Project Rate Card (INR per Day)
        </motion.h2>

        {/* Dropdown for project selection */}
        <div className="mb-4">
          <label className="mr-2 font-medium text-gray-700">Select Project:</label>
          <select
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {projectsList.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name} (Client: {project.client})
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
                <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Per Day (₹)</th>
                <th className="px-6 py-3 text-left text-sm font-medium">Update</th>
              </tr>
            </thead>
            <tbody>
              {projectRateCards[selectedProjectId].map((item, index) => (
                <motion.tr
                  key={item.id}
                  custom={index}
                  variants={rowVariants}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-gray-700">{item.role}</td>
                  <td className="px-6 py-4">
                    <motion.input
                      type="number"
                      value={item.rate}
                      onChange={(e) =>
                        handleProjectRateChange(item.id, parseInt(e.target.value))
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
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm transition-all"
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
