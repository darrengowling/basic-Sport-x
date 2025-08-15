import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import PlayerSelection from '../components/PlayerSelection';
import { 
  Trophy, 
  Calendar, 
  Users, 
  DollarSign,
  Settings,
  ArrowRight,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const CreateTournament = () => {
  const navigate = useNavigate();
  const [realTournaments, setRealTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    realTournament: '',
    entryFee: 5,
    maxParticipants: 8,
    budget: 50000000, // £50m
    squadRules: {
      batsmen: 4,
      bowlers: 4,
      allRounders: 2,
      wicketKeepers: 1,
      totalPlayers: 11
    },
    auctionDate: '',
    tournamentStart: '',
    tournamentEnd: ''
  });

  useEffect(() => {
    fetchRealTournaments();
  }, []);

  const fetchRealTournaments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_SERVER_URL || 'http://localhost:8001'}/api/real-tournaments`);
      setRealTournaments(response.data);
    } catch (error) {
      console.error('Error fetching real tournaments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: parseInt(value) || value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'entryFee' || name === 'maxParticipants' || name === 'budget' ? 
                parseInt(value) || 0 : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.realTournament) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.squadRules.batsmen + formData.squadRules.bowlers + 
        formData.squadRules.allRounders + formData.squadRules.wicketKeepers !== 
        formData.squadRules.totalPlayers) {
      toast.error('Squad composition must add up to total players');
      return;
    }

    setLoading(true);

    try {
      const adminId = localStorage.getItem('userId') || `admin_${Date.now()}`;
      localStorage.setItem('userId', adminId);

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_URL || 'http://localhost:8001'}/api/tournaments`,
        {
          adminId,
          settings: formData
        }
      );

      if (response.data.success) {
        toast.success('Tournament created successfully!');
        navigate(`/tournaments/${response.data.tournament.id}`);
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
      toast.error(error.response?.data?.error || 'Failed to create tournament');
    } finally {
      setLoading(false);
    }
  };

  const calculatePrizePool = () => {
    return formData.entryFee * formData.maxParticipants;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Create Tournament
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Set up a new cricket tournament for your community
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Info className="w-5 h-5" />
                  <span>Basic Information</span>
                </h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tournament Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Friends IPL 2024 Tournament"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Based on Real Tournament *
                    </label>
                    <select
                      name="realTournament"
                      value={formData.realTournament}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                      required
                    >
                      <option value="">Select real tournament</option>
                      {realTournaments.map(tournament => (
                        <option key={tournament.id} value={tournament.name}>
                          {tournament.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Tournament Settings */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Tournament Settings</span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Entry Fee (£)
                    </label>
                    <input
                      type="number"
                      name="entryFee"
                      value={formData.entryFee}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Max Participants
                    </label>
                    <input
                      type="number"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleInputChange}
                      min="2"
                      max="20"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Auction Budget (£)
                    </label>
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      min="1000000"
                      step="1000000"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* Prize Pool Display */}
                {formData.entryFee > 0 && (
                  <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div className="flex items-center space-x-2 text-green-800 dark:text-green-200">
                      <DollarSign className="w-5 h-5" />
                      <span className="font-semibold">
                        Total Prize Pool: £{calculatePrizePool()}
                      </span>
                    </div>
                    <p className="text-sm text-green-600 dark:text-green-300 mt-1">
                      {formData.maxParticipants} participants × £{formData.entryFee} entry fee
                    </p>
                  </div>
                )}
              </div>

              {/* Squad Rules */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Squad Composition Rules</span>
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Batsmen
                    </label>
                    <input
                      type="number"
                      name="squadRules.batsmen"
                      value={formData.squadRules.batsmen}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bowlers
                    </label>
                    <input
                      type="number"
                      name="squadRules.bowlers"
                      value={formData.squadRules.bowlers}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      All-rounders
                    </label>
                    <input
                      type="number"
                      name="squadRules.allRounders"
                      value={formData.squadRules.allRounders}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Wicket-keepers
                    </label>
                    <input
                      type="number"
                      name="squadRules.wicketKeepers"
                      value={formData.squadRules.wicketKeepers}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Total Players
                    </label>
                    <input
                      type="number"
                      name="squadRules.totalPlayers"
                      value={formData.squadRules.totalPlayers}
                      onChange={handleInputChange}
                      min="5"
                      max="15"
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Total: {formData.squadRules.batsmen + formData.squadRules.bowlers + 
                          formData.squadRules.allRounders + formData.squadRules.wicketKeepers} / {formData.squadRules.totalPlayers} players
                </div>
              </div>

              {/* Tournament Dates */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Important Dates</span>
                </h2>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Auction Date & Time
                    </label>
                    <input
                      type="datetime-local"
                      name="auctionDate"
                      value={formData.auctionDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tournament Start
                    </label>
                    <input
                      type="date"
                      name="tournamentStart"
                      value={formData.tournamentStart}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Tournament End
                    </label>
                    <input
                      type="date"
                      name="tournamentEnd"
                      value={formData.tournamentEnd}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-8 rounded-lg transition-colors duration-200 flex items-center space-x-2 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="loading-spinner"></div>
                      <span>Creating Tournament...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Tournament</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTournament;