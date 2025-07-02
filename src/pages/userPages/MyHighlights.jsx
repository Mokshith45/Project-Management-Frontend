import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const dummyProject = {
  clientName: 'Acme Corp',
  projectName: 'Website Revamp',
  projectId: 101,
  highlights: [
    {
      id: 1,
      description: 'MVP Released',
      createdOn: '2024-05-10',
      projectId: 101,
    },
    {
      id: 2,
      description: 'User Feedback Round',
      createdOn: '2024-06-05',
      projectId: 101,
    },
    {
      id: 3,
      description: 'API Enhancement',
      createdOn: '2024-06-20',
      projectId: 101,
    }
  ]
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
};

const MyHighlights = () => {
  const { clientName, projectName, projectId } = dummyProject;
  const [highlights, setHighlights] = useState(dummyProject.highlights);
  const [showModal, setShowModal] = useState(false);
  const [newHighlight, setNewHighlight] = useState({
    description: ''
  });

  const handleChange = (e) => {
    setNewHighlight({ ...newHighlight, [e.target.name]: e.target.value });
  };

  const handleAddHighlight = (e) => {
    e.preventDefault();
    const newEntry = {
      id: highlights.length + 1,
      description: newHighlight.description,
      createdOn: new Date().toISOString().split('T')[0],
      projectId: projectId
    };
    setHighlights([...highlights, newEntry]);
    setShowModal(false);
    setNewHighlight({ description: '' });
  };

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
        <motion.button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          variants={itemVariants}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Add Highlight
        </motion.button>
      </div>

      <motion.div className="mb-8" variants={itemVariants}>
        <h3 className="text-xl font-semibold text-gray-800 mb-1">🏢 {clientName}</h3>
        <h4 className="text-lg text-indigo-600 font-semibold">📁 {projectName}</h4>
      </motion.div>

      <ol className="relative border-l border-indigo-300 ml-2">
        {highlights.map((hl) => (
          <motion.li
            key={hl.id}
            className="mb-6 ml-6"
            variants={itemVariants}
          >
            <span className="absolute w-4 h-4 bg-indigo-600 rounded-full -left-2 top-1"></span>
            <h5 className="font-semibold text-indigo-700">{hl.description}</h5>
            <p className="text-sm text-gray-500">
              🗓️ {hl.createdOn} | 📁 Project ID: {hl.projectId}
            </p>
          </motion.li>
        ))}
      </ol>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={modalVariants}
          >
            <motion.div
              className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl relative"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-lg"
              >
                ✖
              </button>
              <h3 className="text-xl font-bold text-indigo-700 mb-4">➕ New Highlight</h3>
              <form onSubmit={handleAddHighlight} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={newHighlight.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                    rows={3}
                    placeholder="Describe the highlight"
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                >
                  Submit Highlight
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyHighlights;
