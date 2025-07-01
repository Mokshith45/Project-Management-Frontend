import React, { useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import BxaLogo from '../../assets/logobxa.png';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValidAdmin =
      form.email === 'mokshith@admin.com' && form.password === 'admin';

    if (isValidAdmin) {
      localStorage.setItem(
        'auth',
        JSON.stringify({ email: form.email, role: 'ADMIN' })
      );
      navigate('/');
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white bg-gradient-to-r from-indigo-500 to-purple-900">
      <header className="flex justify-center p-4">
        <Link
          to="/"
          className="flex items-center gap-3 pl-1 cursor-pointer hover:opacity-90 transition"
        >
          <img
            src={BxaLogo}
            alt="Logo"
            className="h-28 md:h-36 w-auto object-contain"
          />
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white/10 p-8 rounded-xl shadow-xl w-full max-w-md bg-gradient-to-br from-indigo-700 to-purple-700">
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
      </main>
    </div>
  );
};

export default SignIn;
