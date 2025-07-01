import React, { useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { Link } from 'react-router-dom';
import BxaLogo from '../../assets/logobxa.png'

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    // TODO: Call register API
    console.log('Registering:', form);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-r from-indigo-500 to-purple-900">

      {/* Centered Logo */}
      <header className="w-full flex justify-center mt-6">
        <Link
          to="/"
          className="flex justify-center items-center gap-3 cursor-pointer hover:opacity-90 transition"
        >
          <img
            src={BxaLogo}
            alt="Logo"
            className="h-28 md:h-36 w-auto object-contain"
          />
        </Link>
      </header>

      {/* Form Container */}
      <div className="p-8 mt-2 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Garipally Mokshith"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
          />
          <div>
            <label className="block text-sm text-gray-200 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-indigo-700 text-white border border-indigo-300 rounded-md"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <Button type="submit">Sign Up</Button>
        </form>

        <p className="text-sm mt-4 text-gray-300 text-center">
          Already have an account?{' '}
          <Link to="/signin" className="underline text-indigo-300">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
