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
  ArrowRight
} from 'lucide-react';

const TournamentHub = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:8001'}/api/tournaments`);
      setTournaments(response.data);
    } catch (error) {
      console.error('Error fetching tournaments:', error);
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Cricket Tournaments
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Create and join cricket tournaments based on real matches. 
              Compete with friends, win prizes, and prove your cricket knowledge!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-tournament"
                className="btn-primary px-8 py-4 text-lg flex items-center space-x-2 hover:scale-105 transform transition-transform"
              >
                <Plus className="w-5 h-5" />
                <span>Create Tournament</span>
              </Link>
              
              <Link
                to="/tournaments/browse"
                className="btn-secondary px-8 py-4 text-lg flex items-center space-x-2 hover:scale-105 transform transition-transform"
              >
                <Users className="w-5 h-5" />
                <span>Browse Tournaments</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Active Tournaments */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Active Tournaments
          </h2>

          {tournaments.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No tournaments yet
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-6">
                Be the first to create a cricket tournament!
              </p>
              <Link
                to="/create-tournament"
                className="btn-primary inline-flex items-center space-x-2"
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
                          <span className="text-sm">Participants</span>
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
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">
                          £{tournament.prizePool}
                        </p>
                      </div>
                    </div>

                    {tournament.entryFee > 0 && (
                      <div className="text-center mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Entry Fee: <span className="font-bold">£{tournament.entryFee}</span>
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => navigate(`/tournaments/${tournament.id}`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
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

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How Cricket Tournaments Work
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join the excitement of cricket tournaments with real money prizes and community competition
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Crown className="w-8 h-8" />,
                title: "Admin Creates",
                description: "Tournament admin sets up competition based on real cricket tournaments like IPL"
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: "Players Join",
                description: "Cricket fans join with entry fees, building the prize pool for winners"
              },
              {
                icon: <Timer className="w-8 h-8" />,
                title: "Live Auction",
                description: "Bid for real cricket players in timed auctions to build your dream squad"
              },
              {
                icon: <Trophy className="w-8 h-8" />,
                title: "Win Prizes",
                description: "Earn points from real player performances and compete for prize money"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4 text-blue-600 dark:text-blue-400">
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
    </div>
  );
};

export default TournamentHub;