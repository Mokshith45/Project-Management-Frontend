import React from 'react';

const Button = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium tracking-wide transition"
    >
      {children}
    </button>
  );
};

export default Button;
