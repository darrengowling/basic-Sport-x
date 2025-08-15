import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Users, 
  Trophy, 
  BarChart3, 
  TrendingUp,
  Star,
  DollarSign,
  Target,
  Award
} from 'lucide-react';

const TeamManagement = () => {
  const [tournaments, setTournaments] = useState([]);
  const [auctionRooms, setAuctionRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState('tournaments');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch tournaments
      const tournamentsResponse = await axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:8001'}/api/tournaments`);
      setTournaments(tournamentsResponse.data);
      
      // Note: Auction rooms API would need to be implemented
      // For now, we'll show tournaments
      
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerRoleIcon = (role) => {
    const icons = {
      'Batsman': '🏏',
      'Bowler': '⚡',
      'All-rounder': '🌟',
      'Wicket-Keeper': '🥅'
    };
    return icons[role] || '👤';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Team Management
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              View and manage teams from your tournaments and auctions
            </p>
          </div>

          {/* View Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-lg">
              <button
                onClick={() => setSelectedView('tournaments')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  selectedView === 'tournaments'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                Tournament Teams
              </button>
              <button
                onClick={() => setSelectedView('auctions')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  selectedView === 'auctions'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600'
                }`}
              >
                Quick Auction Teams
              </button>
            </div>
          </div>

          {/* Tournament Teams */}
          {selectedView === 'tournaments' && (
            <div className="space-y-8">
              {tournaments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                    No Tournament Teams Yet
                  </h3>
                  <p className="text-gray-500 dark:text-gray-500 mb-6">
                    Join or create tournaments to see teams here. Teams will appear after the auction phase is completed.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <a
                      href="/tournaments"
                      className="btn-primary inline-flex items-center space-x-2"
                    >
                      <Trophy className="w-5 h-5" />
                      <span>Browse Tournaments</span>
                    </a>
                    <a
                      href="/create-tournament"
                      className="btn-secondary inline-flex items-center space-x-2"
                    >
                      <Users className="w-5 h-5" />
                      <span>Create Tournament</span>
                    </a>
                  </div>
                </motion.div>
              ) : (
                <div className="grid gap-8">
                  {tournaments.map((tournament, index) => (
                    <motion.div
                      key={tournament.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700"
                    >
                      {/* Tournament Header */}
                      <div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {tournament.name}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                              {tournament.realTournament}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 dark:text-gray-400">Prize Pool</div>
                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                              {formatCurrency(tournament.prizePool)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                            <div className="text-sm text-gray-600 dark:text-gray-400">Participants</div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {tournament.participants}
                            </div>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400 mx-auto mb-1" />
                            <div className="text-sm text-gray-600 dark:text-gray-400">Entry Fee</div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(tournament.entryFee)}
                            </div>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                            <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
                            <div className="font-bold text-gray-900 dark:text-white capitalize">
                              {tournament.status.replace('_', ' ')}
                            </div>
                          </div>
                          
                          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mx-auto mb-1" />
                            <div className="text-sm text-gray-600 dark:text-gray-400">Budget</div>
                            <div className="font-bold text-gray-900 dark:text-white">
                              {formatCurrency(tournament.budget || 50000000)}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Teams Display */}
                      {tournament.status === 'created' || tournament.status === 'auction_scheduled' ? (
                        <div className="text-center py-8">
                          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                            Teams Not Available Yet
                          </h3>
                          <p className="text-gray-500 dark:text-gray-500">
                            Teams will be displayed here after the auction is completed
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                            <Users className="w-5 h-5" />
                            <span>Tournament Teams</span>
                          </h3>
                          
                          {/* This would show actual teams once auction is completed */}
                          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Example team structure - this would be populated with real data */}
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                              <div className="text-center mb-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white">Sample Team</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Captain: Team Owner</p>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Total Points:</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">0</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Budget Used:</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">£0</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Players:</span>
                                  <span className="font-semibold text-gray-900 dark:text-white">0/11</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Quick Auction Teams */}
          {selectedView === 'auctions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Quick Auction Teams Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Participate in quick auctions to see your teams here
              </p>
              <div className="flex justify-center space-x-4">
                <a
                  href="/create-room"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Trophy className="w-5 h-5" />
                  <span>Create Quick Auction</span>
                </a>
                <a
                  href="/join-room"
                  className="btn-secondary inline-flex items-center space-x-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Join Auction</span>
                </a>
              </div>
            </motion.div>
          )}

          {/* Stats Overview */}
          <div className="mt-12 grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Total Teams
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {tournaments.length}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Across all tournaments and auctions
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Active Tournaments
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {tournaments.filter(t => t.status !== 'completed').length}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Currently ongoing competitions
              </p>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Total Prize Pool
                </h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {formatCurrency(tournaments.reduce((sum, t) => sum + (t.prizePool || 0), 0))}
              </p>
              <p className="text-gray-600 dark:text-gray-300">
                Combined prize money
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TeamManagement;