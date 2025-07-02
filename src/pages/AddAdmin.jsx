import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin', // hardcoded
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error('Failed to add admin');

      setSuccess(true);
      setForm({ name: '', email: '', password: '', role: 'Admin' });

      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      alert('Error adding admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Add New Admin 👤</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="Admin Name"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="••••••••"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow mt-4 transition"
        >
          {loading ? 'Adding...' : 'Add Admin'}
        </button>

        {success && (
          <p className="text-green-600 mt-2 text-sm">✅ Admin added successfully!</p>
        )}
      </div>
    </div>
  );
};

export default AddAdmin;
