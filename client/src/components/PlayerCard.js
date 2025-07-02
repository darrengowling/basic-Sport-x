import React from 'react';
import { motion } from 'framer-motion';
import { Flag, TrendingUp, Clock, Gavel } from 'lucide-react';

const PlayerCard = ({ player, auction }) => {
  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      'Batsman': 'role-batsman',
      'Bowler': 'role-bowler',
      'All-rounder': 'role-allrounder',
      'Wicket-Keeper': 'role-wicketkeeper'
    };
    return roleClasses[role] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTimerClass = (timeLeft) => {
    if (timeLeft <= 5) return 'text-red-500 timer-warning';
    if (timeLeft <= 10) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold">{player.name}</h2>
            <div className="flex items-center space-x-2 mt-2">
              <Flag className="w-4 h-4" />
              <span className="text-blue-100">{player.country}</span>
              <span className="text-blue-100">•</span>
              <span className="text-blue-100">Age {player.age}</span>
            </div>
          </div>
          <div className="text-right">
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeClass(player.role)}`}>
              {player.role}
            </div>
            <div className="mt-2 text-blue-100">
              Rating: <span className="font-bold text-white">{player.rating}/100</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-blue-100 text-sm">Experience</div>
            <div className="font-bold text-lg">{player.experience} years</div>
          </div>
          {player.battingAverage && (
            <div>
              <div className="text-blue-100 text-sm">Batting Avg</div>
              <div className="font-bold text-lg">{player.battingAverage}</div>
            </div>
          )}
          {player.bowlingAverage && (
            <div>
              <div className="text-blue-100 text-sm">Bowling Avg</div>
              <div className="font-bold text-lg">{player.bowlingAverage}</div>
            </div>
          )}
          <div>
            <div className="text-blue-100 text-sm">Base Price</div>
            <div className="font-bold text-lg">{formatCurrency(player.basePrice)}</div>
          </div>
        </div>
      </div>

      {/* Auction Info */}
      <div className="p-6">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Current Bid */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Gavel className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Current Bid</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(auction.currentBid)}
            </div>
            {auction.highestBidder && (
              <div className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                Highest Bidder: Team {auction.highestBidder}
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Time Left</span>
            </div>
            <div className={`text-3xl font-bold ${getTimerClass(auction.timeLeft)}`}>
              {auction.timeLeft}s
            </div>
          </div>

          {/* Bid Count */}
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-gray-600 dark:text-gray-300 mr-2" />
              <span className="text-gray-600 dark:text-gray-300">Total Bids</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {auction.biddingHistory.length}
            </div>
          </div>
        </div>

        {/* Bid History Preview */}
        {auction.biddingHistory.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Recent Bids
            </h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {auction.biddingHistory.slice(-3).reverse().map((bid, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded"
                >
                  <span className="text-gray-700 dark:text-gray-300">
                    Team {bid.teamId}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(bid.amount)}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default PlayerCard;
