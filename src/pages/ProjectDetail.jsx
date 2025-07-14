import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BudgetSection from './BudgetSection';
import { motion } from 'framer-motion';
import {
  FaProjectDiagram, FaBuilding, FaCheckCircle,
  FaUserTie, FaUserCircle, FaBug, FaStar,
  FaUsers, FaPlus, FaClipboardList,
} from 'react-icons/fa';

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

        const [projectRes, issuesRes, highlightsRes, requiredRes, allocatedRes, budgetSpentRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/projects/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/issues/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/highlights/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/resource-requirements/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/resources/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/projects/${id}/budget-spent`, { headers }),
        ]);

        const projectData = projectRes.data;
        setProject(projectData);
        setBudgetQuoted(projectData.budget || 0);
        setBudgetSpent(budgetSpentRes.data || 0);
        setIssues(issuesRes.data || []);
        setHighlights(highlightsRes.data || []);

        const requiredRes = await axios.get(`http://localhost:8080/api/resource-requirements/project/${id}`, { headers });
        setRequiredResources(requiredRes.data || []);
        setAllocatedResources(allocatedRes.data || []);
        // Fetch rate cards
      const [projectRatesRes, globalRatesRes] = await Promise.all([
        axios.get(`http://localhost:8080/api/ratecards/project/${id}`, { headers }),
        axios.get(`http://localhost:8080/api/ratecards/global`, { headers })
      ]);

      const projectRates = projectRatesRes.data || [];
      const globalRates = globalRatesRes.data || [];

      // Convert rate cards to lookup maps
      const projectRateObj = Object.fromEntries(
      projectRates.map((r) => [r.level, r.rate])
    );
    const globalRateObj = Object.fromEntries(
      globalRates.map((r) => [r.level, r.rate])
    );

    setProjectRateMap(projectRateObj);
    setGlobalRateMap(globalRateObj);

// Step 2: Compute budget breakup by resource duration testing
const breakup = {};

(allocatedRes.data || []).forEach((res) => {
  const level = res.level;
  const rate = projectRateMap[level] || globalRateMap[level] || 0;

  const start = new Date(res.startDate);
  const end = new Date(res.endDate);
  const timeDiff = Math.abs(end - start);
  const numDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)) + 1; // include both days

  const cost = rate * numDays;

  if (!breakup[level]) {
    breakup[level] = { rate, quantity: 1, days: numDays, total: cost };
  } else {
    breakup[level].quantity += 1;
    breakup[level].days += numDays;
    breakup[level].total += cost;
  }
});

setBudgetBreakup(breakup);

        // Client
        if (projectData.clientId) {
          const client = await axios.get(`http://localhost:8080/api/clients/${projectData.clientId}`, { headers });
          setClientName(client.data?.name || 'Unknown');
        }

        // Budget spent
        const budgetSpentRes = await axios.get(`http://localhost:8080/api/projects/${id}/budget-spent`, { headers });
        setBudgetSpent(budgetSpentRes.data || 0);


        // Open Positions
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



  if (loading) return <div className="text-center py-16 text-gray-600">Loading...</div>;
  if (error) return <div className="text-center py-16 text-red-600">{error}</div>;

  const allocatedMap = allocatedResources.reduce((acc, r) => {
    acc[r.level] = (acc[r.level] || 0) + 1;
    return acc;
  }, {});

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
          <p className="text-sm text-gray-500">ID: {project?.id}</p>
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

        {budgetStatus && (
            <div className="mt-2 text-sm font-medium">
                {budgetStatus === 'exceeded' && (
                <p className="text-red-600">⚠ Budget Exceeded by ${(budgetSpent - budgetQuoted).toLocaleString()}</p>
                )}
                {budgetStatus === 'under' && (
                <p className="text-green-600">✅ Within Budget. Remaining: ${(budgetQuoted - budgetSpent).toLocaleString()}</p>
                )}
                {budgetStatus === 'matched' && (
                <p className="text-blue-600">ℹ Budget Fully Utilized</p>
                )}
            </div>
        )}

      {(highlights.length > 0 || issues.length > 0) && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Highlights Section */}
            {highlights.length > 0 && (
            <div>
                <h2 className="text-xl font-semibold text-blue-700 flex items-center gap-2 mb-4">
                <FaStar className="text-yellow-500" /> Highlights
                </h2>
                <div className="flex flex-col gap-4">
                {highlights.map((item) => (
                    <div key={item.id} className="bg-blue-50 p-5 rounded-2xl border border-blue-200 shadow-md">
                    <h3 className="text-lg font-bold text-blue-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-700 mb-3">
                        <span className="font-semibold">Description:</span> {item.description}
                    </p>
                    <p className="text-sm text-gray-600">
                        <span className="font-semibold">Created On:</span>{' '}
                        {new Date(item.createdOn).toLocaleDateString()}
                    </p>
                    </div>
                ))}
                </div>
            </div>
            )}

            {/* Issues Section */}
            {issues.length > 0 && (
            <div>
                <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2 mb-4">
                <FaBug className="text-red-500" /> Issues
                </h2>
                <div className="flex flex-col gap-4">
                {issues.map((item) => (
                    <div key={item.id} className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-md">
                    <h3 className="text-lg font-bold text-red-800 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-700 mb-2">
                        <span className="font-semibold">Description:</span> {item.description}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                        <p>
                        <span className="font-semibold">Severity:</span>{' '}
                        <span
                            className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
                            item.severity === 'HIGH'
                                ? 'bg-red-600'
                                : item.severity === 'MEDIUM'
                                ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                        >
                            {item.severity}
                        </span>
                        </p>
                        <p>
                        <span className="font-semibold">Status:</span>{' '}
                        <span
                            className={`inline-block px-2 py-0.5 rounded-full text-white text-xs ${
                            item.status === 'OPEN'
                                ? 'bg-yellow-600'
                                : item.status === 'RESOLVED'
                                ? 'bg-green-600'
                                : 'bg-gray-500'
                            }`}
                        >
                            {item.status}
                        </span>
                        </p>
                        <p>
                        <span className="font-semibold">Created By:</span> {item.createdBy}
                        </p>
                        <p>
                        <span className="font-semibold">Created On:</span>{' '}
                        {new Date(item.createdDate).toLocaleDateString()}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
        )}


      <div className="mt-12">
        <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2 mb-4">
          <FaUsers className="text-indigo-500" /> Resource Allocation Overview
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-xl overflow-hidden border border-gray-200">
            <thead className="bg-indigo-50 text-indigo-800 text-sm">
              <tr>
                <th className="py-2 px-4 text-left">Level</th>
                <th className="py-2 px-4 text-left">Required</th>
                <th className="py-2 px-4 text-left">Allocated</th>
                <th className="py-2 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {requiredResources.map((res, idx) => {
                const allocated = allocatedMap[res.level] || 0;
                const isComplete = allocated >= res.quantity;

                return (
                  <tr
                    key={idx}
                    className={`text-sm ${isComplete ? 'bg-green-50' : 'bg-yellow-50'} border-b`}
                  >
                    <td className="py-2 px-4 font-medium">{res.level}</td>
                    <td className="py-2 px-4">{res.quantity}</td>
                    <td className="py-2 px-4">{allocated}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                          isComplete
                            ? 'bg-green-200 text-green-800'
                            : 'bg-yellow-200 text-yellow-800'
                        }`}
                      >
                        {isComplete ? 'Filled' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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
