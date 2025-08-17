import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Trophy, 
  Users, 
  Plus, 
  Calendar,
  DollarSign,
  Crown,
  Timer,
  ArrowRight,
  Target,
  Zap
} from 'lucide-react';

const KabaddiHub = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:8001'}/api/kabaddi-tournaments`);
      setTournaments(response.data);
    } catch (error) {
      console.error('Error fetching kabaddi tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      created: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      auction_scheduled: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      auction_active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      tournament_active: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status] || colors.created;
  };

  const getStatusText = (status) => {
    const text = {
      created: 'Open for Entries',
      auction_scheduled: 'Auction Scheduled',
      auction_active: 'Auction Live',
      tournament_active: 'Tournament Active',
      completed: 'Completed'
    };
    return text[status] || 'Unknown';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-6">
              <Target className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              🤾‍♂️ Sport X Kabaddi
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Create and join Kabaddi tournaments based on Pro Kabaddi League. 
              Auction players, track performances, and compete for prizes!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-kabaddi-tournament"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-4 text-lg flex items-center space-x-2 hover:scale-105 transform transition-transform rounded-lg"
              >
                <Plus className="w-5 h-5" />
                <span>Create Kabaddi Tournament</span>
              </Link>
              
              <Link
                to="/kabaddi-tournaments/browse"
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-orange-600 dark:text-orange-400 border-2 border-orange-600 dark:border-orange-400 font-semibold px-8 py-4 text-lg flex items-center space-x-2 hover:scale-105 transform transition-transform rounded-lg"
              >
                <Users className="w-5 h-5" />
                <span>Browse Tournaments</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pro Kabaddi League 2024 Banner */}
      <section className="py-8 bg-orange-600 dark:bg-orange-700">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center text-white"
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              🚨 Pro Kabaddi League 2024 Starts Soon!
            </h2>
            <p className="text-orange-100 mb-4">
              Perfect timing to create your Kabaddi tournament. Season starts in 2 weeks!
            </p>
            <div className="flex justify-center items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Zap className="w-4 h-4" />
                <span>Live Performance Tracking</span>
              </div>
              <div className="flex items-center space-x-1">
                <Target className="w-4 h-4" />
                <span>Real PKL Players</span>
              </div>
              <div className="flex items-center space-x-1">
                <Trophy className="w-4 h-4" />
                <span>Prize Tournaments</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Tournaments */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Active Kabaddi Tournaments
          </h2>

          {tournaments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No Kabaddi tournaments yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Be the first to create a Kabaddi tournament for PKL 2024!
              </p>
              <Link
                to="/create-kabaddi-tournament"
                className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg inline-flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Tournament</span>
              </Link>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament, index) => (
                <motion.div
                  key={tournament.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-600 overflow-hidden"
                >
                  {/* Tournament Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                        {tournament.name}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
                        {getStatusText(tournament.status)}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {tournament.realTournament}
                    </p>
                  </div>

                  {/* Tournament Stats */}
                  <div className="p-6">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400 mb-1">
                          <Users className="w-4 h-4" />
                          <span className="text-sm">Teams</span>
                        </div>
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {tournament.participants}/{tournament.maxParticipants}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-sm">Prize Pool</span>
                        </div>
                        <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
                          £{tournament.prizePool}
                        </p>
                      </div>
                    </div>

                    {tournament.entryFee > 0 && (
                      <div className="text-center mb-4 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <p className="text-sm text-orange-800 dark:text-orange-200">
                          Entry Fee: <span className="font-bold">£{tournament.entryFee}</span>
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/kabaddi-tournaments/${tournament.id}`)}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>View Tournament</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How Kabaddi Tournaments Work */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Kabaddi Tournaments Work
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the thrill of Kabaddi with real player auctions and live performance tracking
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Crown className="w-8 h-8" />,
                title: "Create Tournament",
                description: "Set up based on Pro Kabaddi League with custom rules and entry fees"
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Auction Players",
                description: "Bid for real PKL raiders, defenders, and all-rounders to build your team"
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "Track Performance",
                description: "Earn points from raid points, tackles, super raids, and all-outs"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Win Prizes",
                description: "Compete for prize money based on real PKL match performances"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full mb-4 text-orange-600 dark:text-orange-400">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Kabaddi Points System */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Kabaddi Scoring System
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Points based on real Kabaddi performance metrics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { metric: 'Raid Points', points: '2 pts each', icon: '🏃‍♂️' },
              { metric: 'Tackle Points', points: '3 pts each', icon: '🛡️' },
              { metric: 'Bonus Points', points: '1 pt each', icon: '⭐' },
              { metric: 'Super Raid', points: '5 pts bonus', icon: '💥' },
              { metric: 'Super Tackle', points: '3 pts bonus', icon: '🔥' },
              { metric: 'All Out', points: '10 pts bonus', icon: '💪' },
              { metric: 'Technical Point', points: '1 pt each', icon: '📋' },
              { metric: 'Empty Raid', points: '-1 pt', icon: '❌' }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center"
              >
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                  {item.metric}
                </h4>
                <p className="text-orange-600 dark:text-orange-400 font-bold text-sm">
                  {item.points}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Pro Kabaddi League 2024?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Create your Kabaddi tournament now and be ready for the season launch!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-kabaddi-tournament"
                className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Tournament</span>
              </Link>
              <Link
                to="/testing-guide"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Timer className="w-5 h-5" />
                <span>View Testing Guide</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default KabaddiHub;