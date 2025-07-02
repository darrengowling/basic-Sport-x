import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, DollarSign, Award } from 'lucide-react';
import Confetti from 'react-confetti';

const AuctionSummary = ({ teams, auctionHistory }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTeamStats = (team) => {
    const soldPlayers = auctionHistory.filter(
      entry => entry.status === 'sold' && entry.soldTo === team.id
    );
    
    const totalSpent = soldPlayers.reduce((sum, entry) => sum + entry.soldPrice, 0);
    const averagePrice = soldPlayers.length > 0 ? totalSpent / soldPlayers.length : 0;
    
    const roleCount = {
      'Batsman': 0,
      'Bowler': 0,
      'All-rounder': 0,
      'Wicket-Keeper': 0
    };
    
    soldPlayers.forEach(entry => {
      if (roleCount.hasOwnProperty(entry.player.role)) {
        roleCount[entry.player.role]++;
      }
    });

    return {
      totalPlayers: soldPlayers.length,
      totalSpent,
      averagePrice,
      roleCount
    };
  };

  const getRoleIcon = (role) => {
    const icons = {
      'Batsman': '🏏',
      'Bowler': '⚾',
      'All-rounder': '🌟',
      'Wicket-Keeper': '🥅'
    };
    return icons[role] || '👤';
  };

  const sortedTeams = teams
    .map(team => ({ ...team, stats: getTeamStats(team) }))
    .sort((a, b) => b.stats.totalPlayers - a.stats.totalPlayers);

  const totalSoldPlayers = auctionHistory.filter(entry => entry.status === 'sold').length;
  const totalUnsoldPlayers = auctionHistory.filter(entry => entry.status === 'unsold').length;
  const highestSale = Math.max(...auctionHistory
    .filter(entry => entry.status === 'sold')
    .map(entry => entry.soldPrice), 0);

  return (
    <div className="space-y-8">
      <Confetti numberOfPieces={100} recycle={false} />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-8"
      >
        <Trophy className="w-16 h-16 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Auction Complete!</h1>
        <p className="text-xl opacity-90">All teams have been finalized</p>
      </motion.div>

      {/* Summary Stats */}
      <div className="grid md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
        >
          <Users className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalSoldPlayers}</div>
          <div className="text-gray-600 dark:text-gray-300">Players Sold</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
        >
          <Award className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{totalUnsoldPlayers}</div>
          <div className="text-gray-600 dark:text-gray-300">Players Unsold</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
        >
          <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
          <div className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(highestSale)}</div>
          <div className="text-gray-600 dark:text-gray-300">Highest Sale</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center"
        >
          <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{teams.length}</div>
          <div className="text-gray-600 dark:text-gray-300">Total Teams</div>
        </motion.div>
      </div>

      {/* Team Summaries */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">Team Summaries</h2>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {sortedTeams.map((team, index) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              {/* Team Header */}
              <div className={`bg-gradient-to-r ${
                index === 0 ? 'from-yellow-500 to-orange-500' :
                index === 1 ? 'from-gray-400 to-gray-600' :
                index === 2 ? 'from-orange-600 to-red-600' :
                'from-blue-500 to-purple-500'
              } text-white p-4`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">{team.name}</h3>
                    <p className="opacity-90">Owner: {team.owner}</p>
                  </div>
                  {index < 3 && (
                    <div className="text-3xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                    </div>
                  )}
                </div>
              </div>

              {/* Team Stats */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {team.stats.totalPlayers}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">Players</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400">
                      {formatCurrency(team.stats.totalSpent)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-300">Total Spent</div>
                  </div>
                </div>

                {/* Role Distribution */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">Team Composition</h4>
                  {Object.entries(team.stats.roleCount).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getRoleIcon(role)}</span>
                        <span className="text-gray-700 dark:text-gray-300">{role}</span>
                      </div>
                      <span className="font-semibold text-gray-900 dark:text-white">{count}</span>
                    </div>
                  ))}
                </div>

                {/* Average Price */}
                {team.stats.totalPlayers > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(team.stats.averagePrice)}
                      </div>
                      <div className="text-gray-600 dark:text-gray-300">Average per Player</div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuctionSummary;
