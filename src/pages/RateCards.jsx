import React, { useState } from 'react';
import { motion } from 'framer-motion';

const initialRateCard = [
  { id: 1, role: 'Junior Developer', rate: 1500 },
  { id: 2, role: 'Mid Developer', rate: 2500 },
  { id: 3, role: 'Senior Developer', rate: 3500 },
  { id: 4, role: 'Advanced Developer', rate: 4500 },
  { id: 5, role: 'Expert', rate: 7000 },
];

// Animation Variants
const rowVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, type: 'spring', stiffness: 80 },
  }),
};

const RateCards = () => {
  const [rates, setRates] = useState(initialRateCard);

  const handleRateChange = (id, newRate) => {
    const updatedRates = rates.map((item) =>
      item.id === id ? { ...item, rate: newRate } : item
    );
    setRates(updatedRates);
  };

  return (
    <div>
      <motion.h2
        className="text-2xl font-bold text-indigo-700 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Global Rate Card (INR per Day)
      </motion.h2>

      <div className="overflow-x-auto">
        <motion.table
          className="min-w-full bg-white rounded-xl shadow-md border border-gray-200"
          initial="hidden"
          animate="visible"
        >
          <thead className="bg-indigo-50 text-indigo-700">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Per Day (₹)</th>
              <th className="px-6 py-3 text-left text-sm font-medium">Update</th>
            </tr>
          </thead>
          <tbody>
            {rates.map((item, index) => (
              <motion.tr
                key={item.id}
                custom={index}
                variants={rowVariants}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4 text-gray-700">{item.role}</td>
                <td className="px-6 py-4">
                  <motion.input
                    type="number"
                    value={item.rate}
                    onChange={(e) =>
                      handleRateChange(item.id, parseInt(e.target.value))
                    }
                    className="w-32 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    whileFocus={{ scale: 1.02 }}
                  />
                </td>
                <td className="px-6 py-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1 rounded text-sm transition-all"
                  >
                    Save
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </motion.table>
      </div>
    </div>
  );
};

export default RateCards;
