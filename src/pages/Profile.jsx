import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Utility function to capitalize first letter of each word
const capitalizeName = (name) => {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const Profile = () => {
  const [adminData, setAdminData] = useState({
    id: '',
    name: '',
    email: '',
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAdminDetails = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found. Please log in.');
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const res = await axios.get(`http://localhost:8080/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAdminData({
          id: res.data.id || '',
          name: capitalizeName(res.data.userName || ''),
          email: res.data.email || '',
        });
      } catch (err) {
        setError('Failed to fetch admin data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-20 text-indigo-600 font-medium">
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-20 text-red-600 font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Admin Profile</h2>

      <div className="space-y-5 text-gray-800 text-base">
        <div>
          <span className="font-semibold">Name:</span> {adminData.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {adminData.email}
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md shadow transition duration-200">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
