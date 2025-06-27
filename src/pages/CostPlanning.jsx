import React, { useState } from 'react';

const rateMap = {
  'Junior Developer': 1500,
  'Senior Developer': 3000,
  'Advanced Developer': 5000,
};

const CostPlanning = () => {
  const [form, setForm] = useState({
    resourceType: 'Junior Developer',
    count: 1,
    hoursPerMonth: 160,
    months: 1,
    budget: 200000,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculatedCost =
    form.count * form.hoursPerMonth * form.months * rateMap[form.resourceType];

  const budgetStatus =
    calculatedCost > form.budget
      ? { message: '🚨 Budget Deficit', color: 'text-red-600' }
      : { message: '✅ Under Budget', color: 'text-green-600' };

  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Cost Planning & Budget Monitor</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow border border-gray-200">
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Resource Type</label>
            <select
              name="resourceType"
              value={form.resourceType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            >
              {Object.keys(rateMap).map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Number of Resources</label>
            <input
              type="number"
              name="count"
              value={form.count}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              min="1"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Hours per Month</label>
            <input
              type="number"
              name="hoursPerMonth"
              value={form.hoursPerMonth}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              min="1"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Duration (Months)</label>
            <input
              type="number"
              name="months"
              value={form.months}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
              min="1"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Client Quoted Budget (₹)</label>
            <input
              type="number"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center bg-indigo-50 rounded-xl p-6">
          <p className="text-xl font-semibold mb-2">💰 Calculated Project Cost:</p>
          <p className="text-3xl font-bold text-indigo-700 mb-4">
            ₹ {calculatedCost.toLocaleString('en-IN')}
          </p>
          <p className={`text-lg font-medium ${budgetStatus.color}`}>
            {budgetStatus.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CostPlanning;
