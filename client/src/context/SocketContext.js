import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [roomState, setRoomState] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:8001';
    console.log('Connecting to Socket.io server:', serverUrl);
    
    const newSocket = io(serverUrl, {
      path: '/api/socket.io/', // Use /api/ prefix to match backend and ingress routing
      transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
      upgrade: true,
      rememberUpgrade: false,
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000, // Increased timeout
      autoConnect: true,
      withCredentials: false, // Important for CORS
      forceBase64: false
    });

    setSocket(newSocket);

    // Connection event handlers
    newSocket.on('connect', () => {
      console.log('Connected to server successfully');
      setConnected(true);
      // Remove the toast notification to avoid user anxiety
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected from server, reason:', reason);
      setConnected(false);
      toast.error('Connection lost - Attempting to reconnect...');
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnected(false);
      toast.error('Failed to connect to server - Real-time features disabled');
    });

    newSocket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to server after', attemptNumber, 'attempts');
      setConnected(true);
      toast.success('Reconnected to server');
    });

    newSocket.on('reconnect_error', () => {
      console.log('Reconnection failed');
      setConnected(false);
    });

    // Room event handlers
    newSocket.on('room-created', (data) => {
      console.log('Room created:', data);
      setRoomState(data.room);
      toast.success(`Room created: ${data.roomId}`);
    });

    newSocket.on('room-joined', (data) => {
      console.log('Room joined:', data);
      setRoomState(data.room);
      toast.success('Joined room successfully');
    });

    newSocket.on('room-state', (data) => {
      console.log('Room state updated:', data);
      setRoomState(data.room);
    });

    newSocket.on('team-added', (data) => {
      console.log('Team added:', data);
      setRoomState(data.room);
      toast.success(`Team "${data.teamData.name}" added`);
    });

    newSocket.on('auction-started', (data) => {
      console.log('Auction started:', data);
      setRoomState(data.room);
      toast.success('Auction has started!');
    });

    newSocket.on('bid-placed', (data) => {
      console.log('Bid placed:', data);
      setRoomState(data.room);
    });

    newSocket.on('next-player', (data) => {
      console.log('Next player:', data);
      setRoomState(data.room);
    });

    newSocket.on('player-added', (data) => {
      console.log('Custom player added:', data);
      toast.success(`Player "${data.player.name}" added`);
    });

    newSocket.on('user-joined', (data) => {
      console.log('User joined:', data);
      toast.info(`User ${data.userId} joined the room`);
    });

    // Error handler
    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      toast.error(data.message || 'An error occurred');
    });

    // Cleanup on unmount
    return () => {
      newSocket.close();
    };
  }, []);

  // Socket methods
  const registerUser = (userId) => {
    if (socket) {
      socket.emit('register', userId);
      setCurrentUser(userId);
    }
  };

  const createRoom = (settings) => {
    if (socket) {
      socket.emit('create-room', { settings });
    }
  };

  const joinRoom = (roomId) => {
    if (socket) {
      socket.emit('join-room', { roomId });
    }
  };

  const addTeam = (roomId, teamData) => {
    if (socket) {
      socket.emit('add-team', { roomId, teamData });
    }
  };

  const startAuction = (roomId) => {
    if (socket) {
      socket.emit('start-auction', { roomId });
    }
  };

  const placeBid = (roomId, teamId, amount) => {
    if (socket) {
      socket.emit('place-bid', { roomId, teamId, amount });
    }
  };

  const nextPlayer = (roomId) => {
    if (socket) {
      socket.emit('next-player', { roomId });
    }
  };

  const addCustomPlayer = (roomId, playerData) => {
    if (socket) {
      socket.emit('add-custom-player', { roomId, playerData });
    }
  };

  const getRoomState = (roomId) => {
    if (socket) {
      socket.emit('get-room-state', { roomId });
    }
  };

  const value = {
    socket,
    connected,
    roomState,
    currentUser,
    registerUser,
    createRoom,
    joinRoom,
    addTeam,
    startAuction,
    placeBid,
    nextPlayer,
    addCustomPlayer,
    getRoomState,
    setRoomState
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
