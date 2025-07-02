import React from 'react';
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ScatterChart, Scatter, ZAxis, Legend
} from 'recharts';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

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

const UserDashboard = () => {
  const projectCompletion = 72; // Example completion percent

  return (
    <div className="p-6 pt-24 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">📊 Dashboard Overview</h2>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
        
        {/* Project Completion Donut */}
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

        {/* Issue Severity Pie */}
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

        {/* Highlights Over Time */}
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

        {/* Project Timeline Scatter */}
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

export default UserDashboard;
