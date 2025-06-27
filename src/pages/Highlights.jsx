import React from 'react';

const dummyData = [
  {
    clientName: 'Acme Corp',
    projects: [
      {
        name: 'Website Revamp',
        highlights: [
          {
            id: 1,
            desc: 'MVP Released',
            featuresAdded: 'Login, Dashboard, Reports',
            createdOn: '2024-05-10',
            releaseVersion: 'v1.0'
          },
          {
            id: 2,
            desc: 'User Feedback Round',
            featuresAdded: 'Bug Fixes, UI Polish',
            createdOn: '2024-06-05',
            releaseVersion: 'v1.1'
          }
        ]
      },
      {
        name: 'Internal Tool Migration',
        highlights: [
          {
            id: 3,
            desc: 'Backend Refactored',
            featuresAdded: 'Spring Boot upgrade',
            createdOn: '2024-05-25',
            releaseVersion: 'v2.0'
          }
        ]
      }
    ]
  },
  {
    clientName: 'Globex Inc',
    projects: [
      {
        name: 'Compliance Portal',
        highlights: [
          {
            id: 4,
            desc: 'Phase 1 Completed',
            featuresAdded: 'Roles, Permissions, Audit Logs',
            createdOn: '2024-06-01',
            releaseVersion: 'v1.0'
          }
        ]
      }
    ]
  }
];

const Highlights = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Client-wise Highlights</h2>
      {dummyData.map((client, idx) => (
        <div key={idx} className="mb-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b border-indigo-300 pb-2">
            🏢 {client.clientName}
          </h3>
          {client.projects.map((project, pIdx) => (
            <div key={pIdx} className="mb-6 ml-4">
              <h4 className="text-lg font-semibold text-indigo-600 mb-2">📁 {project.name}</h4>
              <ol className="relative border-l border-indigo-300 ml-2">
                {project.highlights.map((hl) => (
                  <li key={hl.id} className="mb-6 ml-6">
                    <span className="absolute w-4 h-4 bg-indigo-600 rounded-full -left-2 top-1"></span>
                    <h5 className="font-semibold text-indigo-700">{hl.desc}</h5>
                    <p className="text-sm text-gray-600 mb-1">
                      Features Added: {hl.featuresAdded}
                    </p>
                    <p className="text-sm text-gray-500">
                      📅 {hl.createdOn} | 🔖 Version: {hl.releaseVersion}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Highlights;
