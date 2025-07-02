import React from 'react';
import { motion } from 'framer-motion';
import { Users, Trophy, BarChart3 } from 'lucide-react';

const TeamManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Users className="w-16 h-16 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Team Management
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          View and manage your auction teams
        </p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <Users className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Team Overview
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              View all teams and their player compositions
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Team Rankings
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Compare teams based on various metrics
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <BarChart3 className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Analytics
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Detailed statistics and performance analysis
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            This feature is coming soon! Teams will be displayed here after completing an auction.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamManagement;
