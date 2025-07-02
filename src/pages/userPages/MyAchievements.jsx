import React from 'react';
import { motion } from 'framer-motion';

const achievements = [
  {
    id: 1,
    title: 'Sprint Champion - Q2 2024',
    description: 'Awarded for leading the sprint with high-quality deliverables.',
    date: '2024-06-01'
  },
  {
    id: 2,
    title: 'Client Appreciation',
    description: 'Received direct appreciation from Acme Corp for quick turnaround.',
    date: '2024-05-25'
  },
  {
    id: 3,
    title: 'Bug Buster Award',
    description: 'Resolved the highest number of critical issues in May.',
    date: '2024-05-20'
  }
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.15,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 }
};

const MyAchievements = () => {
  return (
    <motion.div
      className="pt-10 px-6 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.h2
        className="text-2xl font-bold text-indigo-700 mb-6"
        variants={cardVariants}
      >
        🏆 My Achievements
      </motion.h2>

      <motion.div
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
        variants={containerVariants}
      >
        {achievements.map((ach) => (
          <motion.div
            key={ach.id}
            className="bg-white border border-indigo-100 p-4 rounded-lg shadow hover:shadow-lg transition-all"
            variants={cardVariants}
            whileHover={{ scale: 1.03 }}
          >
            <h3 className="text-lg font-semibold text-indigo-800">{ach.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{ach.description}</p>
            <p className="text-xs text-gray-500 mt-2">📅 {ach.date}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default MyAchievements;
