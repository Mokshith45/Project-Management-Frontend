import React, { useState, useContext } from 'react';
import { UserContext } from '../userPages/UserContext';
import axiosInstance from '../../api/axios';

const UserProfile = () => {
  const { user } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    if (!newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/auth/change-password', {
        newPassword,
      });

      setSuccess('Password changed successfully!');
      setFormData({ newPassword: '', confirmPassword: '' });

      setTimeout(() => {
        setSuccess('');
        setShowModal(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data || 'Failed to update password. Please try again.'
      );
    }
  };

  if (!user) return <div className="p-6">Loading user profile...</div>;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto mt-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">👩‍💼 User Profile</h2>

      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold">User Id:</span> {user.id}
        </div>
        <div>
          <span className="font-semibold">Name:</span> {user.userName}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {user.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {user.userType}
        </div>
      </div>

      <div className="mt-6">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          onClick={() => setShowModal(true)}
        >
          Change Password
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold text-indigo-700 mb-4">
              🔐 Change Password
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="New Password"
                required
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Confirm New Password"
                required
              />

              {error && <p className="text-red-600 text-sm">{error}</p>}
              {success && <p className="text-green-600 text-sm">{success}</p>}

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
