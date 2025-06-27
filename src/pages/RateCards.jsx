import React, { useState } from 'react';

const initialRateCard = [
  { id: 1, role: 'Junior Developer', rate: 1500 },
  { id: 2, role: 'Senior Developer', rate: 3000 },
  { id: 3, role: 'Advanced Developer', rate: 5000 },
];

const RateCards = () => {
  const [rates, setRates] = useState(initialRateCard);

  const handleRateChange = (id, newRate) => {
    const updatedRates = rates.map((item) =>
      item.id === id ? { ...item, rate: newRate } : item
    );
    setRates(updatedRates);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Global Rate Card (INR per Hour)</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-xl shadow-md border border-gray-200">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Hourly Rate (₹)</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Update</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="px-6 py-4 text-gray-700">{item.role}</td>
                <td className="px-6 py-4">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleRateChange(item.id, parseInt(e.target.value))}
                    className="w-32 px-2 py-1 border border-gray-300 rounded-md"
                  />
                </td>
                <td className="px-6 py-4">
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm">
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RateCards;
