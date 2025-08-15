import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Users, 
  Clock, 
  Zap, 
  Globe, 
  Monitor,
  ArrowRight,
  Play,
  Plus
} from 'lucide-react';

const HomePage = () => {
  const { registerUser } = useSocket();
  const navigate = useNavigate();

  useEffect(() => {
    // Register user with a unique ID
    const userId = localStorage.getItem('userId') || `user_${Date.now()}`;
    localStorage.setItem('userId', userId);
    registerUser(userId);
  }, [registerUser]);

  const features = [
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Real-time Auctions",
      description: "Experience live bidding with real-time updates and timer-based rounds"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multiplayer Support",
      description: "Play with friends locally or connect online with room codes"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "AI Predictions",
      description: "Get match predictions and tournament simulations powered by AI"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Multiple Modes",
      description: "Choose between budget auctions or friendly draft modes"
    }
  ];

  const auctionModes = [
    {
      title: "Standard Auction",
      description: "Real-time bidding with budget constraints and strategic gameplay",
      icon: <Trophy className="w-12 h-12" />,
      features: ["Budget Management", "Bidding Timer", "Price Increments", "Auction History"],
      color: "blue"
    },
    {
      title: "Friendly Draft",
      description: "Quick team selection without budget constraints for casual play",
      icon: <Users className="w-12 h-12" />,
      features: ["Turn-based Picking", "No Budget Limit", "Quick Setup", "Balanced Teams"],
      color: "green"
    }
  ];

  const multiplayerOptions = [
    {
      title: "Local Multiplayer",
      description: "Play with friends on the same device",
      icon: <Monitor className="w-8 h-8" />,
      action: () => navigate('/create-room'),
      buttonText: "Create Local Room"
    },
    {
      title: "Online Multiplayer",
      description: "Connect with players across different devices",
      icon: <Globe className="w-8 h-8" />,
      action: () => navigate('/create-room'),
      buttonText: "Create Online Room"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              <span className="text-blue-600 dark:text-blue-400">Sport X</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              The ultimate cricket auction platform with real-time bidding, AI predictions, 
              and multiplayer support
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/tournaments"
                className="btn-primary px-8 py-4 text-lg flex items-center space-x-2 hover:scale-105 transform transition-transform"
              >
                <Trophy className="w-5 h-5" />
                <span>Tournaments</span>
              </Link>
              
              <Link
                to="/create-room"
                className="btn-secondary px-8 py-4 text-lg flex items-center space-x-2 hover:scale-105 transform transition-transform"
              >
                <Play className="w-5 h-5" />
                <span>Quick Auction</span>
              </Link>
            </div>

            {/* Testing Guide Banner */}
            <div className="mt-8">
              <Link
                to="/testing-guide"
                className="inline-flex items-center space-x-2 bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900 dark:hover:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                <span>🧪</span>
                <span>New to Sport X? Check out our Testing Guide</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Sport X?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built for cricket enthusiasts with modern technology and intuitive design
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Auction Modes Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Auction Mode
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Select the perfect mode for your cricket team-building experience
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {auctionModes.map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-200 dark:border-gray-700"
              >
                <div className={`text-${mode.color}-600 dark:text-${mode.color}-400 mb-4`}>
                  {mode.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {mode.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {mode.description}
                </p>
                <ul className="space-y-2 mb-6">
                  {mode.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-gray-600 dark:text-gray-300">
                      <div className={`w-2 h-2 rounded-full bg-${mode.color}-600 dark:bg-${mode.color}-400`}></div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/create-room"
                  className={`btn-${mode.color === 'blue' ? 'primary' : 'success'} w-full flex items-center justify-center space-x-2`}
                >
                  <span>Create {mode.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Multiplayer Options Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Multiplayer Options
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Connect and compete with other cricket enthusiasts
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {multiplayerOptions.map((option, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center p-8 rounded-xl bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                  {option.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {option.description}
                </p>
                <button
                  onClick={option.action}
                  className="btn-primary w-full"
                >
                  {option.buttonText}
                </button>
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
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your Cricket Auction?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Build your dream cricket team with Sport X's advanced auction platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/create-room"
                className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Create Room</span>
              </Link>
              <Link
                to="/simulation"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Zap className="w-5 h-5" />
                <span>Try AI Simulation</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;