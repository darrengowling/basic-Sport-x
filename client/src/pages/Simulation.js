import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain, Trophy, Target } from 'lucide-react';

const Simulation = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <Zap className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          AI Match Simulation
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Powered by Google Gemini AI for intelligent match predictions
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <Brain className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Match Prediction
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Compare two teams and get AI-powered match outcome predictions
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <Trophy className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Tournament Simulation
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Simulate entire tournaments with multiple teams and formats
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <Target className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Player Analysis
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Get insights on individual player performance and impact
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
            <Zap className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Real-time Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Live analysis during auctions to help with bidding decisions
            </p>
          </div>
        </div>
        
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">How AI Simulation Works</h2>
            <div className="space-y-4 text-left">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
                <div>
                  <h4 className="font-semibold">Team Analysis</h4>
                  <p className="opacity-90">AI analyzes team composition, player ratings, and role balance</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
                <div>
                  <h4 className="font-semibold">Performance Prediction</h4>
                  <p className="opacity-90">Considers player statistics, experience, and recent form</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
                <div>
                  <h4 className="font-semibold">Match Simulation</h4>
                  <p className="opacity-90">Provides win probability, key players, and strategic insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12">
          <p className="text-gray-500 dark:text-gray-400">
            Complete an auction first to unlock AI simulation features for your teams!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Simulation;
