import React from 'react';

const dummyProjects = [
  {
    id: 1,
    title: 'Website Revamp',
    duration: 'Jan 2024 - May 2024',
    type: 'Development',
    client: 'Acme Corp',
    required: 5,
    allocated: 4,
    status: 'Ongoing',
  },
  {
    id: 2,
    title: 'Infrastructure Audit',
    duration: 'Mar 2024 - Apr 2024',
    type: 'Consulting',
    client: 'Globex Inc',
    required: 2,
    allocated: 2,
    status: 'Completed',
  },
  {
    id: 3,
    title: 'Product Support Q2',
    duration: 'Apr 2024 - Jun 2024',
    type: 'Support',
    client: 'Initech',
    required: 3,
    allocated: 1,
    status: 'On Hold',
  },
];

const statusColors = {
  Ongoing: 'bg-yellow-100 text-yellow-800',
  Completed: 'bg-green-100 text-green-800',
  'On Hold': 'bg-red-100 text-red-800',
};

const Projects = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Projects Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyProjects.map((project) => {
          const mismatch = project.allocated < project.required;
          return (
            <div
              key={project.id}
              className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{project.title}</h3>
                <p className="text-sm text-gray-500">{project.duration}</p>
              </div>

              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Client:</strong> {project.client}</p>
                <p><strong>Type:</strong> {project.type}</p>
                <p>
                  <strong>Resources:</strong> {project.allocated} / {project.required}
                  {mismatch && (
                    <span className="ml-2 text-xs text-red-600 font-semibold">
                      ⚠️ Mismatch
                    </span>
                  )}
                </p>
                <p>
                  <strong>Status:</strong>{' '}
                  <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;
