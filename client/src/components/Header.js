import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { Sun, Moon, Wifi, WifiOff, Trophy } from 'lucide-react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const { connected, roomState } = useSocket();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-xl font-bold text-blue-600 dark:text-blue-400">
            <Trophy className="w-6 h-6" />
            <span>Sport X</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/tournaments"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/tournaments') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Tournaments
            </Link>
            <Link
              to="/teams"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/teams') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Teams
            </Link>
            <Link
              to="/simulation"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/simulation') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              AI Simulation
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Room status */}
            {roomState && (
              <div className="hidden sm:flex items-center space-x-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Room:</span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {roomState.roomId}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium status-${roomState.status}`}>
                  {roomState.status}
                </span>
              </div>
            )}

            {/* Connection status */}
            <div className="flex items-center space-x-2">
              {connected ? (
                <div className="flex items-center space-x-1 text-green-600 dark:text-green-400">
                  <Wifi className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Connected</span>
                </div>
              ) : (
                <div className="flex items-center space-x-1 text-red-600 dark:text-red-400">
                  <WifiOff className="w-4 h-4" />
                  <span className="text-xs hidden sm:inline">Disconnected</span>
                </div>
              )}
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-around py-2">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Home
            </Link>
            <Link
              to="/teams"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/teams') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              Teams
            </Link>
            <Link
              to="/simulation"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/simulation') 
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' 
                  : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
              }`}
            >
              AI Simulation
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;