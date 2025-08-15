import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Trophy,
  Target,
  Play,
  Settings,
  BarChart3,
  MessageCircle,
  Star,
  Info,
  ChevronDown,
  ChevronRight,
  TestTube2
} from 'lucide-react';

const TestingGuide = () => {
  const [expandedSection, setExpandedSection] = useState('overview');

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const FeatureStatus = ({ status, children }) => {
    const statusConfig = {
      ready: { icon: CheckCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' },
      partial: { icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
      coming: { icon: AlertCircle, color: 'text-gray-600 dark:text-gray-400', bg: 'bg-gray-50 dark:bg-gray-900/20' }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <div className={`flex items-start space-x-3 p-4 rounded-lg ${config.bg}`}>
        <Icon className={`w-5 h-5 mt-0.5 ${config.color}`} />
        <div className="flex-1">{children}</div>
      </div>
    );
  };

  const TestingSection = ({ title, icon: Icon, sectionKey, children }) => {
    const isExpanded = expandedSection === sectionKey;
    
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h3>
          </div>
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronRight className="w-5 h-5 text-gray-400" />
          )}
        </button>
        
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700"
          >
            {children}
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-6">
              <TestTube2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Sport X Testing Guide
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Complete guide to testing Sport X cricket tournament platform. 
              See what's ready, what's in progress, and how to test each feature.
            </p>
          </div>

          {/* Quick Status Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Ready to Test</h3>
              </div>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">12</p>
              <p className="text-gray-600 dark:text-gray-300">Core features fully functional</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <Clock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">In Progress</h3>
              </div>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">3</p>
              <p className="text-gray-600 dark:text-gray-300">Features being enhanced</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3 mb-4">
                <AlertCircle className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Coming Soon</h3>
              </div>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 mb-2">5</p>
              <p className="text-gray-600 dark:text-gray-300">Future enhancements</p>
            </div>
          </div>

          {/* Testing Sections */}
          <div className="space-y-6">
            
            {/* Overview */}
            <TestingSection title="Platform Overview" icon={Info} sectionKey="overview">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">What is Sport X?</h4>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Sport X is a comprehensive cricket tournament platform that allows users to create and participate in 
                    cricket tournaments based on real-life cricket competitions like IPL, World Cup, etc. Users can:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Create tournaments with entry fees and prize pools</li>
                    <li>Participate in live auctions to build cricket teams</li>
                    <li>Track real player performances and earn points</li>
                    <li>Compete with friends for prizes and bragging rights</li>
                    <li>Chat and interact with other participants</li>
                  </ul>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">Current Development Status</h4>
                  <p className="text-blue-800 dark:text-blue-300">
                    <strong>Phase 1 Complete:</strong> Core tournament management, auction system, and basic performance tracking are fully functional.
                    <br />
                    <strong>Phase 2 In Progress:</strong> Real-time cricket data integration and advanced analytics.
                    <br />
                    <strong>Phase 3 Planned:</strong> Mobile app, advanced AI predictions, and social features.
                  </p>
                </div>
              </div>
            </TestingSection>

            {/* Tournament Management */}
            <TestingSection title="Tournament Management" icon={Trophy} sectionKey="tournaments">
              <div className="space-y-4">
                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Tournament Creation</h4>
                  <p className="text-gray-600 dark:text-gray-300">4-step tournament setup with full customization</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Go to Tournaments → Create Tournament. Test all 4 steps including player selection.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Tournament Discovery</h4>
                  <p className="text-gray-600 dark:text-gray-300">Browse and join existing tournaments</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Visit Tournaments page, view tournament details, join tournaments with codes.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Entry Fees & Prize Pools</h4>
                  <p className="text-gray-600 dark:text-gray-300">Automatic prize pool calculation and tracking</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Create tournament with entry fee, verify prize pool calculation (participants × entry fee).
                  </div>
                </FeatureStatus>

                <FeatureStatus status="partial">
                  <h4 className="font-semibold text-gray-900 dark:text-white">⏳ Tournament Chat</h4>
                  <p className="text-gray-600 dark:text-gray-300">Backend ready, frontend implementation in progress</p>
                  <div className="mt-2 text-sm">
                    <strong>Status:</strong> Chat functionality exists but UI needs enhancement.
                  </div>
                </FeatureStatus>
              </div>
            </TestingSection>

            {/* Auction System */}
            <TestingSection title="Live Auction System" icon={Target} sectionKey="auctions">
              <div className="space-y-4">
                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Real-time Bidding</h4>
                  <p className="text-gray-600 dark:text-gray-300">Socket.io powered live auctions with countdown timers</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Create auction room, invite friends, test live bidding with multiple users.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Player Database</h4>
                  <p className="text-gray-600 dark:text-gray-300">50+ real cricket players with stats and ratings</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Browse players during auction, verify player details (role, country, rating, base price).
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Budget Management</h4>
                  <p className="text-gray-600 dark:text-gray-300">Live budget tracking and validation</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Monitor budget changes during bidding, test budget limits and warnings.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Squad Validation</h4>
                  <p className="text-gray-600 dark:text-gray-300">Automatic enforcement of squad composition rules</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Try to exceed squad limits, verify role-based restrictions work correctly.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Customizable Auction Rules</h4>
                  <p className="text-gray-600 dark:text-gray-300">Bid increments, timers, and minimum bids</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Set custom bid increment (default £50k), timer (default 30s), minimum bid (default £100k).
                  </div>
                </FeatureStatus>
              </div>
            </TestingSection>

            {/* Performance Tracking */}
            <TestingSection title="Performance & Points System" icon={BarChart3} sectionKey="performance">
              <div className="space-y-4">
                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Points Calculation Engine</h4>
                  <p className="text-gray-600 dark:text-gray-300">Comprehensive scoring system for all cricket actions</p>
                  <div className="mt-2 text-sm">
                    <strong>Points System:</strong> Runs (1pt), Wickets (25pts), Catches (10pts), Stumpings (15pts), Run-outs (10pts), Bonuses (25-50pts)
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Leaderboard System</h4>
                  <p className="text-gray-600 dark:text-gray-300">Real-time rankings and winner determination</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Check leaderboards update automatically as points are added.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="partial">
                  <h4 className="font-semibold text-gray-900 dark:text-white">⏳ Real Cricket Data Integration</h4>
                  <p className="text-gray-600 dark:text-gray-300">Mock data system ready, external API integration in progress</p>
                  <div className="mt-2 text-sm">
                    <strong>Current:</strong> Manual/simulated performance updates work. <strong>Coming:</strong> Live cricket match data.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="coming">
                  <h4 className="font-semibold text-gray-900 dark:text-white">🔄 Live Match Updates</h4>
                  <p className="text-gray-600 dark:text-gray-300">Real-time updates during live cricket matches</p>
                  <div className="mt-2 text-sm">
                    <strong>Status:</strong> Requires cricket data API integration and live streaming setup.
                  </div>
                </FeatureStatus>
              </div>
            </TestingSection>

            {/* Team Management */}
            <TestingSection title="Team Management" icon={Users} sectionKey="teams">
              <div className="space-y-4">
                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Team Overview</h4>
                  <p className="text-gray-600 dark:text-gray-300">View all teams from tournaments and auctions</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Go to Teams page, verify tournament teams appear after auction completion.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Team Statistics</h4>
                  <p className="text-gray-600 dark:text-gray-300">Points, budget usage, squad composition tracking</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Check team stats update correctly, verify budget calculations are accurate.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="partial">
                  <h4 className="font-semibold text-gray-900 dark:text-white">⏳ Player Performance History</h4>
                  <p className="text-gray-600 dark:text-gray-300">Individual player statistics and performance trends</p>
                  <div className="mt-2 text-sm">
                    <strong>Status:</strong> Basic tracking works, detailed analytics coming soon.
                  </div>
                </FeatureStatus>
              </div>
            </TestingSection>

            {/* User Experience */}
            <TestingSection title="User Experience & Interface" icon={Settings} sectionKey="ux">
              <div className="space-y-4">
                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Responsive Design</h4>
                  <p className="text-gray-600 dark:text-gray-300">Works on desktop, tablet, and mobile devices</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Try different screen sizes, test mobile browser compatibility.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Dark/Light Mode</h4>
                  <p className="text-gray-600 dark:text-gray-300">Theme toggle with persistent preferences</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Click theme toggle in header, verify preference is remembered across sessions.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="ready">
                  <h4 className="font-semibold text-gray-900 dark:text-white">✅ Real-time Connection</h4>
                  <p className="text-gray-600 dark:text-gray-300">Socket.io connection status and reconnection</p>
                  <div className="mt-2 text-sm">
                    <strong>Test:</strong> Check connection indicator in header, test connection recovery after network issues.
                  </div>
                </FeatureStatus>

                <FeatureStatus status="coming">
                  <h4 className="font-semibold text-gray-900 dark:text-white">🔄 Push Notifications</h4>
                  <p className="text-gray-600 dark:text-gray-300">Auction alerts and performance updates</p>
                  <div className="mt-2 text-sm">
                    <strong>Status:</strong> Planned for mobile app version.
                  </div>
                </FeatureStatus>
              </div>
            </TestingSection>

            {/* Testing Instructions */}
            <TestingSection title="How to Test - Step by Step" icon={Play} sectionKey="testing">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏗️ Basic Platform Testing</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Navigate through all pages (Home, Tournaments, Teams, AI Simulation)</li>
                    <li>Test theme toggle (dark/light mode)</li>
                    <li>Check responsive design on different screen sizes</li>
                    <li>Verify connection status indicator in header</li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🏆 Tournament Testing</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Create new tournament (test all 4 steps)</li>
                    <li>Customize tournament settings (entry fee, budget, squad rules)</li>
                    <li>Select players for auction (test search, filters, bulk actions)</li>
                    <li>Review and create tournament</li>
                    <li>Share tournament ID with friends</li>
                    <li>Test joining tournament with code</li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 Auction Testing</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Start live auction with multiple participants</li>
                    <li>Test real-time bidding functionality</li>
                    <li>Monitor budget updates during bidding</li>
                    <li>Verify squad composition limits</li>
                    <li>Test auction timer and automatic winner selection</li>
                    <li>Complete full auction and verify final teams</li>
                  </ol>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📊 Performance Testing</h4>
                  <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li>Add mock performance data for players</li>
                    <li>Verify point calculations are correct</li>
                    <li>Check leaderboard updates automatically</li>
                    <li>Test team statistics in Team Management</li>
                    <li>Verify prize pool and winner determination</li>
                  </ol>
                </div>
              </div>
            </TestingSection>

            {/* Known Issues & Limitations */}
            <TestingSection title="Known Issues & Feedback" icon={AlertCircle} sectionKey="issues">
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">⚠️ Current Limitations</h4>
                  <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 ml-4">
                    <li><strong>Cricket Data:</strong> Currently using mock data, live cricket API integration in progress</li>
                    <li><strong>Payment Processing:</strong> Entry fees are tracked but not processed (demo mode)</li>
                    <li><strong>Email Notifications:</strong> Tournament invitations manual (share tournament ID)</li>
                    <li><strong>Mobile App:</strong> Web-based only, native mobile app coming soon</li>
                    <li><strong>User Accounts:</strong> Basic user identification, full account system coming</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🐛 How to Report Issues</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-600 dark:text-gray-300 mb-3">When testing, please note:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300 ml-4">
                      <li>Which feature you were testing</li>
                      <li>Steps to reproduce any issues</li>
                      <li>Expected vs actual behavior</li>
                      <li>Device/browser information</li>
                      <li>Screenshots if helpful</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 dark:text-blue-200 mb-3">🎯 Focus Areas for Testing</h4>
                  <p className="text-blue-800 dark:text-blue-300">
                    <strong>Priority 1:</strong> Tournament creation and auction functionality<br/>
                    <strong>Priority 2:</strong> Multi-user real-time interactions<br/>
                    <strong>Priority 3:</strong> Team management and performance tracking<br/>
                    <strong>Priority 4:</strong> Mobile responsiveness and edge cases
                  </p>
                </div>
              </div>
            </TestingSection>

          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TestingGuide;