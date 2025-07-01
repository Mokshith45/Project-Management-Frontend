import React, { useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import BxaLogo from '../../assets/logobxa.png';

const SignUp = () => {
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.email === 'mokshith@admin.com') {
      setError("You cannot register with this admin email.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.some((user) => user.email === form.email);

    if (userExists) {
      setError('User already exists!');
      return;
    }

    users.push({
      name: form.name,
      email: form.email,
      password: form.password,
      role: 'USER',
    });

    localStorage.setItem('users', JSON.stringify(users));
    navigate('/signin');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white bg-gradient-to-r from-indigo-500 to-purple-900">

      {/* Logo */}
      <header className="w-full flex justify-center mt-6">
        <Link
          to="/"
          className="flex justify-center items-center gap-3 cursor-pointer hover:opacity-90 transition"
        >
          <img src={BxaLogo} alt="Logo" className="h-16 md:h-15 w-auto object-contain" />
        </Link>
      </header>

      {/* Sign Up Form Card */}
      <div className="p-8 mt-2 bg-gradient-to-br from-indigo-700 to-purple-700 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Mokshith Garipally"
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

          {/* Error Display */}
          {error && (
            <p className="text-sm text-red-300 text-center font-medium">
              {error}
            </p>
          )}

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
