import React from 'react';

const ResourceBreakdown = ({ requiredResources = [], allocatedResources = [] }) => {
  // Calculate total required and allocated
  const totalRequired = requiredResources.reduce((sum, res) => sum + res.quantity, 0);
  const totalAllocated = allocatedResources.length;

  const getBarColor = () => {
    if (totalAllocated === totalRequired) return 'bg-green-500';
    return totalAllocated < totalRequired ? 'bg-red-500' : 'bg-orange-500';
  };

  const percentage = totalRequired === 0 ? 0 : Math.min((totalAllocated / totalRequired) * 100, 100);

  const getStatusText = () => {
    if (totalAllocated === totalRequired) return '✔ Resources perfectly allocated';
    if (totalAllocated < totalRequired) return `⚠ Under-allocated by ${totalRequired - totalAllocated}`;
    return `❌ Over-allocated by ${totalAllocated - totalRequired}`;
  };

  const getStatusColor = () => {
    if (totalAllocated === totalRequired) return 'text-green-700';
    return totalAllocated < totalRequired ? 'text-orange-700' : 'text-red-700';
  };

  return (
    <div className="mt-10 bg-white p-6 rounded-xl border border-gray-200 shadow">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Resource Allocation Overview</h2>

      <div className="flex justify-between text-sm text-gray-700 mb-1">
        <span>
          <strong>Allocated:</strong> {totalAllocated}
        </span>
        <span>
          <strong>Required:</strong> {totalRequired}
        </span>
      </div>

      <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      <p className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</p>
    </div>
  );
};

export default ResourceBreakdown;
