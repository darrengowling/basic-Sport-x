const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage for auction rooms
const auctionRooms = new Map();
const userSockets = new Map();

// Load players data
const playersData = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/players.json'), 'utf8'));

// Auction Room Class
class AuctionRoom {
  constructor(roomId, hostId, settings) {
    this.roomId = roomId;
    this.hostId = hostId;
    this.settings = settings;
    this.teams = new Map();
    this.players = [...playersData];
    this.currentAuction = null;
    this.auctionHistory = [];
    this.status = 'waiting'; // waiting, active, completed
    this.currentPlayerIndex = 0;
    this.bidTimer = null;
    this.biddingSequence = [];
  }

  addTeam(teamId, teamData) {
    this.teams.set(teamId, {
      ...teamData,
      players: [],
      budget: this.settings.budget || 0,
      remainingBudget: this.settings.budget || 0
    });
  }

  removeTeam(teamId) {
    this.teams.delete(teamId);
  }

  startAuction() {
    if (this.teams.size < 2) {
      throw new Error('Need at least 2 teams to start auction');
    }
    this.status = 'active';
    this.nextPlayer();
  }

  nextPlayer() {
    if (this.currentPlayerIndex >= this.players.length) {
      this.completeAuction();
      return;
    }

    const player = this.players[this.currentPlayerIndex];
    this.currentAuction = {
      player: player,
      currentBid: this.settings.mode === 'standard' ? player.basePrice : 0,
      highestBidder: null,
      timeLeft: this.settings.bidTimeout || 30,
      biddingHistory: []
    };

    this.currentPlayerIndex++;
    this.startBidTimer();
    return this.currentAuction;
  }

  placeBid(teamId, amount) {
    if (!this.currentAuction || this.status !== 'active') {
      throw new Error('No active auction');
    }

    if (this.settings.mode === 'standard') {
      const team = this.teams.get(teamId);
      if (!team || team.remainingBudget < amount) {
        throw new Error('Insufficient budget');
      }

      if (amount <= this.currentAuction.currentBid) {
        throw new Error('Bid must be higher than current bid');
      }
    }

    this.currentAuction.currentBid = amount;
    this.currentAuction.highestBidder = teamId;
    this.currentAuction.biddingHistory.push({
      teamId,
      amount,
      timestamp: new Date()
    });

    // Reset timer
    this.currentAuction.timeLeft = this.settings.bidTimeout || 30;
    this.startBidTimer();

    return this.currentAuction;
  }

  startBidTimer() {
    if (this.bidTimer) {
      clearInterval(this.bidTimer);
    }

    this.bidTimer = setInterval(() => {
      this.currentAuction.timeLeft--;
      
      if (this.currentAuction.timeLeft <= 0) {
        this.completeBid();
      }
    }, 1000);
  }

  completeBid() {
    clearInterval(this.bidTimer);
    
    if (this.currentAuction.highestBidder) {
      // Player sold
      const team = this.teams.get(this.currentAuction.highestBidder);
      team.players.push({
        ...this.currentAuction.player,
        soldPrice: this.currentAuction.currentBid
      });
      
      if (this.settings.mode === 'standard') {
        team.remainingBudget -= this.currentAuction.currentBid;
      }

      this.auctionHistory.push({
        player: this.currentAuction.player,
        soldTo: this.currentAuction.highestBidder,
        soldPrice: this.currentAuction.currentBid,
        status: 'sold'
      });
    } else {
      // Player unsold
      this.auctionHistory.push({
        player: this.currentAuction.player,
        status: 'unsold'
      });
    }

    // Move to next player
    setTimeout(() => {
      this.nextPlayer();
    }, 2000);
  }

  completeAuction() {
    this.status = 'completed';
    this.currentAuction = null;
    clearInterval(this.bidTimer);
  }

