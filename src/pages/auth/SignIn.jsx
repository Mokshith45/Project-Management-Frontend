import React, { useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { Link, useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '', role: 'USER' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValidAdmin =
      form.email === 'mokshith@admin.com' &&
      form.password === 'admin' &&
      form.role === 'ADMIN';

    if (isValidAdmin) {
      // Store session (optional token in future)
      localStorage.setItem(
        'auth',
        JSON.stringify({ email: form.email, role: form.role })
      );

      // Redirect to dashboard
      navigate('/');
    } else {
      setError('Invalid credentials or role.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-800 to-purple-800 text-white">
      <div className="bg-white/10 p-8 rounded-xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
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
          <div className="mb-4">
            <label className="block text-sm text-gray-200 mb-1">Role</label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/10 text-white border border-indigo-300 rounded-md"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-300 text-center font-medium">
              {error}
            </p>
          )}

          <Button type="submit">Sign In</Button>
        </form>

        <p className="text-sm mt-4 text-gray-300 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="underline text-indigo-300">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
