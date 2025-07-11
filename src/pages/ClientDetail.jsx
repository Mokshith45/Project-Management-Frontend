import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const ClientDetail = () => {
  const { id } = useParams();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [spoc, setSpoc] = useState(null);


  useEffect(() => {
    const fetchClientData = async () => {
      setLoading(true);
      setError(null);
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

  if (loading) return <div className="p-6 text-gray-600">Loading client details...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.h2
        className="text-3xl font-bold text-indigo-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🧾 Client Details
      </motion.h2>

      {/* Client Info */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-10 border">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{client?.name}</h3>
        <p className="text-sm text-gray-600">
          <strong>Email:</strong> {client?.email || 'N/A'}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Onboarded:</strong> {client?.onBoardedOn}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Client Rating:</strong> {client?.clientRating || 'N/A'}
        </p>
      </div>

      {/* Projects List */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="mb-10"
        >
        <h3 className="text-2xl font-semibold text-purple-700 mb-4">📁 Projects</h3>

        {projects.length === 0 ? (
            <p className="text-sm text-gray-500">No projects found for this client.</p>
        ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-50">
                <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Project Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Budget</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                {projects.map((project) => (
                    <motion.tr
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="hover:bg-gray-50 transition"
                    >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                        {project.projectName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {project.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            project.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                        >
                        {project.status}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        ₹{project.budget.toLocaleString()}
                    </td>
                    </motion.tr>
                ))}
                </tbody>
            </table>
            </div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold text-indigo-700 mb-4">📞 Point of Contact</h3>
        {spoc && (
            <div className="bg-white rounded-xl shadow-md p-6 mb-10 border border-indigo-100">
                <p className="text-sm text-gray-700 mb-2">
                <strong>Name:</strong> {spoc.name}
                </p>
                <p className="text-sm text-gray-700">
                <strong>Email:</strong> {spoc.email}
                </p>
            </div>
            )}
      </motion.div>



      {/* Resources List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-semibold text-green-700 mb-4">👩‍💼 Resources Assigned</h3>
        {resources.length === 0 ? (
          <p className="text-sm text-gray-500">No resources found.</p>
        ) : (
          <div className="overflow-x-auto bg-white border rounded-lg shadow-md">
            <table className="min-w-full text-sm text-gray-800">
              <thead className="bg-green-50 text-green-700">
                <tr>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Level</th>
                  <th className="text-left px-4 py-2">Start Date</th>
                  <th className="text-left px-4 py-2">End Date</th>
                </tr>
              </thead>
              <tbody>
                {resources.map((res) => (
                  <tr key={res.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{res.resourceName}</td>
                    <td className="px-4 py-2">{res.level}</td>
                    <td className="px-4 py-2">{res.startDate}</td>
                    <td className="px-4 py-2">{res.endDate || 'N/A'}</td>
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
