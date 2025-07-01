import React from 'react';

const achievements = [
  {
    id: 1,
    title: 'Sprint Champion - Q2 2024',
    description: 'Awarded for leading the sprint with high-quality deliverables.',
    date: '2024-06-01'
  },
  {
    id: 2,
    title: 'Client Appreciation',
    description: 'Received direct appreciation from Acme Corp for quick turnaround.',
    date: '2024-05-25'
  },
  {
    id: 3,
    title: 'Bug Buster Award',
    description: 'Resolved the highest number of critical issues in May.',
    date: '2024-05-20'
  }
];

const MyAchievements = () => {
  return (
    <div className="pt-10 px-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">🏆 My Achievements</h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {achievements.map((ach) => (
          <div
            key={ach.id}
            className="bg-white border border-indigo-100 p-4 rounded-lg shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-indigo-800">{ach.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{ach.description}</p>
            <p className="text-xs text-gray-500 mt-2">📅 {ach.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAchievements;
