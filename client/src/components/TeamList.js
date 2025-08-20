import React from 'react';
import { motion } from 'framer-motion';
import { Users, PieChart, BarChart, Trophy, Star, DollarSign } from 'lucide-react';

const TeamList = ({ teams, budget }) => {
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
      'Bowler': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'All-rounder': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'Wicket-Keeper': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    };
    return colors[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const getSquadComposition = (players) => {
    const composition = {};
    players.forEach(player => {
      composition[player.role] = (composition[player.role] || 0) + 1;
    });
    return composition;
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Trophy className="w-6 h-6 text-blue-600" />
          <span>Live Teams</span>
        </h3>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {teams.length} team{teams.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {teams.map((team, index) => {
          const players = team.players || [];
          const squadComposition = getSquadComposition(players);
          const totalSpent = budget ? (budget - (team.remainingBudget || budget)) : 0;

          return (
            <motion.div
              key={team.id || index}
              className="border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Team Header */}
              <div className="p-4 bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {team.name?.charAt(0) || 'T'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {team.name || `Team ${index + 1}`}
                      </h4>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {players.length} player{players.length !== 1 ? 's' : ''} acquired
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {budget && (
                      <>
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">
                          Remaining: ₹{((team.remainingBudget || budget) / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Spent: ₹{(totalSpent / 1000000).toFixed(1)}M
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Squad Composition Summary */}
                {Object.keys(squadComposition).length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(squadComposition).map(([role, count]) => (
                      <span
                        key={role}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(role)}`}
                      >
                        {getRoleIcon(role)} {count} {role}{count > 1 ? 's' : ''}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Players List */}
              {players.length > 0 && (
                <div className="p-4">
                  <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span>Squad Players</span>
                  </h5>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {players.map((player, playerIndex) => (
                      <motion.div
                        key={player.id || playerIndex}
                        className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-600 rounded-lg"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: playerIndex * 0.05 }}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{getRoleIcon(player.role)}</span>
                          <div>
                            <div className="font-medium text-sm text-gray-900 dark:text-white">
                              {player.name}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {player.role} • {player.country}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-green-600 dark:text-green-400">
                            ₹{((player.soldPrice || player.basePrice || 0) / 1000000).toFixed(1)}M
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Rating: {player.rating || 'N/A'}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {players.length === 0 && (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No players acquired yet</p>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State for No Teams */}
      {teams.length === 0 && (
        <div className="p-8 text-center">
          <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500 dark:text-gray-400">No teams have joined yet</p>
        </div>
      )}
    </motion.div>
  );
};

export default TeamList;

