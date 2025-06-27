import React from 'react';

const openPositions = [
  {
    id: 1,
    projectName: 'Website Revamp',
    level: 'Senior Developer',
    numberRequired: 2,
    urgency: 'High',
  },
  {
    id: 2,
    projectName: 'Compliance Portal',
    level: 'Junior Developer',
    numberRequired: 3,
    urgency: 'Medium',
  },
  {
    id: 3,
    projectName: 'Internal Tool Migration',
    level: 'Advanced Developer',
    numberRequired: 1,
    urgency: 'Low',
  },
];

const urgencyColors = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const OpenPositions = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Open Positions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {openPositions.map((position) => (
          <div
            key={position.id}
            className="bg-white rounded-xl border border-gray-200 shadow-md p-5 hover:shadow-lg transition"
          >
            <h3 className="text-lg font-semibold text-indigo-800 mb-1">
              📁 {position.projectName}
            </h3>
            <p className="text-gray-700 text-sm">
              <strong>Role:</strong> {position.level}
            </p>
            <p className="text-gray-700 text-sm">
              <strong>Needed:</strong> {position.numberRequired}
            </p>
            <p className="mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full shadow-sm capitalize 
              {`${urgencyColors[position.urgency]}`}">
              ⏰ Urgency: {position.urgency}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OpenPositions;
