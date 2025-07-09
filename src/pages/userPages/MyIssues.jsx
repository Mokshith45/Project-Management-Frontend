import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AddIssue from './AddIssue';
import { UserContext } from './UserContext'; // ✅ updated as per your path

const statusStyles = {
  Open: 'text-red-600 bg-red-100',
  'In Progress': 'text-yellow-600 bg-yellow-100',
  Closed: 'text-green-600 bg-green-100',
};

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { when: 'beforeChildren', staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const MyIssues = () => {
  const { user, loadingUser, error: userError } = useContext(UserContext);

  const [issues, setIssues] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    severity: 'Medium',
    createdBy: '',
    status: 'Open',
    projectId: null,
  });

  // Load project and issues
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem('token');

    axios.get(`http://localhost:8080/api/projects/lead/${user.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      const project = res.data;
      setProjectId(project.id);
      setNewIssue((prev) => ({ ...prev, projectId: project.id, createdBy: user.email }));

      // Fetch issues for the project
      return axios.get(`http://localhost:8080/api/issues/project/${project.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    })
    .then((res) => {
      setIssues(res.data);
    })
    .catch((err) => {
      console.error('Error fetching issues:', err);
      setError('Failed to load issues.');
    });
  }, [user]);

  const handleChange = (e) => {
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  };

  const handleAddIssue = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem('token');
  const newEntry = {
    ...newIssue,
    createdOn: new Date().toISOString().split('T')[0],
  };

  try {
    const res = await axios.post('http://localhost:8080/api/issues', newEntry, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setIssues([...issues, res.data]); // Add newly created issue to the UI
    setShowModal(false);

    // Reset form
    setNewIssue({
      title: '',
      description: '',
      severity: 'Medium',
      createdBy: user.email,
      status: 'Open',
      projectId: projectId,
    });
  } catch (err) {
    console.error('Error adding issue:', err);
    alert('Failed to submit issue.');
  }
};


  if (loadingUser) return <div className="p-6">Loading user...</div>;
  if (userError || error) return <div className="p-6 text-red-600">{userError || error}</div>;

  return (
    <motion.div
      className="pt-10 px-6 max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex justify-between items-center mb-6" variants={itemVariants}>
        <h2 className="text-2xl font-bold text-indigo-700">🐞 My Project Issues</h2>
        <motion.button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Add Issue
        </motion.button>
      </motion.div>

      <motion.div className="space-y-4">
        {issues.map((issue) => (
          <motion.div
            key={issue.id}
            className="bg-white border border-indigo-100 rounded-lg shadow p-4"
            variants={itemVariants}
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
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        <AddIssue
          show={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleAddIssue}
          formData={newIssue}
          onChange={handleChange}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default MyIssues;
