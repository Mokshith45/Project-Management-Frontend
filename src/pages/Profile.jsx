import React from 'react';

const Profile = () => {
  const adminData = {
    name: 'Mokshith Garipally',
    email: 'mokshith@admin.com',
    role: 'Admin',
    lastLogin: 'June 29, 2025 12:44 AM',
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">👤 Admin Profile</h2>

      <div className="space-y-4 text-gray-700">
        <div>
          <span className="font-semibold">Name:</span> {adminData.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {adminData.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {adminData.role}
        </div>
        <div>
          <span className="font-semibold">Last Login:</span> {adminData.lastLogin}
        </div>
      </div>

      <div className="mt-6">
        <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition">
          Change Password
        </button>
      </div>
    </div>
  );
};

export default Profile;
