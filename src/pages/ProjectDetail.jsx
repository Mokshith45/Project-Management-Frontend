import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BudgetSection from './BudgetSection';
import { motion } from 'framer-motion';
import {
  FaProjectDiagram,
  FaBuilding,
  FaCheckCircle,
  FaUserTie,
  FaUserCircle,
  FaBug,
  FaStar,
  FaUsers,
  FaPlus,
  FaClipboardList,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Added state for toggle sections
  const [openPositions, setOpenPositions] = useState([]);

  const [budgetQuoted, setBudgetQuoted] = useState(0);
  const [budgetSpent, setBudgetSpent] = useState(0);

  const [budgetStatus, setBudgetStatus] = useState('');
const [budgetBreakup, setBudgetBreakup] = useState({});
const [projectRateMap, setProjectRateMap] = useState({});
const [globalRateMap, setGlobalRateMap] = useState({});



  const toTitleCase = (str) =>
    str?.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) || 'N/A';

  useEffect(() => {
    if (budgetQuoted && budgetSpent) {
        if (budgetSpent > budgetQuoted) {
        setBudgetStatus('exceeded');
        } else if (budgetSpent < budgetQuoted) {
        setBudgetStatus('under');
        } else {
        setBudgetStatus('matched');
        }
    }
    }, [budgetQuoted, budgetSpent]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const projectRes = await axios.get(`http://localhost:8080/api/projects/${id}`, { headers });
        const projectData = projectRes.data;
        setProject(projectData);

        if (projectData.clientId) {
          const clientRes = await axios.get(`http://localhost:8080/api/clients/${projectData.clientId}`, { headers });
          setClientName(clientRes.data?.name || 'Unknown Client');
        }

        const leadRes = await axios.get(`http://localhost:8080/api/project-leads/project/${projectData.id}`, { headers });
        setLeadName(leadRes.data?.userName || 'Unknown Lead');

        const issuesRes = await axios.get(`http://localhost:8080/api/issues/project/${id}`, { headers });
        setIssues(issuesRes.data || []);

        const highlightsRes = await axios.get(`http://localhost:8080/api/highlights/project/${id}`, { headers });
        setHighlights(highlightsRes.data || []);

        const openPositionsRes = await axios.get(`http://localhost:8080/api/open-positions/project/${id}`, { headers });
        setOpenPositions(openPositionsRes.data || []);
        console.log(openPositionsRes.data);

        const requiredRes = await axios.get(`http://localhost:8080/api/resource-requirements/project/${id}`, { headers });
        setRequiredResources(requiredRes.data || []);

        const allocatedRes = await axios.get(`http://localhost:8080/api/resources/project/${id}`, { headers });
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

        // Budget quoted
        setBudgetQuoted(projectData.budget || 0);

        // Budget spent
        const budgetSpentRes = await axios.get(`http://localhost:8080/api/projects/${id}/budget-spent`, { headers });
        setBudgetSpent(budgetSpentRes.data || 0);

        // fetch users and their types
        // const xx = await axios.get('http://localhost:8080/api/resources/project/' + id, { headers });
        // // console.log(xx.data);


        // const yy = await axios.get('http://localhost:8080/api/ratecards/project/' + id, { headers });
        // // console.log(yy.data);

        // const zz = await axios.get('http://localhost:8080/api/ratecards/global', { headers });
        // console.log({
        //   resources: xx.data,
        //   ratecards: yy.data,
        //   globalRatecards: zz.data
        // });
        


        // Compute open positions
        const open = (requiredRes.data || []).map((req) => {
          const allocatedCount = (allocatedRes.data || []).filter((r) => r.level === req.level).length;
          return {
            level: req.level,
            required: req.quantity,
            remaining: req.quantity - allocatedCount,
          };
        }).filter(pos => pos.remaining > 0);

        setOpenPositions(open);
      } catch (err) {
        console.error('Error fetching project data:', err);
        setError('Failed to load project details.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchAllData();
    } else {
      setError('Invalid project ID.');
      setLoading(false);
    }
  }, [id]);



  if (loading) return <div className="text-center py-20 text-gray-500 text-lg">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-lg">{error}</div>;

  const allocatedMap = allocatedResources.reduce((acc, res) => {
    acc[res.level] = (acc[res.level] || 0) + 1;
    return acc;
  }, {});

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-2 bg-white shadow-2xl rounded-2xl p-8 border border-gray-200"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Project Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-indigo-800">{project?.projectName || 'Unnamed Project'}</h1>
          <p className="text-sm text-gray-500 mt-1">Project ID: {project?.id || 'N/A'}</p>
        </div>
        <div>
          <span
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm ${
              project?.status === 'ACTIVE' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
            }`}
          >
            <FaCheckCircle className="text-base" />
            {toTitleCase(project?.status)}
          </span>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8 text-medium text-gray-900">
        {[
          { icon: <FaProjectDiagram />, label: 'Type', value: project?.type },
          { icon: <FaBuilding />, label: 'Department', value: project?.department },
          { icon: <FaUserTie />, label: 'Project Lead', value: leadName },
          { icon: <FaUserCircle />, label: 'Client', value: clientName },
        ].map((info, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-sm">
            {info.icon}
            <span>
              <span className="text-gray-500 font-medium">{info.label}:</span>{' '}
              <span className="font-semibold">{info.value || 'N/A'}</span>
            </span>
          </div>
        ))}
      </div>
      {/* Budget Section */}
        <div className="mt-6">
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-800 mb-2">
            <p><strong>Budget Spent:</strong> ${budgetSpent.toLocaleString()}</p>
            <p><strong>Budget Quoted:</strong> ${budgetQuoted.toLocaleString()}</p>
        </div>

        <div className="w-full bg-gray-200 h-4 rounded-full overflow-hidden shadow-sm">
            <div
            className="h-full bg-indigo-500 transition-all duration-500"
            style={{ width: `${Math.min((budgetSpent / budgetQuoted) * 100, 100)}%` }}
            ></div>
        </div>
        </div>

        {budgetStatus && (
            <div className="mt-2 text-sm font-medium">
                {budgetStatus === 'exceeded' && (
                <p className="text-red-600">⚠ Budget Exceeded by  ${(budgetSpent - budgetQuoted).toLocaleString()}</p>
                )}
                {budgetStatus === 'under' && (
                <p className="text-green-600">✅ Within Budget. Remaining: ${(budgetQuoted - budgetSpent).toLocaleString()}</p>
                )}
                {budgetStatus === 'matched' && (
                <p className="text-blue-600">ℹ Budget Fully Utilized</p>
                )}
            </div>
        )}

            {/* Resource-wise Billing Summary */}
            <BudgetSection
            projectId={id}
            budgetQuoted={budgetQuoted}
            allocatedResources={allocatedResources}
          />


      {/* Highlights and Issues Section */}
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
                        <span className="font-semibold">Created On :</span>{' '}
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

      {openPositions.length > 0 && (
        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-yellow-700 flex items-center gap-2">
              <FaClipboardList className="text-yellow-500" />
              Open Positions
            </h2>
            <button
              onClick={() => navigate('/open-positions/add')}
              className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition text-sm"
            >
              <FaPlus />
              Add Position
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {openPositions.map((pos, idx) => (
              <div
                key={idx}
                className="p-4 border border-yellow-200 rounded-xl bg-yellow-50"
              >
                <p className="text-gray-800 font-semibold">Level: {pos.level}</p>
                <p className="text-gray-700">Required: {pos.required}</p>
                <p className="text-gray-700">Still Open: {pos.remaining}</p>
              </div>
            ))}
          </div>
        </div>
      )}


      {/* Resources Table */}
        {allocatedResources.length > 0 && (
        <div className="mt-10">
            <h2 className="text-xl font-semibold text-indigo-700 flex items-center gap-2 mb-4">
            <FaUserTie className="text-indigo-500" /> Allocated Resources
            </h2>
            <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-xl shadow-sm">
                <thead>
                <tr className="bg-indigo-100 text-indigo-800 text-left text-sm">
                    <th className="py-2 px-4">Resource Name</th>
                    <th className="py-2 px-4">Level</th>
                    <th className="py-2 px-4">Start Date</th>
                    <th className="py-2 px-4">End Date</th>
                </tr>
                </thead>
                <tbody>
                {allocatedResources.map((res) => (
                    <tr key={res.id} className="border-t text-sm hover:bg-gray-50">
                    <td className="py-2 px-4">{res.resourceName}</td>
                    <td className="py-2 px-4">
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">
                        {res.level}
                        </span>
                    </td>
                    <td className="py-2 px-4">
                        {new Date(res.startDate).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4">
                        {new Date(res.endDate).toLocaleDateString()}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>
        )}


      <div className="mt-10 text-right">
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl shadow transition"
        >
          ← Back to Projects
        </button>
      </div>
    </motion.div>
  );
};

export default ProjectDetail;
