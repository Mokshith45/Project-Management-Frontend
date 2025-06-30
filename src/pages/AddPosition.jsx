import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddPosition = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    projectId: '',
    level: '',
    numberRequired: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.projectId || !form.level || !form.numberRequired) {
      alert('Please complete all required fields');
      return;
    }

    // Validate numberRequired is positive
    if (Number(form.numberRequired) < 1) {
      alert('Number of Positions must be at least 1');
      return;
    }

    // Prepare data as per DTO
    const openPositionData = {
      projectId: Number(form.projectId),
      level: form.level,
      numberRequired: Number(form.numberRequired),
    };

    console.log('✅ Open Position Submitted:', openPositionData);

    // TODO: API POST request

    navigate('/open-positions');
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-yellow-700 mb-6">📌 Post New Open Role</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Project ID */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Project ID *</label>
          <input
            type="number"
            name="projectId"
            min="1"
            value={form.projectId}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        {/* Level (ResourceLevel enum) */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Resource Level *</label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          >
            <option value="">-- Select Level --</option>
            <option value="JUNIOR">Junior</option>
            <option value="MID">Mid</option>
            <option value="SENIOR">Senior</option>
            <option value="Advanced">Advanced</option>
            <option value="Expert">Expert</option>
          </select>
        </div>

        {/* Number Required */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Number of Positions *</label>
          <input
            type="number"
            name="numberRequired"
            min="1"
            value={form.numberRequired}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-yellow-500 text-white py-2 px-6 rounded hover:bg-yellow-600 transition"
        >
          Post Role
        </button>
      </form>
    </div>
  );
};

export default AddPosition;
