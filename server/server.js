const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

// Import new models
const Tournament = require('./models/Tournament');
const PerformanceTracker = require('./models/PerformanceTracker');
// KABADDI: Commented out for production - Cricket-focused deployment
// const KabaddiTournament = require('./models/KabaddiTournament');
// const KabaddiPerformanceTracker = require('./models/KabaddiPerformanceTracker');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  allowEIO3: true,
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage
const auctionRooms = new Map();
const tournaments = new Map(); // Cricket tournaments
// KABADDI: Commented out for production - Cricket-focused deployment
// const kabaddiTournaments = new Map(); // Kabaddi tournaments
const userSockets = new Map();

// Initialize performance trackers
const performanceTracker = new PerformanceTracker();
// KABADDI: Commented out for production - Cricket-focused deployment
// const kabaddiPerformanceTracker = new KabaddiPerformanceTracker();

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

  // ======================= TOURNAMENT EVENTS =======================
  
  // Create tournament
  socket.on('create-tournament', (data) => {
    try {
      const tournament = new Tournament(socket.userId, data.settings);
      tournaments.set(tournament.id, tournament);
      performanceTracker.registerTournament(tournament);
      
      socket.join(`tournament-${tournament.id}`);
      socket.emit('tournament-created', { tournament: tournament.getState() });
      
      console.log(`Tournament created: ${tournament.id} by ${socket.userId}`);
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Join tournament
  socket.on('join-tournament', (data) => {
    const { tournamentId, userData } = data;
    const tournament = tournaments.get(tournamentId);
    
    if (!tournament) {
      socket.emit('error', { message: 'Tournament not found' });
      return;
    }

    try {
      if (!tournament.canUserJoin(socket.userId)) {
        socket.emit('error', { message: 'Cannot join this tournament' });
        return;
      }

      const participant = tournament.addParticipant(socket.userId, userData);
      socket.join(`tournament-${tournamentId}`);
      
      // Notify all tournament participants
      io.to(`tournament-${tournamentId}`).emit('tournament-updated', { 
        tournament: tournament.getState(),
        event: 'participant-joined',
        participant: participant
      });
      
      // Send system message
      const systemMsg = tournament.addSystemMessage(`${userData.username} joined the tournament`);
      io.to(`tournament-${tournamentId}`).emit('chat-message', systemMsg);
      
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });

  // Tournament chat
  socket.on('tournament-chat', (data) => {
    const { tournamentId, message } = data;
    const tournament = tournaments.get(tournamentId);
    
    if (!tournament || !tournament.participants.has(socket.userId)) {
      socket.emit('error', { message: 'Not authorized to chat in this tournament' });
      return;
    }

    const chatMessage = tournament.addChatMessage(socket.userId, message);
    io.to(`tournament-${tournamentId}`).emit('chat-message', chatMessage);
  });

  // Start tournament auction
  socket.on('start-tournament-auction', (data) => {
    const { tournamentId } = data;
    const tournament = tournaments.get(tournamentId);
    
    if (!tournament || tournament.adminId !== socket.userId) {
      socket.emit('error', { message: 'Not authorized to start auction' });
      return;
    }

    tournament.status = 'auction_active';
    io.to(`tournament-${tournamentId}`).emit('tournament-updated', { 
      tournament: tournament.getState(),
      event: 'auction-started'
    });

    const systemMsg = tournament.addSystemMessage('Tournament auction has started!');
    io.to(`tournament-${tournamentId}`).emit('chat-message', systemMsg);
  });

  // Mark entry fee paid
  socket.on('mark-entry-fee-paid', (data) => {
    const { tournamentId, userId } = data;
    const tournament = tournaments.get(tournamentId);
    
    if (!tournament || tournament.adminId !== socket.userId) {
      socket.emit('error', { message: 'Not authorized' });
      return;
    }

    tournament.markEntryFeePaid(userId);
    io.to(`tournament-${tournamentId}`).emit('tournament-updated', { 
      tournament: tournament.getState(),
      event: 'entry-fee-paid'
    });
  });

  // Get tournament state  
  socket.on('get-tournament-state', (data) => {
    const { tournamentId } = data;
    const tournament = tournaments.get(tournamentId);
    
    if (!tournament) {
      socket.emit('error', { message: 'Tournament not found' });
      return;
    }

    socket.emit('tournament-state', { tournament: tournament.getState() });
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.userId) {
      userSockets.delete(socket.userId);
    }
  });
});

// ======================= TOURNAMENT API ENDPOINTS =======================

// Get all tournaments
app.get('/api/tournaments', (req, res) => {
  const tournamentList = Array.from(tournaments.values()).map(t => ({
    id: t.id,
    name: t.settings.name,
    realTournament: t.settings.realTournament,
    entryFee: t.settings.entryFee,
    prizePool: t.prizePool,
    participants: t.participants.size,
    maxParticipants: t.settings.maxParticipants,
    status: t.status,
    createdAt: t.createdAt
  }));
  res.json(tournamentList);
});

// Get tournament details
app.get('/api/tournaments/:id', (req, res) => {
  const tournament = tournaments.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Tournament not found' });
  }
  res.json(tournament.getState());
});

