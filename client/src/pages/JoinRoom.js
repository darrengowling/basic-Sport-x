import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Hash } from 'lucide-react';

const JoinRoom = () => {
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { joinRoom, socket } = useSocket();

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) {
      toast.error('Please enter a room code');
      return;
    }

    setLoading(true);

    try {
      // Listen for room-joined event
      const joinPromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Join timeout'));
        }, 10000);

        socket.once('room-joined', (data) => {
          clearTimeout(timeout);
          resolve(data);
        });

        socket.once('error', (error) => {
          clearTimeout(timeout);
          reject(error);
        });
      });

      // Attempt to join room
      joinRoom(roomCode.toUpperCase());
      
      // Wait for response
      await joinPromise;
      
      // Navigate to room on success
      navigate(`/room/${roomCode.toUpperCase()}`);
      
    } catch (error) {
      console.error('Failed to join room:', error);
      toast.error(error.message || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJoinRoom();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
            <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Join Auction Room
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Enter the room code to join an existing auction
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Code
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter room code"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                maxLength={8}
                disabled={loading}
              />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Room codes are usually 8 characters long
            </p>
          </div>

          <button
            onClick={handleJoinRoom}
            disabled={loading || !roomCode.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                <span>Joining...</span>
              </>
            ) : (
              <>
                <span>Join Room</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Don't have a room code?{' '}
              <button
                onClick={() => navigate('/create-room')}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Create a new room
              </button>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              How to Join
            </h3>
            <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <p>1. Get the room code from the host</p>
              <p>2. Enter the code above</p>
              <p>3. Click "Join Room" to start bidding</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default JoinRoom;
