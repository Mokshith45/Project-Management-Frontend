import React from 'react';

const clientData = {
  name: 'Acme Corp',
  industry: 'Technology Consulting',
  contact: {
    name: 'Sarah Connor',
    email: 'sarah.connor@acmecorp.com',
    phone: '+1 555 123 4567'
  },
  address: {
    street: '123 Silicon Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94107'
  },
  activeProjects: ['Website Revamp', 'Internal Tool Migration']
};

const MyClient = () => {
  return (
    <div className="pt-10 px-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-6">🏢 Client Company Details</h2>

      <div className="bg-white shadow rounded-xl p-6 space-y-4 border border-indigo-100">
        {/* Client Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Name</h3>
          <p className="text-gray-700">{clientData.name}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800">Industry</h3>
          <p className="text-gray-700">{clientData.industry}</p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Point of Contact</h3>
          <p className="text-gray-700">
            {clientData.contact.name} <br />
            📧 {clientData.contact.email} <br />
            📞 {clientData.contact.phone}
          </p>
        </div>

        {/* Address */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Address</h3>
          <p className="text-gray-700">
            {clientData.address.street},<br />
            {clientData.address.city}, {clientData.address.state} - {clientData.address.zip}
          </p>
        </div>

        {/* Active Projects */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Active Projects</h3>
          <ul className="list-disc pl-5 text-gray-700 text-sm">
            {clientData.activeProjects.map((project, idx) => (
              <li key={idx}>{project}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyClient;
