import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { toast } from 'react-toastify';
import { ArrowRight } from 'lucide-react';

const CreateRoom = () => {
  const [roomName, setRoomName] = useState('');
  const [mode, setMode] = useState('standard');
  const [budget, setBudget] = useState(10000000);
  const navigate = useNavigate();
  const { createRoom } = useSocket();

  const handleCreateRoom = () => {
    if (!roomName) {
      toast.error('Please enter a room name');
      return;
    }

    const settings = {
      name: roomName,
      mode,
      budget,
      bidTimeout: 30,
    };

    createRoom(settings);
    navigate(`/room/${roomName}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      <div className="max-w-lg w-full">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Create Auction Room</h2>
        <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-md">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={e => setRoomName(e.target.value)}
              className="mt-1 block w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Auction Mode</label>
            <select
              value={mode}
              onChange={e => setMode(e.target.value)}
              className="mt-1 block w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="standard">Standard Auction</option>
              <option value="friendly">Friendly Draft</option>
            </select>
          </div>
          {mode === 'standard' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Budget</label>
              <input
                type="number"
                value={budget}
                onChange={e => setBudget(Number(e.target.value))}
                className="mt-1 block w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          )}
          <button
            onClick={handleCreateRoom}
            className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            <span>Create Room</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;

