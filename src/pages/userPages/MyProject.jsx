import React from 'react';
import { motion } from 'framer-motion';

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

const highlights = [
  {
    id: 1,
    description: 'Initial UI completed and approved',
    date: '2024-05-12',
  },
  {
    id: 2,
    description: 'Integrated payment gateway successfully',
    date: '2024-06-01',
  },
  {
    id: 3,
    description: 'Completed user feedback round 1',
    date: '2024-06-25',
  },
];

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
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
    <motion.div
      className="bg-gradient-to-br from-white via-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 shadow-xl p-6 space-y-6 text-gray-800 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h3
        className="text-xl font-bold text-indigo-700 border-b pb-2 mb-4"
        variants={itemVariants}
      >
        📁 Project Info
      </motion.h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        {[
          { label: "Project Name", value: "Website Revamp" },
          { label: "Type", value: "Internal" },
          { label: "Department", value: "Technology" },
          { label: "Status", value: "Active", color: "text-green-600" },
          { label: "Budget", value: "₹5,00,000" },
          { label: "Lead", value: "Harika" },
        ].map(({ label, value, color = "text-gray-800" }, index) => (
          <motion.div
            key={index}
            className="flex flex-col"
            variants={itemVariants}
          >
            <span className="text-gray-500 font-medium">{label}</span>
            <span className={`mt-1 font-semibold ${color}`}>{value}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MyProject;
