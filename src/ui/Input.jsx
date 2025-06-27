import React from 'react';

const Input = ({ label, type = 'text', ...props }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-200 mb-1">{label}</label>
      <input
        type={type}
        className="w-full px-4 py-2 bg-white/10 text-white border border-indigo-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-gray-400"
        {...props}
      />
    </div>
  );
};

export default Input;
