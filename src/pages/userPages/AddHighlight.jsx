import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { UserContext } from './UserContext';

const AddHighlight = () => {
  const navigate = useNavigate();
  const { user, loadingUser, error: userError } = useContext(UserContext);

  const [projectId, setProjectId] = useState(null);
  const [form, setForm] = useState({ description: '' });
  const [error, setError] = useState('');

  // ✅ Fetch projectId for logged-in user
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');

    axios
      .get(`http://localhost:8080/api/projects/lead/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProjectId(res.data.id);
      })
      .catch((err) => {
        console.error('Error fetching project:', err);
        setError('Unable to fetch project for the current user.');
      });
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!projectId) {
      alert('Project not loaded yet.');
      return;
    }

    const token = localStorage.getItem('token');
    
    const newHighlight = {
      description: form.description,
      createdOn: new Date().toISOString().split('T')[0],
      projectId,
    };

    try {
      await axios.post('http://localhost:8080/api/highlights', newHighlight, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate('/user/my-highlights');
    } catch (err) {
      console.error('Error submitting highlight:', err);
      alert('Failed to submit highlight.');
    }
  };

  if (loadingUser) return <div className="p-6">Loading user...</div>;
  if (userError || error) return <div className="p-6 text-red-600">{userError || error}</div>;

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
