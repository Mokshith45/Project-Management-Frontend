import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [spoc, setSpoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [clientRes, projectsRes, resourcesRes, spocRes] = await Promise.all([
          axios.get(`http://localhost:8080/api/clients/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/projects/client/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/resources/project/${id}`, { headers }),
          axios.get(`http://localhost:8080/api/contact-persons/${id}`, { headers }),
        ]);

        setClient(clientRes.data);
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
        setResources(Array.isArray(resourcesRes.data) ? resourcesRes.data : []);
        setSpoc(spocRes.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load client details');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [id]);

  if (loading) return <div className="py-10 text-center text-gray-600">Loading client details...</div>;
  if (error) return <div className="py-10 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      {/* Heading */}
      <motion.h2
        className="text-3xl font-bold text-indigo-700"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        🧾 Client Overview
      </motion.h2>

      {/* Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Client Info Card */}
        <div className="bg-white rounded-lg border shadow-sm p-5 space-y-3">
          <h3 className="text-xl font-semibold text-gray-800">🧾 {client?.name}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            {client?.email || 'N/A'}
            <p><strong>Onboarded:</strong> {client?.onBoardedOn || 'N/A'}</p>
            <p><strong>Client Rating:</strong> {client?.clientRating || 'N/A'}</p>
          </div>
        </div>

        {/* Point of Contact Card */}
        {spoc && (
          <div className="bg-white rounded-lg border border-indigo-100 shadow-sm p-5 space-y-3">
            <h3 className="text-xl font-semibold text-indigo-700">📞 Point of Contact</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Name:</strong> {spoc.name}</p>
              <p><strong>Email:</strong> {spoc.email}</p>
            </div>
          </div>
        )}
      </div>


      {/* Projects */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <h3 className="text-2xl font-semibold text-purple-700 mb-3">📁 Projects</h3>
        {projects.length === 0 ? (
          <p className="text-sm text-gray-500">No projects found.</p>
        ) : (
          <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-purple-50 text-purple-800 font-semibold">
                <tr>
                  <th className="px-5 py-2">Project</th>
                  <th className="px-5 py-2">Department</th>
                  <th className="px-5 py-2">Status</th>
                  <th className="px-5 py-2">Budget</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                  <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-5 py-2 font-medium text-gray-800">{project.projectName}</td>
                    <td className="px-5 py-2 text-gray-600">{project.department}</td>
                    <td className="px-5 py-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        project.status === 'ACTIVE'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-5 py-2 text-gray-600">₹{project.budget.toLocaleString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Resources */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold text-green-700 mb-3">👩‍💼 Resources</h3>
        {resources.length === 0 ? (
          <p className="text-sm text-gray-500">No resources found.</p>
        ) : (
          <div className="overflow-x-auto bg-white border rounded-lg shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-green-50 text-green-700">
                <tr>
                  <th className="px-5 py-2 text-left">Name</th>
                  <th className="px-5 py-2 text-left">Level</th>
                  <th className="px-5 py-2 text-left">Start Date</th>
                  <th className="px-5 py-2 text-left">End Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-gray-50">
                    <td className="px-5 py-2">{res.resourceName}</td>
                    <td className="px-5 py-2">{res.level}</td>
                    <td className="px-5 py-2">{res.startDate}</td>
                    <td className="px-5 py-2">{res.endDate || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ClientDetail;
