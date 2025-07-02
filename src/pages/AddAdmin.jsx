import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAdmin = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!form.name || !form.email || !form.password) {
      setErrorMsg('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'Admin' }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add admin');
      }
      setSuccess(true);
      setForm({ name: '', email: '', password: '' });
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Add Admin Error:', err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Add New Admin 👤</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
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
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="admin@example.com"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded-md border-gray-300"
            placeholder="••••••••"
          />
        </div>

        {errorMsg && (
          <p className="text-sm text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md shadow transition disabled:opacity-50"
        >
          {loading ? 'Adding...' : 'Add Admin'}
        </button>

        {success && (
          <p className="text-green-600 mt-2 text-sm">✅ Admin added successfully!</p>
        )}
      </form>
    </div>
  );
};

export default AddAdmin;
