import React from 'react';
import { motion } from 'framer-motion';

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

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const MyClient = () => {
  return (
    <motion.div
      className="pt-10 px-4 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl font-bold text-indigo-700 mb-6"
        variants={itemVariants}
      >
        🏢 Client Company Details
      </motion.h2>

      <motion.div
        className="bg-white shadow rounded-xl p-6 border border-indigo-100 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Name</h3>
          <p className="text-gray-700">{clientData.name}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Industry</h3>
          <p className="text-gray-700">{clientData.industry}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Point of Contact</h3>
          <p className="text-gray-700 space-y-1">
            {clientData.contact.name} <br />
            📧 {clientData.contact.email} <br />
            📞 {clientData.contact.phone}
          </p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Address</h3>
          <p className="text-gray-700">
            {clientData.address.street},<br />
            {clientData.address.city}, {clientData.address.state} - {clientData.address.zip}
          </p>
        </motion.div>

        <motion.div className="md:col-span-2" variants={itemVariants}>
          <h3 className="text-lg font-semibold text-gray-800">Active Projects</h3>
          <motion.ul className="list-disc pl-5 text-gray-700 text-sm">
            {clientData.activeProjects.map((project, idx) => (
              <motion.li key={idx} variants={itemVariants}>
                {project}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default MyClient;
