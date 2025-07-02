import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AddHighlight = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ description: '', projectId: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 🌐 Replace this with your actual backend endpoint
    const res = await fetch("http://localhost:8080/api/highlights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });

    if (res.ok) {
      alert("Highlight added successfully!");
      navigate("/user/myhighlights");
    } else {
      alert("Failed to add highlight");
    }
  };

  return (
    <motion.div
      className="max-w-xl mx-auto mt-10 bg-white shadow p-6 rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-xl font-bold text-indigo-700 mb-4">➕ Add Project Highlight</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            rows={3}
            placeholder="Enter project highlight"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Project ID</label>
          <input
            type="text"
            name="projectId"
            value={form.projectId}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            required
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
  );
};

export default AddHighlight;
