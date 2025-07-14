import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axios';
import { UserContext } from './UserContext'; // Adjust path as needed

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
  const { user, loadingUser, error: userError } = useContext(UserContext);
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');
  const [leadName, setLeadName] = useState('');

  useEffect(() => {
    if (!user) return;

    axiosInstance.get(`/api/projects/lead/${user.id}`)
      .then(async (res) => {
        const projectData = res.data;
        setProject(projectData);

        try {
          const leadRes = await axiosInstance.get(`/api/project-leads/project/${projectData.id}`);
          const name = leadRes.data.userName;
          setLeadName(name);
        } catch (leadErr) {
          console.error("Failed to fetch project lead name:", leadErr);
          setLeadName("Unavailable");
        }
      })
      .catch(err => {
        console.error("Failed to load project:", err);
        setError("Failed to load project details.");
      });
  }, [user]);

  if (loadingUser) return <div className="p-6">Loading user info...</div>;
  if (userError) return <div className="p-6 text-red-600">{userError}</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!project) return <div className="p-6">Loading project...</div>;

  const {
    projectName,
    type,
    department,
    status,
    budget,
  } = project;

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
          { label: "Project Name", value: projectName },
          { label: "Type", value: type },
          { label: "Department", value: department },
          { label: "Status", value: status, color: status === "ACTIVE" ? "text-green-600" : "text-red-600" },
          { label: "Budget", value: `₹${budget?.toLocaleString()}` },
          { label: "Lead", value: leadName },
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
