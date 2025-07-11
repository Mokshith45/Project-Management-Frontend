import React, { useState } from 'react';
import Input from '../../ui/Input';
import Button from '../../ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import BxaLogo from '../../assets/logobxa.png';
import { login } from '../../api/auth';
import { jwtDecode } from 'jwt-decode';
import BgVideo from '../../assets/loading.mp4'; 


const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await login(form);
      const token = res.data;
      const decoded = jwtDecode(token);
      localStorage.setItem('token', token);
      localStorage.setItem('role', decoded.role);
      navigate('/');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        setError('Something went wrong. Try again.');
      }
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col text-white">
      {/* 🎥 Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        src={BgVideo}
        autoPlay
        muted
        loop
        playsInline
      ></video>

      {/* 🌓 Dark Overlay for contrast */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 z-10"></div>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col flex-grow">
        <header className="flex p-4">
          {/* <Link
            to="/"
            className="flex items-center gap-3 pl-1 cursor-pointer hover:opacity-90 transition"
          >
            <img
              src={BxaLogo}
              alt="Logo"
              className="h-28 md:h-16 w-auto object-contain"
            />
          </Link> */}
        </header>

        <main className="flex-grow flex items-center justify-center px-4">
          <div className="bg-white/10 p-8 rounded-xl shadow-xl w-full max-w-md backdrop-blur-md">
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
    </div>
  );
};

export default SignIn;
