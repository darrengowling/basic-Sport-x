import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';

import PlayerCard from '../components/PlayerCard';
import TeamList from '../components/TeamList';
import AuctionControls from '../components/AuctionControls';
import BidHistory from '../components/BidHistory';
import AuctionSummary from '../components/AuctionSummary';
import LoadingSpinner from '../components/LoadingSpinner';

const AuctionRoom = () => {
  const { roomId } = useParams();
  const { roomState, getRoomState } = useSocket();

  useEffect(() => {
    if (roomId) {
      getRoomState(roomId);
    }
  }, [roomId, getRoomState]);

  if (!roomState) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner text="Loading room..." />
      </div>
    );
  }

  const { currentAuction, status, teams, settings, auctionHistory } = roomState;

  const renderContent = () => {
    if (status === 'waiting') {
      return (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Waiting for auction to start...</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Share the room code <span className="font-bold text-blue-600 dark:text-blue-400">{roomId}</span> to invite others.
          </p>
          <div className="mt-8">
            <TeamList teams={teams} budget={settings.budget} />
          </div>
          <div className="mt-8">
            <AuctionControls status={status} />
          </div>
        </div>
      );
    }

    if (status === 'completed') {
      return <AuctionSummary teams={teams} auctionHistory={auctionHistory} />;
    }

    return (
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main auction area */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {currentAuction ? (
              <motion.div
                key={currentAuction.player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <PlayerCard player={currentAuction.player} auction={currentAuction} />
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <h2 className="text-2xl font-semibold">Preparing for next player...</h2>
              </div>
            )}
          </AnimatePresence>

          <AuctionControls status={status} currentAuction={currentAuction} />
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <TeamList teams={teams} budget={settings.budget} />
          <BidHistory history={currentAuction?.biddingHistory || []} />
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Auction Room: <span className="text-blue-600 dark:text-blue-400">{roomState.settings.name}</span>
        </h1>
        <div className={`px-3 py-1 rounded-full text-lg font-medium status-${status}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      {renderContent()}
    </div>
  );
};

export default AuctionRoom;

