import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const UserHome = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [projectCompletion, setProjectCompletion] = useState(0);
  const [issueData, setIssueData] = useState([]);
  const [highlightsData, setHighlightsData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    console.log('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    try {
      const decoded = jwtDecode(token);
      const id = decoded.id;
      setUserId(id);

      // Fetch user details (only to get userName)
      axios.get(`http://localhost:8080/api/users/${id}`)
        .then(res => {
          setUserName(res.data.userName || '');
        })
        .catch(() => setUserName('User'));

      // Now use id to fetch project
      axios.get(`http://localhost:8080/api/projects/lead/${id}`)
        .then(res => {
          const project = res.data;
          const projectId = project.id;
          setProjectCompletion(72); // dummy completion

          // Fetch issues
          axios.get(`http://localhost:8080/api/projects/lead/${id}`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
})
.then(res => {
  const project = res.data;
  const projectId = project.id;
  setProjectCompletion(72);

  // Now fetch issues with the same header
  axios.get(`http://localhost:8080/api/issues/project/${projectId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
  .then(res => {
    const issues = res.data;
    const severityMap = {};
    issues.forEach(issue => {
      severityMap[issue.severity] = (severityMap[issue.severity] || 0) + 1;
    });
    const chartData = Object.keys(severityMap).map(key => ({ name: key, value: severityMap[key] }));
    setIssueData(chartData);
  });
});


          // Fetch highlights
          axios.get(`http://localhost:8080/api/highlights/project/${projectId}`)
            .then(res => {
              const highlights = res.data;
              const monthMap = {};
              highlights.forEach(h => {
                const month = new Date(h.createdOn).toLocaleString('default', { month: 'short' });
                monthMap[month] = (monthMap[month] || 0) + 1;
              });
              const highlightsData = Object.entries(monthMap).map(([month, count]) => ({ month, count }));
              setHighlightsData(highlightsData);
            });

          // Static timeline data
          setTimelineData([
            { stage: 'Design', days: 10 },
            { stage: 'Development', days: 20 },
            { stage: 'Testing', days: 8 },
            { stage: 'UAT', days: 5 },
            { stage: 'Release', days: 2 }
          ]);
        });
    } catch (err) {
      console.error('Invalid token');
    }
  }, []);

  if (!userId) return <div className="p-6">Loading user...</div>;

  return (
    <div className="pt-5 px-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold">Hello, {userName || 'User'} 👋</h2>
        <p className="text-sm text-white/90 mt-1">Welcome to your dashboard!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
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
                  <Cell key={`cell-${index}`} fill={["#10B981", "#3B82F6", "#FBBF24", "#EF4444"][index % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

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
