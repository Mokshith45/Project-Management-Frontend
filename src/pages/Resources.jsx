import React, { useState } from 'react';
import { motion } from 'framer-motion';

const resourceData = [
  {
    id: 1, resourceName: 'Ananya Mehta', startDate: '2024-05-01', endDate: '2024-09-30', projectId: null, exp: 2, allocated: false,
  },
  {
    id: 2, resourceName: 'Rohit Sharma', startDate: '2024-03-15', endDate: '2024-12-31', projectId: 101, exp: 4, allocated: true,
  },
  {
    id: 3, resourceName: 'Priya Raj', startDate: '2024-07-01', endDate: '2025-01-15', projectId: null, exp: 6, allocated: false,
  },
  {
    id: 4, resourceName: 'Karan Kapoor', startDate: '2024-01-10', endDate: '2024-10-10', projectId: 103, exp: 8, allocated: true,
  },
  {
    id: 5, resourceName: 'Sana Khan', startDate: '2024-06-01', endDate: '2024-12-01', projectId: null, exp: 10, allocated: false,
  },
  {
    id: 6, resourceName: 'Aman Verma', startDate: '2024-02-01', endDate: '2024-08-01', projectId: 104, exp: 3, allocated: true,
  },
  {
    id: 7, resourceName: 'Ishita Desai', startDate: '2024-04-15', endDate: '2024-11-15', projectId: null, exp: 5, allocated: false,
  },
  {
    id: 8, resourceName: 'Neeraj Yadav', startDate: '2024-01-01', endDate: '2024-07-30', projectId: 102, exp: 7, allocated: true,
  },
  {
    id: 9, resourceName: 'Ritika Joshi', startDate: '2024-08-01', endDate: '2025-01-31', projectId: null, exp: 4, allocated: false,
  },
  {
    id: 10, resourceName: 'Tanishq Singh', startDate: '2023-12-01', endDate: '2024-06-30', projectId: 105, exp: 6, allocated: true,
  },
];

const Resources = () => {
  const [filter, setFilter] = useState('all');

  const filteredData = resourceData.filter((res) => {
    if (filter === 'available') return !res.allocated;
    if (filter === 'allocated') return res.allocated;
    return true;
  });

  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-indigo-700">🧑‍💻 Resource Management</h2>
        <motion.select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          whileHover={{ scale: 1.03 }}
          whileFocus={{ borderColor: '#4f46e5' }}
          className="border border-gray-300 text-sm rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-indigo-300"
        >
          <option value="all">All</option>
          <option value="available">Available</option>
          <option value="allocated">Allocated</option>
        </motion.select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-700 border border-gray-200 rounded-lg shadow-sm">
          <thead className="text-xs text-white uppercase bg-gradient-to-r from-indigo-600 to-purple-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Experience</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Project ID</th>
              <th className="px-4 py-3">Timeline</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((res, index) => (
              <motion.tr
                key={res.id}
                className="border-b hover:bg-gray-50 transition"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="px-4 py-3 font-medium">{res.resourceName}</td>
                <td className="px-4 py-3">{res.exp} yrs</td>
                <td className="px-4 py-3">
                  <motion.span
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      res.allocated
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}
                  >
                    {res.allocated ? 'Allocated' : 'Available'}
                  </motion.span>
                </td>
                <td className="px-4 py-3">{res.allocated && res.projectId ? res.projectId : '—'}</td>
                <td className="px-4 py-3 text-sm">
                  {res.startDate} → {res.endDate}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default Resources;
