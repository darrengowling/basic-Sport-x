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
  ChevronRight,
  Target
} from 'lucide-react';

const CreateTournament = () => {
  const navigate = useNavigate();
  const [realTournaments, setRealTournaments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
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
    auctionSettings: {
      bidIncrement: 50000, // £50k
      bidTimeout: 30, // 30 seconds
      minimumBid: 100000 // £100k
    },
    auctionDate: '',
    tournamentStart: '',
    tournamentEnd: '',
    selectedPlayers: []
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

  const handlePlayersChange = (selectedPlayers) => {
    setFormData(prev => ({
      ...prev,
      selectedPlayers
    }));
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.realTournament) {
          toast.error('Please fill in tournament name and select a real tournament');
          return false;
        }
        break;
      case 2:
        if (formData.squadRules.batsmen + formData.squadRules.bowlers + 
            formData.squadRules.allRounders + formData.squadRules.wicketKeepers !== 
            formData.squadRules.totalPlayers) {
          toast.error('Squad composition must add up to total players');
          return false;
        }
        break;
      case 3:
        if (formData.selectedPlayers.length === 0) {
          toast.error('Please select at least one player for the auction');
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
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
          settings: {
            ...formData,
            selectedPlayers: formData.selectedPlayers.map(p => p.id)
          }
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

  const getStepTitle = (step) => {
    const titles = {
      1: 'Basic Information',
      2: 'Tournament Settings',
      3: 'Select Players',
      4: 'Review & Create'
    };
    return titles[step];
  };

  const getStepIcon = (step) => {
    const icons = {
      1: <Info className="w-5 h-5" />,
      2: <Settings className="w-5 h-5" />,
      3: <Users className="w-5 h-5" />,
      4: <Trophy className="w-5 h-5" />
    };
    return icons[step];
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

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {step < currentStep ? (
                      <ArrowRight className="w-5 h-5" />
                    ) : (
                      <span className="font-semibold">{step}</span>
                    )}
                  </div>
                  {step < totalSteps && (
                    <div className={`w-8 h-1 mx-2 ${
                      step < currentStep
                        ? 'bg-blue-600'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center justify-center space-x-2">
                {getStepIcon(currentStep)}
                <span>Step {currentStep}: {getStepTitle(currentStep)}</span>
              </h2>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit}>
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
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

                  {formData.entryFee > 0 && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
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
                </motion.div>
              )}

              {/* Step 2: Tournament Settings */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Squad Rules */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Squad Composition Rules
                    </h3>
                    
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

                  {/* Auction Settings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Auction Rules
                    </h3>
                    
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bid Increment (£)
                        </label>
                        <input
                          type="number"
                          name="auctionSettings.bidIncrement"
                          value={formData.auctionSettings.bidIncrement}
                          onChange={handleInputChange}
                          min="10000"
                          step="10000"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Minimum amount to increase bid by
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Bid Timer (seconds)
                        </label>
                        <input
                          type="number"
                          name="auctionSettings.bidTimeout"
                          value={formData.auctionSettings.bidTimeout}
                          onChange={handleInputChange}
                          min="10"
                          max="120"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Time limit for each player auction
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Minimum Bid (£)
                        </label>
                        <input
                          type="number"
                          name="auctionSettings.minimumBid"
                          value={formData.auctionSettings.minimumBid}
                          onChange={handleInputChange}
                          min="50000"
                          step="50000"
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white"
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Starting bid for all players
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tournament Dates */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                      <Calendar className="w-5 h-5" />
                      <span>Important Dates</span>
                    </h3>
                    
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
                </motion.div>
              )}

              {/* Step 3: Player Selection */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <PlayerSelection
                    selectedPlayers={formData.selectedPlayers}
                    onPlayersChange={handlePlayersChange}
                    tournamentId={formData.realTournament}
                  />
                </motion.div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Review Tournament Details
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Name:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Based on:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.realTournament}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Entry Fee:</span>
                          <span className="font-medium text-gray-900 dark:text-white">£{formData.entryFee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Prize Pool:</span>
                          <span className="font-medium text-green-600 dark:text-green-400">£{calculatePrizePool()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Settings */}
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Tournament Settings</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Max Participants:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.maxParticipants}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                          <span className="font-medium text-gray-900 dark:text-white">£{(formData.budget / 1000000).toFixed(0)}M</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Squad Size:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{formData.squadRules.totalPlayers} players</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Selected Players:</span>
                          <span className="font-medium text-blue-600 dark:text-blue-400">{formData.selectedPlayers.length}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Selected Players Preview */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-4">
                      Selected Players ({formData.selectedPlayers.length})
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      {['Batsman', 'Bowler', 'All-rounder', 'Wicket-Keeper'].map(role => {
                        const count = formData.selectedPlayers.filter(p => p.role === role).length;
                        return (
                          <div key={role} className="text-center">
                            <div className="text-blue-700 dark:text-blue-300 font-bold text-lg">{count}</div>
                            <div className="text-blue-600 dark:text-blue-400">{role}s</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center space-x-2 px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold rounded-lg transition-colors"
                  >
                    {loading ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Creating...</span>
                      </>
                    ) : (
                      <>
                        <Trophy className="w-5 h-5" />
                        <span>Create Tournament</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTournament;