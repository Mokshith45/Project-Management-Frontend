import React, { useEffect, useState } from 'react';
import axios from 'axios';

const urgencyColors = {
  High: 'bg-red-100 text-red-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low: 'bg-green-100 text-green-700',
};

const OpenPositions = () => {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOpenPositions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:8080/api/open-positions', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPositions(res.data);
      } catch (err) {
        console.error('Error fetching open positions:', err);
        alert('Failed to load open positions');
      } finally {
        setLoading(false);
      }
    };

    fetchOpenPositions();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">🚧 Open Positions</h2>

      {loading ? (
        <p className="text-gray-500">Loading positions...</p>
      ) : positions.length === 0 ? (
        <p className="text-gray-600">No open positions currently available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {positions.map((position, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-indigo-800 mb-1">
                📁 Project ID: {position.projectId}
              </h3>
              <p className="text-gray-700 text-sm">
                <strong>Level:</strong> {position.level}
              </p>
              <p className="text-gray-700 text-sm">
                <strong>Needed:</strong> {position.numberRequired}
              </p>
              <p
                className={`mt-2 inline-block text-xs font-medium px-3 py-1 rounded-full shadow-sm capitalize ${
                  urgencyColors[position.urgency] || 'bg-gray-100 text-gray-700'
                }`}
              >
                ⏰ Urgency: {position.urgency || 'Not specified'}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Optional Submit Button Placeholder */}
      <div className="mt-8 text-center">
        <button
          className="inline-flex items-center px-6 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 transition"
          onClick={() => alert('Submit functionality coming soon!')}
        >
          ➕ Notify New Position
        </button>
      </div>
    </div>
  );
};

export default OpenPositions;
