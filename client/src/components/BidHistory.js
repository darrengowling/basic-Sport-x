import React from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp } from 'lucide-react';

const BidHistory = ({ history = [] }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Bid History
        </h3>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {history.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {history.slice().reverse().map((bid, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      Team {bid.teamId}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(bid.timestamp)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg text-blue-600 dark:text-blue-400">
                      {formatCurrency(bid.amount)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No bids yet</p>
            <p className="text-sm">Bidding history will appear here</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default BidHistory;
