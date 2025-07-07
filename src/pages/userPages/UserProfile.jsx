import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

useEffect(() => {
  const token = localStorage.getItem('token');
  // console.log(token);
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      // console.log(userId);

        axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((res) => {
          console.log("✅ User data received from backend:", res.data); // 👉 LOG HERE
          setUserData(res.data);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch user data:", err);
          setError('Failed to fetch user data.');
        });
    } catch (err) {
      console.error("❌ Token decoding failed:", err);
      setError('Invalid token.');
    }
  }
}, []);


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

    if (oldPassword !== userData?.password) {
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

    // If all checks pass
    const updated = { ...userData, password: newPassword };
    setUserData(updated); // You may want to send a PUT request to backend later

    setSuccess('Password changed successfully!');
    setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });

    setTimeout(() => {
      setSuccess('');
      setShowModal(false);
    }, 1500);
  };

  if (!userData) return <div>Loading user profile...</div>;

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto mt-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">👩‍💼 User Profile</h2>

      <div className="space-y-4 text-gray-700">
        <div><span className="font-semibold">User Id:</span> {userData.id}</div>
        <div><span className="font-semibold">Name:</span> {userData.userName}</div>
        <div><span className="font-semibold">Email:</span> {userData.email}</div>
        <div><span className="font-semibold">Role:</span> {userData.userType}</div>
      </div>

      <div className="mt-6">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          onClick={() => setShowModal(true)}
        >
          Change Password
        </button>
      </div>

      {/* Modal */}
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