  getState() {
    return {
      roomId: this.roomId,
      settings: this.settings,
      teams: Array.from(this.teams.entries()).map(([id, team]) => ({ id, ...team })),
      currentAuction: this.currentAuction,
      auctionHistory: this.auctionHistory,
      status: this.status,
      totalPlayers: this.players.length,
      currentPlayerIndex: this.currentPlayerIndex
    };
  }
}

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Store user socket
  socket.on('register', (userId) => {
    userSockets.set(userId, socket.id);
    socket.userId = userId;
  });

  // Create auction room
  socket.on('create-room', (data) => {
    const roomId = uuidv4().substring(0, 8).toUpperCase();
    const room = new AuctionRoom(roomId, socket.userId, data.settings);
    auctionRooms.set(roomId, room);
    
    socket.join(roomId);
    socket.emit('room-created', { roomId, room: room.getState() });
  });

  // Join auction room
  socket.on('join-room', (data) => {
    const { roomId } = data;
    const room = auctionRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    socket.join(roomId);
    socket.emit('room-joined', { room: room.getState() });
    socket.to(roomId).emit('user-joined', { userId: socket.userId });
  });

  // Add team
  socket.on('add-team', (data) => {
    const { roomId, teamData } = data;
    const room = auctionRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const teamId = uuidv4();
    room.addTeam(teamId, teamData);
    
    io.to(roomId).emit('team-added', { teamId, teamData, room: room.getState() });
  });

  // Start auction
  socket.on('start-auction', (data) => {
    const { roomId } = data;
    const room = auctionRooms.get(roomId);
    
    if (!room || room.hostId !== socket.userId) {
      socket.emit('error', { message: 'Not authorized or room not found' });
      return;
    }

    try {
      room.startAuction();
      io.to(roomId).emit('auction-started', { room: room.getState() });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Place bid
  socket.on('place-bid', (data) => {
    const { roomId, teamId, amount } = data;
    const room = auctionRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    try {
      const updatedAuction = room.placeBid(teamId, amount);
      io.to(roomId).emit('bid-placed', { 
        auction: updatedAuction, 
        room: room.getState() 
      });
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Next player (manual)
  socket.on('next-player', (data) => {
    const { roomId } = data;
    const room = auctionRooms.get(roomId);
    
    if (!room || room.hostId !== socket.userId) {
      socket.emit('error', { message: 'Not authorized or room not found' });
      return;
    }

    const nextAuction = room.nextPlayer();
    io.to(roomId).emit('next-player', { 
      auction: nextAuction, 
      room: room.getState() 
    });
  });

  // Add custom player
  socket.on('add-custom-player', (data) => {
    const { roomId, playerData } = data;
    const room = auctionRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    const newPlayer = {
      id: Date.now(),
      ...playerData,
      basePrice: playerData.basePrice || 100000
    };

    room.players.push(newPlayer);
    io.to(roomId).emit('player-added', { player: newPlayer });
  });

  // Get room state
  socket.on('get-room-state', (data) => {
    const { roomId } = data;
    const room = auctionRooms.get(roomId);
    
    if (!room) {
      socket.emit('error', { message: 'Room not found' });
      return;
    }

    socket.emit('room-state', { room: room.getState() });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      userSockets.delete(socket.userId);
    }
  });
});

// AI Prediction endpoint
app.post('/api/predict', async (req, res) => {
  try {
    const { team1, team2, matchType } = req.body;
    
    // Import Gemini AI
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Analyze these two cricket teams and predict which team is more likely to win in a ${matchType} match:

    Team 1: ${team1.name}
    Players: ${team1.players.map(p => `${p.name} (${p.role}, Rating: ${p.rating})`).join(', ')}

    Team 2: ${team2.name}
    Players: ${team2.players.map(p => `${p.name} (${p.role}, Rating: ${p.rating})`).join(', ')}

    Consider:
    1. Team balance (batsmen, bowlers, all-rounders, wicket-keepers)
    2. Player ratings and experience
    3. Recent form and fitness
    4. Match conditions

    Provide:
    1. Predicted winner
    2. Win probability percentage
    3. Brief reasoning (2-3 sentences)
    4. Key players to watch

    Format as JSON.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ prediction: text });
  } catch (error) {
    console.error('AI Prediction error:', error);
    res.status(500).json({ error: 'Failed to generate prediction' });
  }
});

// Tournament simulation endpoint
app.post('/api/simulate-tournament', async (req, res) => {
  try {
    const { teams, tournamentType } = req.body;
    
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
    Simulate a ${tournamentType} cricket tournament with these teams:

    ${teams.map((team, index) => `
    Team ${index + 1}: ${team.name}
    Players: ${team.players.map(p => `${p.name} (${p.role}, Rating: ${p.rating})`).join(', ')}
    Team Strength: ${team.players.reduce((sum, p) => sum + p.rating, 0) / team.players.length}/100
    `).join('\n')}

    Simulate the complete tournament and provide:
    1. Match results for each round
    2. Final standings/rankings
    3. Tournament winner
    4. Best performing players
    5. Key moments/upsets

    Format as detailed JSON with match results and analysis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ simulation: text });
  } catch (error) {
    console.error('Tournament simulation error:', error);
    res.status(500).json({ error: 'Failed to simulate tournament' });
  }
});

// API Routes
app.get('/api/players', (req, res) => {
  res.json(playersData);
});

app.get('/api/room/:roomId', (req, res) => {
  const room = auctionRooms.get(req.params.roomId);
  if (!room) {
    return res.status(404).json({ error: 'Room not found' });
  }
  res.json(room.getState());
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
