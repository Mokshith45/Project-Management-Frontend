import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios'; // ✅ updated import
import { motion } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [leadName, setLeadName] = useState('Loading...');
  const [clientName, setClientName] = useState('Loading...');
  const [issues, setIssues] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [requiredResources, setRequiredResources] = useState([]);
  const [allocatedResources, setAllocatedResources] = useState([]);
  const [openPositions, setOpenPositions] = useState([]);
  const [budgetQuoted, setBudgetQuoted] = useState(0);
  const [budgetSpent, setBudgetSpent] = useState(0);
  const [budgetStatus, setBudgetStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toTitleCase = (str) =>
    str?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || 'N/A';

  useEffect(() => {
    if (budgetQuoted && budgetSpent) {
      if (budgetSpent > budgetQuoted) setBudgetStatus('exceeded');
      else if (budgetSpent < budgetQuoted) setBudgetStatus('under');
      else setBudgetStatus('matched');
    }
  }, [budgetQuoted, budgetSpent]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [
          projectRes,
          issuesRes,
          highlightsRes,
          requiredRes,
          allocatedRes,
          budgetSpentRes
        ] = await Promise.all([
          axiosInstance.get(`/api/projects/${id}`, { headers }),
          axiosInstance.get(`/api/issues/project/${id}`, { headers }),
          axiosInstance.get(`/api/highlights/project/${id}`, { headers }),
          axiosInstance.get(`/api/resource-requirements/project/${id}`, { headers }),
          axiosInstance.get(`/api/resources/project/${id}`, { headers }),
          axiosInstance.get(`/api/projects/${id}/budget-spent`, { headers }),
        ]);

        const projectData = projectRes.data;
        setProject(projectData);
        setBudgetQuoted(projectData.budget || 0);
        setBudgetSpent(budgetSpentRes.data || 0);
        setIssues(issuesRes.data || []);
        setHighlights(highlightsRes.data || []);
        setRequiredResources(requiredRes.data || []);
        setAllocatedResources(allocatedRes.data || []);

        if (projectData.clientId) {
          const client = await axiosInstance.get(`/api/clients/${projectData.clientId}`, { headers });
          setClientName(client.data?.name || 'Unknown');
        }

        const lead = await axiosInstance.get(`/api/project-leads/project/${projectData.id}`, { headers });
        setLeadName(lead.data?.userName || 'Unknown');

        const open = requiredRes.data.map((req) => {
          const allocated = allocatedRes.data.filter((r) => r.level === req.level).length;
          return { level: req.level, required: req.quantity, remaining: req.quantity - allocated };
        }).filter(p => p.remaining > 0);

        setOpenPositions(open);
      } catch (err) {
        console.error(err);
        setError('Error loading data.');
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAll();
    else {
      setError('Invalid project ID');
      setLoading(false);
    }
  }, [id]);

  return (
    <motion.div
      className="max-w-6xl mx-auto p-6 bg-white border border-gray-200 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-800">{project?.projectName}</h1>
          {/* <p className="text-sm text-gray-500">ID: {project?.id}</p> */}
        </div>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full shadow ${
          project?.status === 'ACTIVE'
            ? 'bg-yellow-100 text-yellow-800'
            : 'bg-green-100 text-green-800'
        }`}>
          <FaCheckCircle className="inline mr-1" />
          {toTitleCase(project?.status)}
        </span>
      </div>

      {/* Top Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-800 mb-4">
        <Info label="Type" icon={<FaProjectDiagram />} value={project?.type} />
        <Info label="Department" icon={<FaBuilding />} value={project?.department} />
        <Info label="Lead" icon={<FaUserTie />} value={leadName} />
        <Info label="Client" icon={<FaUserCircle />} value={clientName} />
      </div>

      {/* Budget */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <p><strong>Spent:</strong> ${budgetSpent.toLocaleString()}</p>
          <p><strong>Quoted:</strong> ${budgetQuoted.toLocaleString()}</p>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 transition-all"
            style={{ width: `${Math.min((budgetSpent / budgetQuoted) * 100, 100)}%` }}
          />
        </div>
        <p className={`mt-1 text-xs font-medium ${
          budgetStatus === 'exceeded' ? 'text-red-600'
            : budgetStatus === 'under' ? 'text-green-600'
            : 'text-blue-600'
        }`}>
          {budgetStatus === 'exceeded' && `⚠ Exceeded by $${(budgetSpent - budgetQuoted).toLocaleString()}`}
          {budgetStatus === 'under' && `✅ Under budget. Remaining $${(budgetQuoted - budgetSpent).toLocaleString()}`}
          {budgetStatus === 'matched' && 'ℹ Fully Utilized'}
        </p>
      </div>

      {/* Highlights + Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {highlights.length > 0 && (
          <Section title="Highlights" icon={<FaStar className="text-yellow-400" />}>
            {highlights.map((item) => (
              <ItemCard key={item.id} title={item.title} date={item.createdOn} desc={item.description} color="blue" />
            ))}
          </Section>
        )}
        {issues.length > 0 && (
          <Section title="Issues" icon={<FaBug className="text-red-500" />}>
            {issues.map((item) => (
              <ItemCard key={item.id} title={item.title} date={item.createdDate} desc={item.description} color="red" />
            ))}
          </Section>
        )}
      </div>

      {/* Resource Overview Table */}
      <div className="mb-6">
        <h3 className="text-indigo-700 font-semibold text-lg mb-2 flex items-center gap-2">
          <FaUsers /> Resource Allocation
        </h3>
        <Table
          headers={['Level', 'Required', 'Allocated', 'Status']}
          rows={requiredResources.map((res) => {
            const allocated = allocatedMap[res.level] || 0;
            const filled = allocated >= res.quantity;
            return [
              res.level,
              res.quantity,
              allocated,
              <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                filled ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
              }`}>
                {filled ? 'Filled' : 'Pending'}
              </span>
            ];
          })}
        />
      </div>

      {/* Open Positions */}
      {openPositions.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-yellow-700 font-semibold flex items-center gap-2">
              <FaClipboardList /> Open Positions
            </h3>
            <button
              onClick={() => navigate('/open-positions/add')}
              className="bg-yellow-500 text-white text-sm px-3 py-1 rounded hover:bg-yellow-600"
            >
              <FaPlus className="inline mr-1" /> Add
            </button>
          </div>
          <Table
            headers={['Level', 'Required', 'Remaining']}
            rows={openPositions.map(pos => [pos.level, pos.required, pos.remaining])}
          />
        </div>
      )}

      {/* Allocated Resources */}
      {allocatedResources.length > 0 && (
        <div className="mb-6">
          <h3 className="text-indigo-700 font-semibold mb-2 flex items-center gap-2">
            <FaUserTie /> Allocated Resources
          </h3>
          <Table
            headers={['Name', 'Level', 'Start', 'End']}
            rows={allocatedResources.map(r => [
              r.resourceName,
              <span className="text-xs font-medium bg-blue-100 px-2 py-0.5 rounded text-blue-700">{r.level}</span>,
              new Date(r.startDate).toLocaleDateString(),
              new Date(r.endDate).toLocaleDateString()
            ])}
          />
        </div>
      )}

      {/* Back Button */}
      <div className="text-right mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm"
        >
          ← Back
        </button>
      </div>
    </motion.div>
  );
};

