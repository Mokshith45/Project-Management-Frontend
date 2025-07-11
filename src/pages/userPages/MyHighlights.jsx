import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [hlRes, projRes] = await Promise.all([
          axios.get('http://localhost:8080/api/highlights'),
          axios.get('http://localhost:8080/api/projects')
        ]);
        setHighlights(hlRes.data || []);
        setProjects(projRes.data || []);
      } catch (err) {
        setError('Failed to fetch highlights or projects.');
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const projectMap = Array.isArray(projects)
    ? projects.reduce((acc, proj) => {
        acc[proj.id] = proj;
        return acc;
      }, {})
    : {};

  const grouped = highlights.reduce((acc, hl) => {
    const pid = hl.projectId;
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(hl);
    return acc;
  }, {});

  // Sort each project's highlights by date (descending)
  Object.values(grouped).forEach(list =>
    list.sort((a, b) => new Date(b.createdOn) - new Date(a.createdOn))
  );

  if (loading) return <p className="p-6 text-center">Loading highlights...</p>;
  if (error) return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-indigo-700 mb-8"
      >
        📌 Project Highlights
      </motion.h2>

      {Object.entries(grouped).map(([projectId, highlightsList]) => {
        const project = projectMap[projectId];
        const projectName = project?.name || 'Unknown Project';
        const projectDesc = project?.description || '';

        return (
          <motion.div
            key={projectId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white shadow border rounded-lg mb-8 p-5"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
                  📁 {projectName}
                </h3>
                <p className="text-sm text-gray-500">{projectDesc}</p>
                <span className="text-xs text-indigo-500 font-medium">
                  {highlightsList.length} Highlight{highlightsList.length > 1 ? 's' : ''}
                </span>
              </div>

              {/* View Project (optional route) */}
              {project && (
                <button
                  onClick={() => alert(`Navigate to /projects/${project.id}`)}
                  className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md shadow"
                >
                  View Project
                </button>
              )}
            </div>

            <ol className="relative border-l border-indigo-300 pl-4 ml-2">
              {highlightsList.map((hl) => {
                const isRecent = differenceInDays(new Date(), new Date(hl.createdOn)) <= 7;

                return (
                  <li key={hl.id} className="mb-6 relative ml-4">
                    <span className="absolute w-4 h-4 bg-indigo-600 rounded-full -left-5 top-1.5"></span>
                    <h4 className="font-semibold text-gray-800">{hl.description}</h4>
                    <p className="text-sm text-gray-500">
                      📅 {format(new Date(hl.createdOn), 'yyyy-MM-dd')}
                      {isRecent && (
                        <span className="ml-2 inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </p>
                  </li>
                );
              })}
            </ol>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Highlights;
