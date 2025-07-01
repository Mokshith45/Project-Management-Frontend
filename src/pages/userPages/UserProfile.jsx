import React, { useState } from 'react';

const UserProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem('auth'));

const userData = {
  name: storedUser?.name,
  email: storedUser?.email,
  role: storedUser?.role,
  id: storedUser?.id,
  password: storedUser?.password, // assuming you store it temporarily
};

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (oldPassword !== userData.password) {
      setError('Current password does not match.');
      return;
    }

    if (newPassword === oldPassword) {
      setError('New password cannot be the same as the old one.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    // All good → update password in localStorage
    const updatedUser = { ...storedUser, password: newPassword };
    localStorage.setItem('auth', JSON.stringify(updatedUser));

    setSuccess('Password changed successfully!');
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });

    setTimeout(() => {
      setSuccess('');
      setShowModal(false);
    }, 1500);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto mt-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">👩‍💼 User Profile</h2>

      <div className="space-y-4 text-gray-700">
        <div><span className="font-semibold">User Id:</span> {userData.id}</div>
        <div><span className="font-semibold">Name:</span> {userData.name}</div>
        <div><span className="font-semibold">Email:</span> {userData.email}</div>
        <div><span className="font-semibold">Role:</span> {userData.role}</div>
      </div>

      <div className="mt-6">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          onClick={() => setShowModal(true)}
        >
          Change Password
        </button>
      </div>

      {/* 🔐 Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold text-indigo-700 mb-4">🔐 Change Password</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="password"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Current Password"
              />
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="New Password"
              />
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Confirm New Password"
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
