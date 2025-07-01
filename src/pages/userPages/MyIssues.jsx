import React, { useState, useEffect } from 'react';

const statusStyles = {
  Open: 'text-red-600 bg-red-100',
  'In Progress': 'text-yellow-600 bg-yellow-100',
  Closed: 'text-green-600 bg-green-100'
};

const MyIssues = () => {
  // 🔒 Assume project ID is pulled from some context or user assignment
  const currentProjectId = 101;

  const [issues, setIssues] = useState([
    {
      id: 1,
      title: 'Login page crashes on Safari',
      description: 'Users are unable to login using Safari on iOS 16.',
      createdOn: '2024-06-01',
      priority: 'High',
      status: 'Open',
      projectId: currentProjectId,
      createdBy: 'harika@user.com'
    },
    {
      id: 2,
      title: 'Slow dashboard loading',
      description: 'Dashboard takes more than 10 seconds to load.',
      createdOn: '2024-06-05',
      priority: 'Medium',
      status: 'Open',
      projectId: currentProjectId,
      createdBy: 'harika@user.com'
    },
    {
      id: 3,
      title: 'Typo in footer links',
      description: 'Misspelling in "Terms & Conditions".',
      createdOn: '2024-06-10',
      priority: 'Low',
      status: 'Closed',
      projectId: currentProjectId,
      createdBy: 'harika@user.com'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    severity: 'Medium',
    createdBy: '',
    status: 'Open',
    projectId: currentProjectId
  });

  const handleChange = (e) => {
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  };

  const handleAddIssue = (e) => {
    e.preventDefault();

    const newEntry = {
      ...newIssue,
      id: issues.length + 1,
      createdOn: new Date().toISOString().split('T')[0]
    };

    setIssues([...issues, newEntry]);
    setShowModal(false);
    setNewIssue({
      title: '',
      description: '',
      severity: 'Medium',
      createdBy: '',
      status: 'Open',
      projectId: currentProjectId
    });
  };

  return (
    <div className="pt-10 px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">🐞 My Project Issues</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          ➕ Add Issue
        </button>
      </div>

      {/* Issue List */}
      <div className="space-y-4">
        {issues.map((issue) => (
          <div
            key={issue.id}
            className="bg-white border border-indigo-100 rounded-lg shadow p-4"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{issue.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                <p className="text-xs text-gray-500 mt-1">📅 Created On: {issue.createdOn}</p>
                <p className="text-xs text-gray-500">🔥 Severity: {issue.severity}</p>
                <p className="text-xs text-gray-500">📁 Project ID: {issue.projectId}</p>
                <p className="text-xs text-gray-500">👤 Created By: {issue.createdBy}</p>
              </div>
              <span
                className={`px-3 py-1 text-sm font-medium rounded-full h-fit ${statusStyles[issue.status]}`}
              >
                {issue.status}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-lg"
            >
              ✖
            </button>
            <h3 className="text-xl font-bold text-indigo-700 mb-4">➕ New Issue</h3>
            <form onSubmit={handleAddIssue} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newIssue.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Issue Title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Severity</label>
                <select
                  name="severity"
                  value={newIssue.severity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option>Urgent</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newIssue.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={3}
                  placeholder="Describe the issue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Created By</label>
                <input
                  type="text"
                  name="createdBy"
                  value={newIssue.createdBy}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  placeholder="Your name or email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={newIssue.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Closed</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Submit Issue
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyIssues;
