// EditIssue.jsx
import React from 'react';
import { motion } from 'framer-motion';

const EditIssue = ({ show, onClose, formData, onChange, onSubmit }) => {
  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        exit={{ y: -50 }}
      >
        <h2 className="text-xl font-semibold text-indigo-700 mb-4">Edit Issue</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            placeholder="Description"
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
          <select
            name="severity"
            value={formData.severity}
            onChange={onChange}
            className="w-full p-2 border rounded"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            className="w-full p-2 border rounded"
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Update
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditIssue;
