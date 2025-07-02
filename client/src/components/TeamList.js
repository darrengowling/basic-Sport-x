import React from 'react';
import { motion } from 'framer-motion';
import { Users, PieChart, BarChart, BarChart2 } from 'lucide-react';

const TeamList = ({ teams, budget }) => {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold p-4 border-b border-gray-200 dark:border-gray-700">
        Team List
      </h3>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {teams.map((team, index) => (
          <li key={index} className="p-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Users className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              <span className="font-semibold text-gray-900 dark:text-white">
                {team.name}
              </span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {budget ? (
                <span>
                  Budget: {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(team.remainingBudget)}
                </span>
              ) : (
                <span>No Budget</span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="p-4 flex justify-around text-gray-600 dark:text-gray-300">
        <PieChart className="w-6 h-6" />
        <BarChart className="w-6 h-6" />
        <BarChart2 className="w-6 h-6" />
      </div>
    </motion.div>
  );
};

export default TeamList;

