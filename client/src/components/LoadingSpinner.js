import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ text = 'Loading...', size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center space-y-4"
    >
      <div className={`${sizeClasses[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
      {text && (
        <p className="text-gray-600 dark:text-gray-300 animate-pulse">
          {text}
        </p>
      )}
    </motion.div>
  );
};

export default LoadingSpinner;
