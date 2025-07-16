import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BudgetSection from './BudgetSection';
import { motion } from 'framer-motion';
import {
  FaProjectDiagram, FaBuilding, FaCheckCircle, FaUserTie,
  FaUserCircle, FaBug, FaStar, FaUsers, FaPlus, FaClipboardList, FaPhoneAlt
} from 'react-icons/fa';
import ResourceBreakdown from './ResourceBreakdown';


const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [leadName, setLeadName] = useState('Loading...');
  const [clientName, setClientName] = useState('Loading...');
  const [spoc, setSpoc] = useState(null);

  const [issues, setIssues] = useState([]);
  const [highlights, setHighlights] = useState([]);
  const [requiredResources, setRequiredResources] = useState([]);
  const [allocatedResources, setAllocatedResources] = useState([]);
  const [openPositions, setOpenPositions] = useState([]);

  const [budgetQuoted, setBudgetQuoted] = useState(0);
  const [budgetSpent, setBudgetSpent] = useState(0);
  const [budgetStatus, setBudgetStatus] = useState('');
  const [budgetBreakup, setBudgetBreakup] = useState({});
  const [projectRateMap, setProjectRateMap] = useState({});
  const [globalRateMap, setGlobalRateMap] = useState({});

  const [isResourceMatch, setIsResourceMatch] = useState(true);


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
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const projectRes = await axios.get(`http://localhost:8080/api/projects/${id}`, { headers });
        const projectData = projectRes.data;
        setProject(projectData);

        const [clientRes, leadRes, spocRes, issuesRes, highlightsRes, openPositionsRes, requiredRes, allocatedRes, projectRatesRes, globalRatesRes, budgetSpentRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/clients/${projectData.clientId}`, { headers }),
          axios.get(`http://localhost:8080/api/project-leads/project/${projectData.id}`, { headers }),
          axios.get(`http://localhost:8080/api/contact-persons/${projectData.id}`, { headers }),
          axios.get(`http://localhost:8080/api/issues/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/highlights/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/open-positions/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/resource-requirements/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/resources/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/ratecards/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/ratecards/global`, { headers }),
          axios.get(`http://localhost:8080/api/projects/${id}/budget-spent`, { headers })
        ]);

        setClientName(clientRes.data?.name || 'Unknown Client');
        setLeadName(leadRes.data?.userName || 'Unknown Lead');
        setSpoc(spocRes.data || null);
        setIssues(issuesRes.data || []);
        setHighlights(highlightsRes.data || []);
        setOpenPositions(openPositionsRes.data || []);
        setRequiredResources(requiredRes.data || []);
        setAllocatedResources(allocatedRes.data || []);
        setBudgetQuoted(projectData.budget || 0);
        setBudgetSpent(budgetSpentRes.data || 0);

        const projectRates = projectRatesRes.data || [];
        const globalRates = globalRatesRes.data || [];

        const projectRateObj = Object.fromEntries(projectRates.map((r) => [r.level, r.rate]));
        const globalRateObj = Object.fromEntries(globalRates.map((r) => [r.level, r.rate]));

        setProjectRateMap(projectRateObj);
        setGlobalRateMap(globalRateObj);

        const breakup = {};
        allocatedRes.data.forEach((res) => {
          const level = res.level;
          const rate = projectRateObj[level] || globalRateObj[level] || 0;
          const start = new Date(res.startDate);
          const end = new Date(res.endDate);
          const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
          const cost = rate * days;

          if (!breakup[level]) {
            breakup[level] = { rate, quantity: 1, days, total: cost };
          } else {
            breakup[level].quantity += 1;
            breakup[level].days += days;
            breakup[level].total += cost;
          }
        });

        setBudgetBreakup(breakup);

        const open = requiredRes.data.map((req) => {
          const allocatedCount = allocatedRes.data.filter((r) => r.level === req.level).length;
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

    if (id) fetchAllData();
    else {
      setError('Invalid project ID.');
      setLoading(false);
    }
  }, [id]);

  const allocatedMap = allocatedResources.reduce((acc, res) => {
    acc[res.level] = (acc[res.level] || 0) + 1;
    return acc;
  }, {});

  if (loading) return <div className="text-center py-20 text-gray-500 text-lg">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-600 text-lg">{error}</div>;

  return (
    <motion.div
      className="max-w-5xl mx-auto bg-white shadow-xl rounded-xl p-6 border border-gray-200"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b pb-3 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-indigo-800">{project?.projectName || 'Unnamed Project'}</h1>
          {/* <p className="text-xs text-gray-500 mt-0.5">Project ID: {project?.id || 'N/A'}</p> */}
        </div>
        <div>
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
            project?.status === 'ACTIVE' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
          }`}>
            <FaCheckCircle className="text-base" />
            {toTitleCase(project?.status)}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-900 mb-4">
        {[
          { icon: <FaProjectDiagram />, label: 'Type', value: project?.type },
          { icon: <FaBuilding />, label: 'Department', value: project?.department },
          { icon: <FaUserTie />, label: 'Project Lead', value: leadName },
          { icon: <FaUserCircle />, label: 'Client', value: clientName },
        ].map((info, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 bg-gray-50 rounded shadow-sm">
            {info.icon}
            <span>
              <span className="text-gray-500 font-medium">{info.label}:</span>{' '}
              <span className="font-semibold">{info.value || 'N/A'}</span>
            </span>
          </div>
        ))}
      </div>

      {/* SPOC Section */}
      {spoc && (
        <div className="bg-white border rounded-lg shadow-sm p-4 mb-6">
          <h3 className="text-md font-semibold text-indigo-600 mb-2 flex items-center gap-2">
            <FaPhoneAlt /> Point of Contact
          </h3>
          <p className="text-sm text-gray-800"><strong>Name:</strong> {spoc.name}</p>
          <p className="text-sm text-gray-800"><strong>Email:</strong> {spoc.email}</p>
        </div>
      )}

      {/* Resource Summary */}
      <ResourceBreakdown
        requiredResources={requiredResources}
        allocatedResources={allocatedResources}
      />

      {/* Budget Summary */}
      <div className="mt-4">
        <BudgetSection
          projectId={id}
          allocatedResources={allocatedResources}
          budgetQuoted={budgetQuoted}
        />
      </div>

      {/* Open Positions */}
      {openPositions.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-base font-semibold text-yellow-700 flex items-center gap-2">
              <FaClipboardList className="text-yellow-500" /> Open Positions
            </h2>
            <button
              onClick={() => navigate('/open-positions/add')}
              className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white text-xs rounded hover:bg-yellow-600"
            >
              <FaPlus /> Add
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {openPositions.map((pos, idx) => (
              <div key={idx} className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 text-sm">
                <p><strong>Level:</strong> {pos.level}</p>
                <p><strong>Required:</strong> {pos.required}</p>
                <p><strong>Open:</strong> {pos.remaining}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Allocated Resources Table */}
      {allocatedResources.length > 0 && (
        <div className="mt-6">
          <h2 className="text-base font-semibold text-indigo-700 flex items-center gap-2 mb-2">
            <FaUserTie className="text-indigo-500" /> Allocated Resources
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm bg-white border border-gray-300 rounded shadow-sm">
              <thead className="bg-indigo-100 text-indigo-800">
                <tr>
                  <th className="py-2 px-3 text-left">Name</th>
                  <th className="py-2 px-3 text-left">Level</th>
                  <th className="py-2 px-3 text-left">Start</th>
                  <th className="py-2 px-3 text-left">End</th>
                </tr>
              </thead>
              <tbody>
                {allocatedResources.map((res) => (
                  <tr key={res.id} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-3">{res.resourceName}</td>
                    <td className="py-2 px-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded-full">{res.level}</span>
                    </td>
                    <td className="py-2 px-3">{new Date(res.startDate).toLocaleDateString()}</td>
                    <td className="py-2 px-3">{new Date(res.endDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Highlights & Issues */}

      {(highlights.length > 0 || issues.length > 0) && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {highlights.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-blue-700 flex items-center gap-2 mb-2">
                <FaStar className="text-yellow-500" /> Highlights
              </h2>
              <div className="flex flex-col gap-3">
                {highlights.map((hl) => (
                  <div key={hl.id} className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-sm">
                    <h3 className="font-semibold text-blue-800 mb-1">{hl.title}</h3>
                    <p className="text-gray-600 mb-1"><strong>Description:</strong> {hl.description}</p>
                    <p className="text-gray-500 text-xs">Created On: {new Date(hl.createdOn).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {issues.length > 0 && (
            <div>
              <h2 className="text-base font-semibold text-red-700 flex items-center gap-2 mb-2">
                <FaBug className="text-red-500" /> Issues
              </h2>
              <div className="flex flex-col gap-3">
                {issues.map((issue) => (
                  <div key={issue.id} className="bg-red-50 p-3 rounded-xl border border-red-200 text-sm">
                    <h3 className="font-semibold text-red-800 mb-1">{issue.title}</h3>
                    <p className="text-gray-700 mb-1"><strong>Description:</strong> {issue.description}</p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <p><strong>Severity:</strong> <span className={`px-2 py-0.5 text-white rounded-full ${
                        issue.severity === 'HIGH' ? 'bg-red-600' :
                        issue.severity === 'MEDIUM' ? 'bg-orange-500' : 'bg-green-500'
                      }`}>{issue.severity}</span></p>
                      <p><strong>Status:</strong> <span className={`px-2 py-0.5 text-white rounded-full ${
                        issue.status === 'OPEN' ? 'bg-yellow-600' :
                        issue.status === 'RESOLVED' ? 'bg-green-600' : 'bg-gray-500'
                      }`}>{issue.status}</span></p>
                      <p><strong>Created By:</strong> {issue.createdBy}</p>
                      <p><strong>Created On:</strong> {new Date(issue.createdDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Back Button */}
      <div className="mt-6 text-right">
        <button
          onClick={() => navigate(-1)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded shadow"
        >
          ← Back to Projects
        </button>
      </div>
    </motion.div>

  );
};

export default ProjectDetail;