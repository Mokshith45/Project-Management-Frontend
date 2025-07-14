import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BudgetSection = ({ projectId, budgetQuoted, allocatedResources }) => {
  const [budgetSpent, setBudgetSpent] = useState(0);
  const [resourceCosts, setResourceCosts] = useState([]);
  const [status, setStatus] = useState('loading');

  const WORKING_DAYS_PER_YEAR = 235;
  const DAYS_IN_YEAR = 365;

  useEffect(() => {
    const fetchRatesAndCalculate = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch project & global rate cards
        const [projectRatesRes, globalRatesRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/ratecards/project/${projectId}`, { headers }),
          axios.get(`http://localhost:8080/api/ratecards/global`, { headers })
        ]);

        const projectRateMap = Object.fromEntries(
          (projectRatesRes.data || []).map(r => [r.level, r.rate])
        );

        const globalRateMap = Object.fromEntries(
          (globalRatesRes.data || []).map(r => [r.level, r.rate])
        );

        // Calculate cost per resource
        let totalSpent = 0;
        const resourceCosts = (allocatedResources || []).map((res) => {
          const start = new Date(res.startDate);
          const end = new Date(res.endDate);
          const daysTotal = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

          const workingDays = Math.round((daysTotal / DAYS_IN_YEAR) * WORKING_DAYS_PER_YEAR);
          const rate = projectRateMap[res.level] || globalRateMap[res.level] || 0;
          const cost = workingDays * rate;

          totalSpent += cost;

          return {
            name: res.resourceName,
            level: res.level,
            workingDays,
            rate,
            cost,
          };
        });

        setResourceCosts(resourceCosts);
        setBudgetSpent(totalSpent);

        // Determine budget status
        if (Math.abs(totalSpent - budgetQuoted) < 50) {
          setStatus('exact');
        } else if (totalSpent < budgetQuoted) {
          setStatus('surplus');
        } else {
          setStatus('deficit');
        }
      } catch (error) {
        console.error('Error calculating budget:', error);
      }
    };

    if (projectId && allocatedResources?.length) {
      fetchRatesAndCalculate();
    }
  }, [projectId, allocatedResources, budgetQuoted]);

  const getStatusText = () => {
    if (status === 'exact') return 'Budget perfectly utilized';
    if (status === 'deficit') return `⚠ Over budget by ₹ ${(budgetSpent - budgetQuoted).toLocaleString()}`;
    if (status === 'surplus') return ` Surplus₹ ${(budgetQuoted - budgetSpent).toLocaleString()}`;
    return '';
  };

  const getProgressColor = () => {
    if (status === 'exact') return 'bg-blue-500';
    if (status === 'deficit') return 'bg-red-500';
    if (status === 'surplus') return 'bg-red-500';
    return 'bg-gray-300';
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-xl border border-gray-200 shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">💰 Budget Breakdown</h2>

      <div className="flex justify-between text-sm text-gray-800 mb-2">
        <p><strong>Budget Quoted:</strong> ₹ {budgetQuoted.toLocaleString()}</p>
        <p><strong>Budget Spent:</strong> ₹ {budgetSpent.toLocaleString()}</p>
      </div>

      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${getProgressColor()} transition-all duration-500`}
          style={{ width: `${Math.min((budgetSpent / budgetQuoted) * 100, 100)}%` }}
        ></div>
      </div>

      <p className={`text-sm font-medium mt-1 ${
        status === 'deficit'
          ? 'text-red-600'
          : status === 'surplus'
          ? 'text-red-600'
          : 'text-blue-600'
      }`}>
        {getStatusText()}
      </p>

      {/* Breakdown Table */}
      {resourceCosts.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm border border-gray-300 rounded">
            <thead className="bg-gray-100 text-gray-800 font-semibold">
              <tr>
                <th className="px-4 py-2 text-left">Resource</th>
                <th className="px-4 py-2 text-left">Level</th>
                <th className="px-4 py-2 text-left">Working Days</th>
                <th className="px-4 py-2 text-left">Rate (₹)</th>
                <th className="px-4 py-2 text-left">Total Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {resourceCosts.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.level}</td>
                  <td className="px-4 py-2">{r.workingDays}</td>
                  <td className="px-4 py-2">₹ {r.rate.toLocaleString()}</td>
                  <td className="px-4 py-2 font-semibold">₹ {r.cost.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-gray-50 font-semibold border-t">
              <tr>
                <td colSpan="4" className="text-right px-4 py-2">Grand Total</td>
                <td className="px-4 py-2 text-indigo-800">₹ {budgetSpent.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
};

export default BudgetSection;
