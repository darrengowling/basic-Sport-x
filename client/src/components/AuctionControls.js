import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gavel, Play, SkipForward, Plus, UserPlus } from 'lucide-react';
import { toast } from 'react-toastify';

const AuctionControls = ({ status, currentAuction }) => {
  const [bidAmount, setBidAmount] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [showAddTeam, setShowAddTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamOwner, setNewTeamOwner] = useState('');
  
  const { roomState, placeBid, startAuction, nextPlayer, addTeam } = useSocket();
  const { roomId } = useParams();

  const handlePlaceBid = () => {
    if (!selectedTeam) {
      toast.error('Please select a team');
      return;
    }

    if (!bidAmount || isNaN(bidAmount) || Number(bidAmount) <= 0) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    const amount = Number(bidAmount);
    const currentBid = currentAuction?.currentBid || 0;

    if (roomState.settings.mode === 'standard' && amount <= currentBid) {
      toast.error('Bid must be higher than current bid');
      return;
    }

    placeBid(roomId, selectedTeam, amount);
    setBidAmount('');
  };

  const handleStartAuction = () => {
    if (roomState.teams.length < 2) {
      toast.error('Need at least 2 teams to start auction');
      return;
    }
    startAuction(roomId);
  };

  const handleNextPlayer = () => {
    nextPlayer(roomId);
  };

  const handleAddTeam = () => {
    if (!newTeamName.trim() || !newTeamOwner.trim()) {
      toast.error('Please fill in all team details');
      return;
    }

    const teamData = {
      name: newTeamName.trim(),
      owner: newTeamOwner.trim()
    };

    addTeam(roomId, teamData);
    setNewTeamName('');
    setNewTeamOwner('');
    setShowAddTeam(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getNextBidAmount = () => {
    const currentBid = currentAuction?.currentBid || 0;
    const increment = roomState.settings.mode === 'standard' ? 100000 : 0;
    return currentBid + increment;
  };

  if (status === 'waiting') {
    return (
      <div className="space-y-6">
        {/* Add Team Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Team Management
            </h3>
            <button
              onClick={() => setShowAddTeam(!showAddTeam)}
              className="btn-primary flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team</span>
            </button>
          </div>

          {showAddTeam && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid md:grid-cols-2 gap-4 mb-4"
            >
              <input
                type="text"
                placeholder="Team Name"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Owner Name"
                value={newTeamOwner}
                onChange={(e) => setNewTeamOwner(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <div className="md:col-span-2 flex space-x-2">
                <button
                  onClick={handleAddTeam}
                  className="btn-success flex-1"
                >
                  Add Team
                </button>
                <button
                  onClick={() => setShowAddTeam(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Start Auction */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Ready to Start?
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {roomState.teams.length} team(s) in the room
          </p>
          <button
            onClick={handleStartAuction}
            disabled={roomState.teams.length < 2}
            className="btn-primary px-8 py-3 text-lg flex items-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5" />
            <span>Start Auction</span>
          </button>
        </div>
      </div>
    );
  }

  if (status === 'active' && currentAuction) {
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {/* Bidding Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Gavel className="w-5 h-5 mr-2" />
            Place Bid
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Team
              </label>
              <select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Choose Team</option>
                {roomState.teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} - {formatCurrency(team.remainingBudget)} left
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bid Amount
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  placeholder={`Min: ${formatCurrency(getNextBidAmount())}`}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => setBidAmount(getNextBidAmount().toString())}
                  className="btn-secondary px-3 py-2"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePlaceBid}
              disabled={!selectedTeam || !bidAmount}
              className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Place Bid
            </motion.button>
          </div>
        </div>

        {/* Host Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Host Controls
          </h3>

          <div className="space-y-4">
            <button
              onClick={handleNextPlayer}
              className="w-full btn-secondary py-3 flex items-center justify-center space-x-2"
            >
              <SkipForward className="w-5 h-5" />
              <span>Next Player</span>
            </button>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              <p>Current Player: {currentAuction.player.name}</p>
              <p>Time Left: {currentAuction.timeLeft}s</p>
              <p>Current Bid: {formatCurrency(currentAuction.currentBid)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuctionControls;