// Create tournament
app.post('/api/tournaments', (req, res) => {
  try {
    const { adminId, settings } = req.body;
    const tournament = new Tournament(adminId, settings);
    tournaments.set(tournament.id, tournament);
    performanceTracker.registerTournament(tournament);
    res.json({ 
      success: true, 
      tournament: tournament.getState(),
      message: 'Tournament created successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Join tournament
app.post('/api/tournaments/:id/join', (req, res) => {
  const tournament = tournaments.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Tournament not found' });
  }

  try {
    const { userId, userData } = req.body;
    if (!tournament.canUserJoin(userId)) {
      return res.status(400).json({ error: 'Cannot join this tournament' });
    }

    const participant = tournament.addParticipant(userId, userData);
    res.json({ 
      success: true,
      participant,
      tournament: tournament.getState()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update player performance (admin only)
app.post('/api/tournaments/:id/performance', (req, res) => {
  const tournament = tournaments.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Tournament not found' });
  }

  const { playerId, performance, adminId } = req.body;
  if (tournament.adminId !== adminId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  tournament.updatePlayerPerformance(playerId, performance);
  res.json({ 
    success: true,
    leaderboard: tournament.leaderboard
  });
});

// Get tournament leaderboard
app.get('/api/tournaments/:id/leaderboard', (req, res) => {
  const tournament = tournaments.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Tournament not found' });
  }
  res.json(tournament.leaderboard);
});

// Get tournament chat messages
app.get('/api/tournaments/:id/chat', (req, res) => {
  const tournament = tournaments.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Tournament not found' });
  }
  res.json(tournament.chatMessages);
});

// Real-time performance update endpoint (for external integrations)
app.post('/api/performance/update', (req, res) => {
  const { tournamentId, playerId, performance } = req.body;
  
  const success = performanceTracker.updatePlayerPerformance(tournamentId, playerId, performance);
  
  if (success) {
    res.json({ success: true, message: 'Performance updated' });
  } else {
    res.status(404).json({ error: 'Tournament not found' });
  }
});

// Get available real-life tournaments (for selection)
app.get('/api/real-tournaments', (req, res) => {
  const realTournaments = [
    { id: 'ipl-2024', name: 'Indian Premier League 2024', type: 'T20', sport: 'cricket' },
    { id: 'world-cup-2024', name: 'ICC T20 World Cup 2024', type: 'T20', sport: 'cricket' },
    { id: 'the-hundred-2024', name: 'The Hundred 2024', type: 'The Hundred', sport: 'cricket' },
    { id: 'cpl-2024', name: 'Caribbean Premier League 2024', type: 'T20', sport: 'cricket' },
    { id: 'bbl-2024', name: 'Big Bash League 2024', type: 'T20', sport: 'cricket' },
    { id: 'psl-2024', name: 'Pakistan Super League 2024', type: 'T20', sport: 'cricket' },
    { id: 'eng-vs-ind-2024', name: 'England vs India Test Series 2024', type: 'Test', sport: 'cricket' },
    { id: 'aus-vs-sa-2024', name: 'Australia vs South Africa ODI Series 2024', type: 'ODI', sport: 'cricket' }
  ];
  res.json(realTournaments);
});

// Get available real-life Kabaddi tournaments
app.get('/api/real-kabaddi-tournaments', (req, res) => {
  const realKabaddiTournaments = [
    { id: 'pkl-2024', name: 'Pro Kabaddi League 2024', type: 'Professional', sport: 'kabaddi' },
    { id: 'kabaddi-world-cup-2024', name: 'Kabaddi World Cup 2024', type: 'International', sport: 'kabaddi' },
    { id: 'asian-games-kabaddi-2024', name: 'Asian Games Kabaddi 2024', type: 'Multi-sport', sport: 'kabaddi' },
    { id: 'masters-kabaddi-2024', name: 'Kabaddi Masters Championship 2024', type: 'Professional', sport: 'kabaddi' },
    { id: 'junior-kabaddi-2024', name: 'Junior Kabaddi World Championship 2024', type: 'Youth', sport: 'kabaddi' },
    { id: 'women-kabaddi-2024', name: 'Women\'s Kabaddi League 2024', type: 'Women', sport: 'kabaddi' }
  ];
  res.json(realKabaddiTournaments);
});

// ======================= KABADDI TOURNAMENT API ENDPOINTS =======================

// Get all Kabaddi tournaments
app.get('/api/kabaddi-tournaments', (req, res) => {
  const tournamentList = Array.from(kabaddiTournaments.values()).map(t => ({
    id: t.id,
    name: t.settings.name,
    realTournament: t.settings.realTournament,
    entryFee: t.settings.entryFee,
    prizePool: t.prizePool,
    participants: t.participants.size,
    maxParticipants: t.settings.maxParticipants,
    status: t.status,
    createdAt: t.createdAt,
    sport: 'kabaddi'
  }));
  res.json(tournamentList);
});

// Get Kabaddi tournament details
app.get('/api/kabaddi-tournaments/:id', (req, res) => {
  const tournament = kabaddiTournaments.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Kabaddi tournament not found' });
  }
  res.json(tournament.getState());
});

// Create Kabaddi tournament
app.post('/api/kabaddi-tournaments', (req, res) => {
  try {
    const { adminId, settings } = req.body;
    const tournament = new KabaddiTournament(adminId, settings);
    kabaddiTournaments.set(tournament.id, tournament);
    kabaddiPerformanceTracker.registerTournament(tournament);
    res.json({ 
      success: true, 
      tournament: tournament.getState(),
      message: 'Kabaddi tournament created successfully'
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Join Kabaddi tournament
app.post('/api/kabaddi-tournaments/:id/join', (req, res) => {
  const tournament = kabaddiTournaments.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Kabaddi tournament not found' });
  }

  try {
    const { userId, userData } = req.body;
    if (!tournament.canUserJoin(userId)) {
      return res.status(400).json({ error: 'Cannot join this kabaddi tournament' });
    }

    const participant = tournament.addParticipant(userId, userData);
    res.json({ 
      success: true,
      participant,
      tournament: tournament.getState()
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Kabaddi players
app.get('/api/kabaddi-players', (req, res) => {
  try {
    const kabaddiPlayersPath = path.join(__dirname, '../data/kabaddi_players.json');
    const kabaddiPlayersData = fs.readFileSync(kabaddiPlayersPath, 'utf8');
    const kabaddiPlayers = JSON.parse(kabaddiPlayersData);
    res.json(kabaddiPlayers);
  } catch (error) {
    console.error('Error loading kabaddi players:', error);
    res.status(500).json({ error: 'Failed to load kabaddi players' });
  }
});

// Update Kabaddi player performance (admin only)
app.post('/api/kabaddi-tournaments/:id/performance', (req, res) => {
  const tournament = kabaddiTournaments.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Kabaddi tournament not found' });
  }

  const { playerId, performance, adminId } = req.body;
  if (tournament.adminId !== adminId) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  tournament.updatePlayerPerformance(playerId, performance);
  res.json({ 
    success: true,
    leaderboard: tournament.leaderboard
  });
});

// Get Kabaddi tournament leaderboard
app.get('/api/kabaddi-tournaments/:id/leaderboard', (req, res) => {
  const tournament = kabaddiTournaments.get(req.params.id);
  if (!tournament) {
    return res.status(404).json({ error: 'Kabaddi tournament not found' });
  }
  res.json(tournament.leaderboard);
});

// Real-time Kabaddi performance update endpoint
app.post('/api/kabaddi-performance/update', (req, res) => {
  const { tournamentId, playerId, performance } = req.body;
  
  const success = kabaddiPerformanceTracker.updatePlayerPerformance(tournamentId, playerId, performance);
  
  if (success) {
    res.json({ success: true, message: 'Kabaddi performance updated' });
  } else {
    res.status(404).json({ error: 'Kabaddi tournament not found' });
  }
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
