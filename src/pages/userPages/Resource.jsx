import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import axiosInstance from '../../api/axios';
import { UserContext } from './UserContext';

const getExpFromLevel = (level) => {
  switch (level) {
    case 'JR': return 1;
    case 'INTERMEDIATE': return 4;
    case 'SR': return 7;
    case 'ADVANCE': return 10;
    case 'EXPERT': return 13;
    default: return '?';
  }
};

const levelToExpMap = {
  JR: 1,
  INTERMEDIATE: 4,
  SR: 7,
  ADVANCE: 10,
  EXPERT: 13,
};

const Resource = () => {
  const { user, loadingUser, error: userError } = useContext(UserContext);
  const [resources, setResources] = useState([]);
  const [projectId, setProjectId] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showOpenPosForm, setShowOpenPosForm] = useState(false);

  const [newResource, setNewResource] = useState({
    resourceName: '',
    level: '',
    exp: '',
    startDate: '',
    endDate: '',
    projectId: null,
  });

  const [openPosition, setOpenPosition] = useState({
    level: '',
    numberRequired: 1,
    projectId: null,
  });

  useEffect(() => {
    if (!user) return;

    axiosInstance.get(`/api/projects/lead/${user.id}`)
      .then((res) => {
        const project = res.data;
        setProjectId(project.id);
        setNewResource((prev) => ({ ...prev, projectId: project.id }));
        setOpenPosition((prev) => ({ ...prev, projectId: project.id }));
        return axiosInstance.get(`/api/resources/project/${project.id}`);
      })
      .then((res) => {
        setResources(res.data);
      })
      .catch((err) => {
        console.error('Error loading project/resources:', err);
        setError('Failed to load project resources');
      });
  }, [user]);

  const handleAddResource = async (e) => {
    e.preventDefault();
    const payload = {
      ...newResource,
      exp: parseInt(newResource.exp),
    };

    try {
      const res = await axiosInstance.post('/api/resources', payload);
      setResources([res.data, ...resources]);
      setNewResource({
        resourceName: '',
        level: '',
        exp: '',
        startDate: '',
        endDate: '',
        projectId: projectId,
      });
      setShowForm(false);
    } catch (err) {
      console.error('Error adding resource:', err);
      alert('Failed to add resource.');
    }
  };

  const handleSubmitOpenPosition = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/open-positions', openPosition);
      alert('Open position notified successfully');
      setOpenPosition({ level: '', numberRequired: 1, projectId });
      setShowOpenPosForm(false);
    } catch (err) {
      console.error('Error notifying open position:', err);
      alert('Failed to notify open position');
    }
  };

  if (loadingUser) return <div className="p-6">Loading user...</div>;
  if (userError || error) return <div className="p-6 text-red-600">{userError || error}</div>;

  return (
    <motion.div className="bg-white p-6 rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">🧑‍💻 Project Resources</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm rounded-md"
          >
            {showForm ? 'Cancel' : '➕ Add Resource'}
          </button>
          <button
            onClick={() => setShowOpenPosForm(!showOpenPosForm)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-sm rounded-md"
          >
            {showOpenPosForm ? 'Cancel' : '📢 Notify Open Position'}
          </button>
        </div>
      </div>

      {/* Add Resource Form */}
      {showForm && (
        <motion.form
          onSubmit={handleAddResource}
          className="grid grid-cols-1 gap-4 mb-6 p-4 bg-gray-50 rounded-md sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Resource Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={newResource.resourceName}
              onChange={(e) =>
                setNewResource({ ...newResource, resourceName: e.target.value })
              }
              required
              className="border px-3 py-2 rounded-md w-full"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Level <span className="text-red-600">*</span>
            </label>
            <select
              value={newResource.level}
              onChange={(e) => {
                const level = e.target.value;
                setNewResource({ ...newResource, level, exp: levelToExpMap[level] });
              }}
              className="border px-3 py-2 rounded-md w-full"
              required
            >
              <option value="">Select Level</option>
              {Object.keys(levelToExpMap).map((lvl) => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Start Date <span className="text-red-600">*</span>
            </label>
            <input
              type="date"
              value={newResource.startDate}
              onChange={(e) =>
                setNewResource({ ...newResource, startDate: e.target.value })
              }
              required
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              End Date (optional)
            </label>
            <input
              type="date"
              value={newResource.endDate}
              onChange={(e) =>
                setNewResource({ ...newResource, endDate: e.target.value })
              }
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          <div className="col-span-full flex justify-center mt-2">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
            >
              Add Resource
            </button>
          </div>
        </motion.form>
      )}

      {/* Open Position Form */}
      {showOpenPosForm && (
        <motion.form
          onSubmit={handleSubmitOpenPosition}
          className="grid grid-cols-1 gap-4 mb-6 p-4 bg-yellow-50 rounded-md sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Level <span className="text-red-600">*</span>
            </label>
            <select
              value={openPosition.level}
              onChange={(e) =>
                setOpenPosition({ ...openPosition, level: e.target.value })
              }
              required
              className="border px-3 py-2 rounded-md w-full"
            >
              <option value="">Select Level</option>
              <option value="JR">JUNIOR</option>
              <option value="INTERMEDIATE">MID</option>
              <option value="SR">SENIOR</option>
              <option value="ADVANCE">ADVANCED</option>
              <option value="EXPERT">EXPERT</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Number of Resources <span className="text-red-600">*</span>
            </label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 2"
              value={openPosition.numberRequired}
              onChange={(e) =>
                setOpenPosition({ ...openPosition, numberRequired: parseInt(e.target.value) })
              }
              required
              className="border px-3 py-2 rounded-md w-full"
            />
          </div>

          <div className="col-span-full flex justify-center mt-2">
            <button
              type="submit"
              className="bg-yellow-600 hover:bg-yellow-800 text-white px-4 py-2 rounded-md"
            >
              Notify Position
            </button>
          </div>
        </motion.form>
      )}

      {/* Resource Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg shadow-sm">
          <thead className="text-xs text-white uppercase bg-gradient-to-r from-indigo-600 to-purple-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((res, index) => (
              <motion.tr
                key={res.id}
                className="border-b hover:bg-gray-50 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-4 py-3 font-medium">{res.resourceName}</td>
                <td className="px-4 py-3">
                  {getExpFromLevel(res.level)} yrs ({res.level})
                </td>
                <td className="px-4 py-3 text-sm">
                  {res.startDate} → {res.endDate || '—'}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Resource;
