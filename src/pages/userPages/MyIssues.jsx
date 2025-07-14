import React, { useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../api/axios';
import AddIssue from './AddIssue';
import EditIssue from './EditIssue';
import { UserContext } from './UserContext';

const statusStyles = {
  OPEN: 'bg-red-100 text-red-800',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-800',
  RESOLVED: 'bg-blue-100 text-blue-800',
  CLOSED: 'bg-green-100 text-green-800',
};

const severityStyles = {
  LOW: 'bg-green-100 text-green-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-orange-100 text-orange-800',
  URGENT: 'bg-red-100 text-red-800',
};

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } },
};

const MyIssues = () => {
  const { user, loadingUser, error: userError } = useContext(UserContext);
  const [name, setName] = useState('');
  const [issues, setIssues] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [editModal, setEditModal] = useState(false);
  const [editIssueData, setEditIssueData] = useState(null);

  const [newIssue, setNewIssue] = useState({
    title: '',
    description: '',
    severity: 'Medium',
    createdBy: '',
    status: 'OPEN',
    projectId: null,
  });

  useEffect(() => {
    if (!user) return;

    axiosInstance.get(`/api/projects/lead/${user.id}`)
      .then((res) => {
        const project = res.data;
        setProjectId(project.id);
        setNewIssue(prev => ({
          ...prev,
          projectId: project.id,
          createdBy: user.name,
        }));
        return axiosInstance.get(`/api/issues/project/${project.id}`);
      })
      .then((res) => setIssues(res.data))
      .catch((err) => {
        console.error('Error fetching issues:', err);
        setError('Failed to load issues.');
      });
  }, [user]);

  const handleChange = (e) => {
    setNewIssue({ ...newIssue, [e.target.name]: e.target.value });
  };

  const handleEditClick = (issue) => {
    setEditIssueData(issue);
    setEditModal(true);
  };

  const handleUpdateIssue = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(`/api/issues/${editIssueData.id}`, editIssueData);
      const updated = issues.map((iss) => (iss.id === res.data.id ? res.data : iss));
      setIssues(updated);
      setEditModal(false);
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update issue');
    }
  };

  const handleAddIssue = async (e) => {
    e.preventDefault();
    const newEntry = {
      ...newIssue,
      createdOn: new Date().toISOString().split('T')[0],
    };

    try {
      const res = await axiosInstance.post('/api/issues', newEntry);
      setIssues([...issues, res.data]);
      setShowModal(false);
      setNewIssue({
        title: '',
        description: '',
        severity: 'Medium',
        createdBy: user.email,
        status: 'OPEN',
        projectId: projectId,
      });
    } catch (err) {
      console.error('Error adding issue:', err);
      alert('Failed to submit issue.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/issues/${id}`);
      setIssues(issues.filter((issue) => issue.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  if (loadingUser) return <div className="p-6">Loading user...</div>;
  if (userError || error) return <div className="p-6 text-red-600">{userError || error}</div>;

  return (
    <motion.div className="p-6 max-w-7xl mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <motion.div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-indigo-700">My Project Issues</h2>
        <motion.button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ➕ Add Issue
        </motion.button>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
      >
        {issues.map((issue) => (
          <motion.div
            key={issue.id}
            variants={cardVariants}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200 relative hover:shadow-xl transition-all"
          >
            <div className="mb-2 text-sm text-gray-500 font-medium"></div>
            <div className="flex justify-between items-center mt-2">
              <p className="text-md text-black-600 "><strong>{issue.description}</strong></p>
              <span
                className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${statusStyles[issue.status]}`}
              >
                {issue.status.replace('_', ' ')}
              </span>
            </div>

            <p className="text-sm mt-2">
              <strong>Severity:</strong>{' '}
              <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-medium ${severityStyles[issue.severity]}`}>
                {issue.severity}
              </span>
            </p>

            <p className="text-sm text-gray-500 mt-2">
              <strong>Created:</strong> {issue.createdDate || issue.createdOn}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Created By:</strong> {issue.createdBy}
            </p>

            <div className="mt-4 flex gap-3">
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded"
                onClick={() => handleEditClick(issue)}
              >
                Edit
              </button>
              <button
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1 rounded"
                onClick={() => handleDelete(issue.id)}
              >
                Delete
              </button>
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

      <AnimatePresence>
        <EditIssue
          show={editModal}
          onClose={() => setEditModal(false)}
          formData={editIssueData}
          onChange={(e) =>
            setEditIssueData({ ...editIssueData, [e.target.name]: e.target.value })
          }
          onSubmit={handleUpdateIssue}
        />
      </AnimatePresence>
    </motion.div>
  );
};

export default MyIssues;
