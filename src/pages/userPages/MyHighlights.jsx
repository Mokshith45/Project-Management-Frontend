import React, { useState } from 'react';

const dummyProject = {
  clientName: 'Acme Corp',
  projectName: 'Website Revamp',
  projectId: 101,
  highlights: [
    {
      id: 1,
      description: 'MVP Released',
      createdOn: '2024-05-10',
      projectId: 101,
    },
    {
      id: 2,
      description: 'User Feedback Round',
      createdOn: '2024-06-05',
      projectId: 101,
    },
    {
      id: 3,
      description: 'API Enhancement',
      createdOn: '2024-06-20',
      projectId: 101,
    }
  ]
};

const MyHighlights = () => {
  const { clientName, projectName, projectId } = dummyProject;
  const [highlights, setHighlights] = useState(dummyProject.highlights);
  const [showModal, setShowModal] = useState(false);
  const [newHighlight, setNewHighlight] = useState({
    description: ''
  });

  const handleChange = (e) => {
    setNewHighlight({ ...newHighlight, [e.target.name]: e.target.value });
  };

  const handleAddHighlight = (e) => {
    e.preventDefault();
    const newEntry = {
      id: highlights.length + 1,
      description: newHighlight.description,
      createdOn: new Date().toISOString().split('T')[0],
      projectId: projectId // auto-assigned from current project
    };
    setHighlights([...highlights, newEntry]);
    setShowModal(false);
    setNewHighlight({ description: '' });
  };

  return (
    <div className="pt-5 px-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">📌 Project Highlights</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          ➕ Add Highlight
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-1">🏢 {clientName}</h3>
        <h4 className="text-lg text-indigo-600 font-semibold">📁 {projectName}</h4>
      </div>

      <ol className="relative border-l border-indigo-300 ml-2">
        {highlights.map((hl) => (
          <li key={hl.id} className="mb-6 ml-6">
            <span className="absolute w-4 h-4 bg-indigo-600 rounded-full -left-2 top-1"></span>
            <h5 className="font-semibold text-indigo-700">{hl.description}</h5>
            <p className="text-sm text-gray-500">
              🗓️ {hl.createdOn} | 📁 Project ID: {hl.projectId}
            </p>
          </li>
        ))}
      </ol>

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
            <h3 className="text-xl font-bold text-indigo-700 mb-4">➕ New Highlight</h3>
            <form onSubmit={handleAddHighlight} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={newHighlight.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                  rows={3}
                  placeholder="Describe the highlight"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
              >
                Submit Highlight
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyHighlights;
