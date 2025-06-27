import React from 'react';

const dummyClients = [
  {
    id: 1,
    name: 'Acme Corp',
    logo: 'https://via.placeholder.com/40',
    contact: 'contact@acme.com',
    totalProjects: 5,
    totalSpend: '$120,000',
  },
  {
    id: 2,
    name: 'Globex Inc',
    logo: 'https://via.placeholder.com/40',
    contact: 'hello@globex.com',
    totalProjects: 3,
    totalSpend: '$90,000',
  },
  {
    id: 3,
    name: 'Initech',
    logo: 'https://via.placeholder.com/40',
    contact: 'support@initech.com',
    totalProjects: 7,
    totalSpend: '$200,000',
  },
];

const Clients = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">Clients Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {dummyClients.map((client) => (
          <div
            key={client.id}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
          >
            <div className="flex items-center gap-4 mb-4">
              <img src={client.logo} alt="Logo" className="w-10 h-10 rounded-full" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
                <p className="text-sm text-gray-500">{client.contact}</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Projects:</strong> {client.totalProjects}</p>
              <p><strong>Total Spend:</strong> {client.totalSpend}</p>
            </div>
            <button className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-700 transition-colors">
              View Projects
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Clients;
