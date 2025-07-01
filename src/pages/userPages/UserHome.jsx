import React from 'react';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const UserHome = () => {
  const auth = JSON.parse(localStorage.getItem('auth'));
  const username = auth?.email?.split('@')[0] || 'User'; 
  const highlights = [
    "🚀 MVP Released.",
    "📢 User Feedback Round.",
    "🎯 API Enhancement."
  ];

  const clients = ["Client A", "Client B", "Client C", "Client D", "Client E"];
  const projects = ["Alpha", "Beta", "Gamma", "Delta", "Epsilon"];

  const issueData = [
    { name: 'Low', value: 5 },
    { name: 'Medium', value: 8 },
    { name: 'High', value: 3 },
    { name: 'Urgent', value: 2 }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#FBBF24', '#EF4444'];

  const highlightsData = [
    { month: 'Jan', count: 1 },
    { month: 'Feb', count: 2 },
    { month: 'Mar', count: 3 },
    { month: 'Apr', count: 1 },
    { month: 'May', count: 2 },
    { month: 'Jun', count: 3 }
  ];

  const timelineData = [
    { stage: 'Design', days: 10 },
    { stage: 'Development', days: 20 },
    { stage: 'Testing', days: 8 },
    { stage: 'UAT', days: 5 },
    { stage: 'Release', days: 2 }
  ];

  const projectCompletion = 72;

  const carouselSettings = {
    autoplay: true,
    autoplaySpeed: 3000,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    pauseOnHover: false,
  };

  return (
    <div className="pt-10 px-6">

      {/* 🔁 Announcement Banner */}
      <div className="w-full fixed top-16 left-0 z-40 bg-blue-100 border-y border-blue-300">
        <Slider {...carouselSettings}>
          {highlights.map((text, index) => (
            <div key={index} className="text-center py-2 text-blue-900 font-medium">
              {text}
            </div>
          ))}
        </Slider>
      </div>

      {/* 👋 Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold">Hello, {username} 👋</h2>
        <p className="text-sm text-white/90 mt-1">Welcome to your dashboard!</p>
      </div>

      {/* 📊 Dashboard Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
        
        {/* Donut */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h4 className="text-center text-md font-semibold mb-4">Project Completion</h4>
          <div className="w-32 h-32 mx-auto">
            <CircularProgressbar
              value={projectCompletion}
              text={`${projectCompletion}%`}
              styles={buildStyles({
                textColor: '#4F46E5',
                pathColor: '#4F46E5',
                trailColor: '#E5E7EB',
              })}
            />
          </div>
        </div>

        {/* Pie */}
        <div className="bg-white rounded-xl p-4 shadow">
          <h4 className="text-center text-md font-semibold mb-4">Issue Severity</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={issueData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={70}
                fill="#8884d8"
                dataKey="value"
              >
                {issueData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line */}
        <div className="bg-white rounded-xl p-4 shadow col-span-1 md:col-span-2">
          <h4 className="text-md font-semibold mb-4 text-center">Highlights Over Time</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={highlightsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Scatter */}
        <div className="bg-white rounded-xl p-4 shadow col-span-1 md:col-span-2">
          <h4 className="text-md font-semibold mb-4 text-center">Project Timeline (Days per Phase)</h4>
          <ResponsiveContainer width="100%" height={250}>
            <ScatterChart>
              <CartesianGrid />
              <XAxis dataKey="stage" type="category" />
              <YAxis dataKey="days" name="Days" />
              <ZAxis range={[100]} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Legend />
              <Scatter name="Timeline" data={timelineData} fill="#6366F1" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
