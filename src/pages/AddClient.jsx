import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios'; // ✅ centralized instance with interceptors

const AddClient = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    onBoardedOn: '',
    clientRating: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic field validation
    if (!form.name.trim() || !form.email.trim() || !form.onBoardedOn) {
      alert('Please fill all required fields: Name, Email, and Onboard Date.');
      return;
    }

    // Optional: rating should be between 0 and 10 if provided
    if (
      form.clientRating !== '' &&
      (isNaN(form.clientRating) || form.clientRating < 0 || form.clientRating > 10)
    ) {
      alert('Client rating must be a number between 0 and 10.');
      return;
    }

    const clientData = {
      name: form.name.trim(),
      email: form.email.trim(),
      onBoardedOn: form.onBoardedOn,
      clientRating: form.clientRating ? Number(form.clientRating) : 0,
    };

    try {
      await axios.post('/api/clients', clientData); // ✅ No need to attach token here
      navigate('/clients', { replace: true });
    } catch (error) {
      console.error('❌ Error adding client:', error);
      alert('Error adding client. Please try again later.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-indigo-700 mb-6">👤 Add New Client</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Client Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Contact Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Onboarded On <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="onBoardedOn"
            value={form.onBoardedOn}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Client Rating (0–10)
          </label>
          <input
            type="number"
            name="clientRating"
            min="0"
            max="10"
            value={form.clientRating}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Optional"
          />
        </div>

        <button
          type="submit"
          className="mt-4 bg-purple-600 text-white py-2 px-6 rounded hover:bg-purple-700 transition"
        >
          Add Client
        </button>
      </form>
    </div>
  );
};

export default AddClient;
