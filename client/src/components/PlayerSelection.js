import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Search, 
  Filter,
  Users,
  Star,
  Check,
  X,
  Target
} from 'lucide-react';

const PlayerSelection = ({ selectedPlayers, onPlayersChange }) => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  useEffect(() => {
    filterPlayers();
  }, [allPlayers, searchTerm, roleFilter, countryFilter]);

  const fetchPlayers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:8001'}/api/players`);
      setAllPlayers(response.data);
    } catch (error) {
      console.error('Error fetching players:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPlayers = () => {
    let filtered = [...allPlayers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(player =>
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        player.country.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(player => player.role === roleFilter);
    }

    // Country filter
    if (countryFilter !== 'all') {
      filtered = filtered.filter(player => player.country === countryFilter);
    }

    setFilteredPlayers(filtered);
  };

  const togglePlayerSelection = (player) => {
    const isSelected = selectedPlayers.some(p => p.id === player.id);
    let newSelection;

    if (isSelected) {
      newSelection = selectedPlayers.filter(p => p.id !== player.id);
    } else {
      newSelection = [...selectedPlayers, player];
    }

    onPlayersChange(newSelection);
  };

  const selectAllVisible = () => {
    const newPlayers = filteredPlayers.filter(
      player => !selectedPlayers.some(sp => sp.id === player.id)
    );
    onPlayersChange([...selectedPlayers, ...newPlayers]);
  };

  const clearSelection = () => {
    onPlayersChange([]);
  };

  const getUniqueRoles = () => {
    return [...new Set(allPlayers.map(player => player.role))];
  };

  const getUniqueCountries = () => {
    return [...new Set(allPlayers.map(player => player.country))].sort();
  };

  const getRoleIcon = (role) => {
    const icons = {
      'Batsman': '🏏',
      'Bowler': '⚡',
      'All-rounder': '🌟',
      'Wicket-Keeper': '🥅'
    };
    return icons[role] || '👤';
  };

  const getRoleColor = (role) => {
    const colors = {
      'Batsman': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'Bowler': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      'All-rounder': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Wicket-Keeper': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>Select Players for Auction</span>
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Choose which players will be available in this tournament auction
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400">Selected Players</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {selectedPlayers.length} / {allPlayers.length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
        <div className="grid md:grid-cols-4 gap-4 mb-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
          >
            <option value="all">All Roles</option>
            {getUniqueRoles().map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>

          {/* Country Filter */}
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
          >
            <option value="all">All Countries</option>
            {getUniqueCountries().map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            <button
              onClick={selectAllVisible}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
            >
              Clear All
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing {filteredPlayers.length} of {allPlayers.length} players
        </div>
      </div>

      {/* Player Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {filteredPlayers.map((player, index) => {
          const isSelected = selectedPlayers.some(p => p.id === player.id);
          
          return (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className={`relative p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                isSelected
                  ? 'bg-blue-50 border-blue-300 dark:bg-blue-900/20 dark:border-blue-600'
                  : 'bg-white border-gray-200 dark:bg-gray-700 dark:border-gray-600 hover:border-blue-300'
              }`}
              onClick={() => togglePlayerSelection(player)}
            >
              {/* Selection indicator */}
              <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center ${
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 text-gray-400'
              }`}>
                {isSelected ? <Check className="w-4 h-4" /> : <div className="w-2 h-2 bg-current rounded-full opacity-50" />}
              </div>

              {/* Player info */}
              <div className="pr-8">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {player.name}
                </h4>
                
                <div className="flex items-center space-x-1 mb-2">
                  <span className="text-lg">{getRoleIcon(player.role)}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(player.role)}`}>
                    {player.role}
                  </span>
                </div>

                <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <div className="flex items-center space-x-1">
                    <span>🏴</span>
                    <span>{player.country}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    <span>Rating: {player.rating}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-green-500" />
                    <span>Base: £{(player.basePrice / 1000000).toFixed(1)}M</span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-8">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">
            No players found matching your filters
          </p>
        </div>
      )}

      {/* Selection Summary */}
      {selectedPlayers.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            Selection Summary ({selectedPlayers.length} players)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {getUniqueRoles().map(role => {
              const count = selectedPlayers.filter(p => p.role === role).length;
              return (
                <div key={role} className="text-center">
                  <div className="text-blue-700 dark:text-blue-300 font-medium">{count}</div>
                  <div className="text-blue-600 dark:text-blue-400">{role}s</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSelection;