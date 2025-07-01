import React from 'react';

const sampleProject = {
  id: 1,
  projectName: "Website Redesign",
  type: "Internal",
  department: "Engineering",
  status: "ACTIVE",
  clientId: 101,
  resourceIds: [201, 202],
  highlightIds: [301],
  contractId: 401,
  projectRateCardId: 501,
  budgets: 750000,
  contactPersonId: 601,
  managerId: 701,
  projectLeadId: 801,
};

const MyProject = () => {
  const {
    projectName,
    type,
    department,
    status,
    budgets,
  } = sampleProject;

  return (
    <div className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-xl p-6 space-y-6 text-gray-800">
  <h3 className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4">
    📁 Project Info
  </h3>

  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 ">
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium">Project Name</span>
      <span className="mt-1 font-semibold text-gray-800">Website Revamp</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium">Type</span>
      <span className="mt-1 font-semibold text-gray-800">Internal</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium">Department</span>
      <span className="mt-1 font-semibold text-gray-800">Technology</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium">Status</span>
      <span className="mt-1 font-semibold text-green-600">Active</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium">Budget</span>
      <span className="mt-1 font-semibold text-gray-800">₹5,00,000</span>
    </div>
    <div className="flex flex-col">
      <span className="text-gray-500 font-medium">Lead</span>
      <span className="mt-1 font-semibold text-gray-800">Harika</span>
    </div>
  </div>
</div>

  );
};

export default MyProject;
