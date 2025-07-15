import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { motion } from 'framer-motion';
import { FaEdit, FaSave, FaTimes, FaCheckCircle, FaUsers, FaUserTie, FaClipboardList, FaStar, FaBug } from 'react-icons/fa';
import BudgetSection from './BudgetSection';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [leadName, setLeadName] = useState('');
  const [clientName, setClientName] = useState('');
  const [issues, setIssues] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [requiredResources, setRequiredResources] = useState([]);
  const [allocatedResources, setAllocatedResources] = useState([]);
  const [openPositions, setOpenPositions] = useState([]);
  const [budgetQuoted, setBudgetQuoted] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBudget, setShowBudget] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProject, setEditableProject] = useState({});

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const projectRes = await axios.get(`/api/projects/${id}`, { headers });
        const projectData = projectRes.data;
        setProject(projectData);
        setEditableProject({
          projectName: projectData.projectName,
          department: projectData.department,
          type: projectData.type,
          status: projectData.status,
        });
        setBudgetQuoted(projectData.budget || 0);

        const [
          clientRes,
          leadRes,
          issuesRes,
          highlightsRes,
          reqRes,
          allocRes,
          openRes
        ] = await Promise.all([
          axios.get(`/api/clients/${projectData.clientId}`, { headers }),
          axios.get(`/api/project-leads/project/${id}`, { headers }),
          axios.get(`/api/issues/project/${id}`, { headers }),
          axios.get(`/api/highlights/project/${id}`, { headers }),
          axios.get(`/api/resource-requirements/project/${id}`, { headers }),
          axios.get(`/api/resources/project/${id}`, { headers }),
          axios.get(`/api/open-positions/project/${id}`, { headers }),
        ]);

        setClientName(clientRes.data?.name || 'Unknown');
        setLeadName(leadRes.data?.userName || 'Unknown');
        setIssues(issuesRes.data || []);
        setHighlights(highlightsRes.data || []);
        setRequiredResources(reqRes.data || []);
        setAllocatedResources(allocRes.data || []);

        const openFiltered = (reqRes.data || []).map((req) => {
          const allocatedCount = (allocRes.data || []).filter((r) => r.level === req.level).length;
          return {
            level: req.level,
            required: req.quantity,
            remaining: req.quantity - allocatedCount,
          };
        }).filter((pos) => pos.remaining > 0);

        setOpenPositions(openFiltered);
      } catch (err) {
        console.error('Error loading project:', err);
        setError('Failed to load project data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  const allocatedMap = allocatedResources.reduce((acc, res) => {
    acc[res.level] = (acc[res.level] || 0) + 1;
    return acc;
  }, {});

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this project?');
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/projects');
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    setEditableProject({ ...editableProject, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      const updated = { ...project, ...editableProject };
      await axios.put(`/api/projects/${id}`, updated, { headers });

      setProject(updated);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to save project:', err);
    }
  };

  const toTitleCase = (str) =>
    str?.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()) || 'N/A';

  if (loading) return <div className="text-center text-gray-500 py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-xl space-y-6 mt-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="flex justify-between items-start border-b pb-4">
        <div>
          {isEditing ? (
            <input
              className="text-2xl font-bold border px-3 py-1 rounded text-indigo-700"
              name="projectName"
              value={editableProject.projectName}
              onChange={handleInputChange}
            />
          ) : (
            <h1 className="text-2xl font-bold text-indigo-800">{project.projectName}</h1>
          )}
          <p className="text-sm text-gray-500">Project ID: {project.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-sm rounded-full ${
            project.status === 'ACTIVE'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}>
            <FaCheckCircle className="inline-block mr-1" />
            {toTitleCase(project.status)}
          </span>

          {!isEditing ? (
            <button className="text-indigo-600" onClick={handleEditToggle}>
              <FaEdit />
            </button>
          ) : (
            <>
              <button className="text-green-600" onClick={handleSave}>
                <FaSave />
              </button>
              <button className="text-red-500" onClick={handleEditToggle}>
                <FaTimes />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Project Info */}
      <div className="grid sm:grid-cols-2 gap-4 text-sm">
        {['department', 'type', 'status'].map((field) => (
          <div key={field} className="p-3 rounded-lg bg-gray-50 border">
            <span className="text-gray-500 font-medium capitalize">{field}:</span>{' '}
            {isEditing ? (
              <input
                name={field}
                value={editableProject[field]}
                onChange={handleInputChange}
                className="ml-2 border-b border-indigo-300 bg-transparent focus:outline-none"
              />
            ) : (
              <span className="font-semibold ml-1">{editableProject[field]}</span>
            )}
          </div>
        ))}
        <div className="p-3 rounded-lg bg-gray-50 border">
          <span className="text-gray-500 font-medium">Client:</span> {clientName}
        </div>
        <div className="p-3 rounded-lg bg-gray-50 border">
          <span className="text-gray-500 font-medium">Lead:</span> {leadName}
        </div>
      </div>

      {/* Budget Toggle */}
      <div>
        <button
          className="text-sm text-indigo-600 hover:underline mb-2"
          onClick={() => setShowBudget(!showBudget)}
        >
          {showBudget ? '▲ Hide Budget Breakdown' : '▼ Show Budget Breakdown'}
        </button>
        {showBudget && (
          <BudgetSection
            projectId={id}
            budgetQuoted={budgetQuoted}
            allocatedResources={allocatedResources}
          />
        )}
      </div>

      {/* Allocation Overview */}
      <div>
        <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-2">
          <FaUsers /> Allocation Overview
        </h2>
        <table className="w-full text-sm border rounded-xl">
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="px-4 py-2 text-left">Level</th>
              <th className="px-4 py-2 text-center">Required</th>
              <th className="px-4 py-2 text-center">Allocated</th>
              <th className="px-4 py-2 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {requiredResources.map((res, idx) => {
              const allocated = allocatedMap[res.level] || 0;
              const isFilled = allocated >= res.quantity;
              return (
                <tr key={idx} className="border-t text-center">
                  <td className="px-4 py-2 text-left">{res.level}</td>
                  <td>{res.quantity}</td>
                  <td>{allocated}</td>
                  <td>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      isFilled ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {isFilled ? 'Filled' : 'Pending'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Allocated Resources */}
      {allocatedResources.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-indigo-700 flex items-center gap-2 mb-2">
            <FaUserTie /> Allocated Resources
          </h2>
          <table className="w-full text-sm border rounded-xl shadow-sm">
            <thead className="bg-indigo-50 text-indigo-700">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2">Level</th>
                <th className="px-4 py-2">Start</th>
                <th className="px-4 py-2">End</th>
              </tr>
            </thead>
            <tbody>
              {allocatedResources.map((res) => (
                <tr key={res.id} className="border-t text-center">
                  <td className="px-4 py-2 text-left">{res.resourceName}</td>
                  <td>{res.level}</td>
                  <td>{new Date(res.startDate).toLocaleDateString()}</td>
                  <td>{new Date(res.endDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Open Positions */}
      {openPositions.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-yellow-700 mb-2 flex items-center gap-2">
            <FaClipboardList /> Open Positions
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {openPositions.map((pos, idx) => (
              <div key={idx} className="p-4 border rounded-lg bg-yellow-50 text-sm">
                <p><strong>Level:</strong> {pos.level}</p>
                <p><strong>Required:</strong> {pos.required}</p>
                <p><strong>Remaining:</strong> {pos.remaining}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Highlights and Issues */}
      {(highlights.length > 0 || issues.length > 0) && (
        <div className="grid sm:grid-cols-2 gap-6">
          {highlights.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-blue-700 mb-2 flex items-center gap-2">
                <FaStar /> Highlights
              </h2>
              <div className="space-y-3">
                {highlights.map((h) => (
                  <div key={h.id} className="p-3 bg-blue-50 border rounded-lg">
                    <h3 className="font-bold">{h.title}</h3>
                    <p>{h.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {issues.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-red-700 mb-2 flex items-center gap-2">
                <FaBug /> Issues
              </h2>
              <div className="space-y-3">
                {issues.map((i) => (
                  <div key={i.id} className="p-3 bg-red-50 border rounded-lg">
                    <h3 className="font-bold">{i.title}</h3>
                    <p>{i.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={handleDelete}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Project
        </button>
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          ← Back
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
