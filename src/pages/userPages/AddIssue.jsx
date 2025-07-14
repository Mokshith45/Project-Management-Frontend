import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserContext } from './UserContext';

const modalVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85 },
};

const AddIssue = ({ show, onClose, onSubmit, formData, onChange }) => {
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      onChange({ target: { name: 'createdBy', value: user.userName } });
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
        className="bg-white p-6 rounded-xl w-full max-w-2xl shadow-xl relative"
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

        <form onSubmit={onSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Title */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-600">*</span>
            </label>
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

          {/* Severity */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Severity <span className="text-red-600">*</span>
            </label>
            <select
              name="severity"
              value={formData.severity}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select</option>
              <option>Urgent</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>

          {/* Description */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-600">*</span>
            </label>
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

          {/* Created By */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Created By
            </label>
            <input
              type="text"
              name="createdBy"
              value={formData.createdBy}
              readOnly
              className="w-full px-3 py-2 border border-gray-200 bg-gray-100 rounded"
            />
          </div>

          {/* Status */}
          <div className="col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status <span className="text-red-600">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={onChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Closed</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="col-span-2 mt-2">
            <motion.button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              Submit Issue
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddIssue;
