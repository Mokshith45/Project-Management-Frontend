// src/pages/userpages/AddIssue.jsx
import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserContext } from './UserContext'; // ✅ use the correct path

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85 },
};

const AddIssue = ({ show, onClose, onSubmit, formData, onChange }) => {
  const { user } = useContext(UserContext);
  //console.log('AddIssue user:', user);

  useEffect(() => {
    if (user) {
      onChange({ target: { name: 'createdBy', value: user.userName } }); // Auto-fill
    }
  }, [user]);

  if (!show) return null;

  return (
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
        transition={{ duration: 0.25 }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-lg"
        >
          ✖
        </button>
        <h3 className="text-xl font-bold text-indigo-700 mb-4">➕ New Issue</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Issue Title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Severity</label>
            <select
              name="severity"
              value={formData.severity}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows={3}
              placeholder="Describe the issue"
              required
            />
          </div>

          {/* 👇 Auto-filled from context, so just show it */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Created By</label>
            <input
              type="text"
              name="createdBy"
              value={formData.createdBy}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>

          <motion.button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            Submit Issue
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddIssue;
