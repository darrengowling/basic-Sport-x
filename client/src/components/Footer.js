import React from 'react';
import { Github, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for cricket fans</span>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              © 2024 Cricket Auction App
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-500">
          Real-time cricket auction experience with AI-powered predictions
        </div>
      </div>
    </footer>
  );
};

export default Footer;
