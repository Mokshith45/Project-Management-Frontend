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
  const [budgetLeft, setBudgetLeft] = useState(0);
  const [issueData, setIssueData] = useState([]);
  const [highlightsData, setHighlightsData] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [budget, setBudget] = useState(0);
  const [spent, setSpent] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      const decoded = jwtDecode(token);
      const id = decoded.id;
      setUserId(id);

      axios.get(`http://localhost:8080/api/users/${id}`)
        .then(res => setUserName(res.data.userName || 'User'))
        .catch(() => setUserName('User'));

      axios.get(`http://localhost:8080/api/projects/lead/${id}`)
        .then(res => {
          const project = res.data;
          const projectId = project.id;
          const totalBudget = project.budget || 1;
          setBudget(totalBudget);

          axios.get(`http://localhost:8080/api/projects/${projectId}/budget-spent`)
            .then(res => {
              const spentAmt = res.data || 0;
              setSpent(spentAmt);
              const left = ((totalBudget - spentAmt) / totalBudget) * 100;
              setBudgetLeft(left);
            })
            .catch(err => {
              console.error("Error fetching budget spent:", err);
              setBudgetLeft(0);
            });

          axios.get(`http://localhost:8080/api/issues/project/${projectId}`)
            .then(res => {
              const severityMap = {};
              res.data.forEach(issue => {
                severityMap[issue.severity] = (severityMap[issue.severity] || 0) + 1;
              });
              setIssueData(Object.entries(severityMap).map(([key, value]) => ({ name: key, value })));
            });

          axios.get(`http://localhost:8080/api/highlights/project/${projectId}`)
            .then(res => {
              const monthMap = {};
              res.data.forEach(h => {
                const month = new Date(h.createdOn).toLocaleString('default', { month: 'short' });
                monthMap[month] = (monthMap[month] || 0) + 1;
              });
              setHighlightsData(Object.entries(monthMap).map(([month, count]) => ({ month, count })));
            });

          setTimelineData([
            { stage: 'Design', days: 10 },
            { stage: 'Development', days: 20 },
            { stage: 'Testing', days: 8 },
            { stage: 'UAT', days: 5 },
            { stage: 'Release', days: 2 }
          ]);
        })
        .catch(err => console.error("Error fetching project:", err));
    } catch (err) {
      console.error('Invalid token');
    }
  }, []);

  if (!userId) return <div className="p-6">Loading user...</div>;

  const isOverBudget = budgetLeft < 0;
  const displayBudget = Math.min(Math.abs(budgetLeft), 100).toFixed(2);
  const progressColor = isOverBudget ? '#EF4444' : '#4F46E5';
  const statusLabel = isOverBudget ? 'Over Budget 🚨' : 'Budget Left 💰';
  const headerColor = isOverBudget ? 'text-red-600' : 'text-indigo-600';

  const currencyFormat = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
  const spentDisplay = `${currencyFormat.format(spent)} spent of ${currencyFormat.format(budget)}`;

  return (
    <div className="pt-5 px-6">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow mb-6">
        <h2 className="text-2xl font-semibold">Hello, {userName} 👋</h2>
        <p className="text-sm text-white/90 mt-1">Welcome to your dashboard!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-6">
        {/* Budget Left Section */}
        <div className="bg-white rounded-xl p-4 shadow flex flex-col items-center justify-center">
          <h4 className={`text-md font-semibold mb-2 ${headerColor}`}>
            {statusLabel}
          </h4>
          <div className="w-32 h-32 mb-2">
            <CircularProgressbar
              value={displayBudget}
              text={`${displayBudget}%`}
              styles={buildStyles({
                textColor: progressColor,
                pathColor: progressColor,
                trailColor: '#E5E7EB',
              })}
            />
          </div>
          <p className="text-sm text-gray-600">{spentDisplay}</p>
        </div>

        {/* Issue Severity */}
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

        {/* Highlights */}
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

        {/* Timeline */}
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