// Utility Components
const Info = ({ label, icon, value }) => (
  <div className="flex items-center gap-2 bg-gray-50 p-2.5 rounded shadow-sm">
    {icon}
    <span><span className="text-gray-500">{label}:</span> <strong>{value || 'N/A'}</strong></span>
  </div>
);

const Section = ({ title, icon, children }) => (
  <div>
    <h3 className="text-md font-semibold flex items-center gap-2 text-gray-700 mb-2">{icon} {title}</h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const ItemCard = ({ title, desc, date, color }) => (
  <div className={`border-l-4 border-${color}-500 bg-${color}-50 p-3 rounded-md shadow-sm`}>
    <h4 className={`font-bold text-${color}-700 mb-1`}>{title}</h4>
    <p className="text-sm text-gray-700">{desc}</p>
    <p className="text-xs text-gray-500 mt-1">Created: {new Date(date).toLocaleDateString()}</p>
  </div>
);

const Table = ({ headers, rows }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full border text-sm text-left border-gray-200 bg-white shadow rounded">
      <thead className="bg-gray-100 text-gray-700 font-medium">
        <tr>{headers.map((h, i) => <th key={i} className="px-4 py-2">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className="border-t">
            {r.map((cell, j) => <td key={j} className="px-4 py-2">{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ProjectDetail;