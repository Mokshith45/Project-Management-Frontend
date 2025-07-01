import React from 'react';

const Profile = () => {
  const adminData = {
    id: 'ADM001',
    name: 'Garipally Mokshith',
    email: 'mokshith@admin.com',
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Admin Profile</h2>

      <div className="space-y-5 text-gray-800 text-base">
        <div>
          <span className="font-semibold">ID:</span> {adminData.id}
        </div>
        <div>
          <span className="font-semibold"> Name:</span> {adminData.name}
        </div>
        <div>
          <span className="font-semibold"> Email:</span> {adminData.email}
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
