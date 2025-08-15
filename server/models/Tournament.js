const { v4: uuidv4 } = require('uuid');

// Tournament Management System for Sport X
class Tournament {
  constructor(adminId, settings) {
    this.id = uuidv4().substring(0, 8).toUpperCase();
    this.adminId = adminId;
    this.settings = {
      name: settings.name,
      realTournament: settings.realTournament, // IPL, Test Series, etc.
      entryFee: settings.entryFee || 0, // in £
      maxParticipants: settings.maxParticipants || 8,
      budget: settings.budget || 50000000, // £50m default
      squadRules: {
        batsmen: settings.squadRules?.batsmen || 4,
        bowlers: settings.squadRules?.bowlers || 4,
        allRounders: settings.squadRules?.allRounders || 2,
        wicketKeepers: settings.squadRules?.wicketKeepers || 1,
        totalPlayers: settings.squadRules?.totalPlayers || 11
      },
      auctionDate: settings.auctionDate,
      tournamentStart: settings.tournamentStart,
      tournamentEnd: settings.tournamentEnd
    };
    
    this.participants = new Map(); // userId -> participant data
    this.prizePool = 0;
    this.status = 'created'; // created, auction_scheduled, auction_active, tournament_active, completed
    this.selectedPlayers = settings.selectedPlayers || [];
    this.chatMessages = [];
    this.leaderboard = [];
    this.createdAt = new Date();
  }

  // Add participant to tournament
  addParticipant(userId, userData) {
    if (this.participants.size >= this.settings.maxParticipants) {
      throw new Error('Tournament is full');
    }

    if (this.participants.has(userId)) {
      throw new Error('User already joined this tournament');
    }

    const participant = {
      userId,
      username: userData.username,
      squad: [],
      budget: this.settings.budget,
      remainingBudget: this.settings.budget,
      points: 0,
      entryFeePaid: false,
      joinedAt: new Date()
    };

    this.participants.set(userId, participant);
    this.updatePrizePool();
    return participant;
  }

  // Update prize pool based on entry fees
  updatePrizePool() {
    const paidParticipants = Array.from(this.participants.values())
      .filter(p => p.entryFeePaid).length;
    this.prizePool = paidParticipants * this.settings.entryFee;
  }

  // Mark entry fee as paid
  markEntryFeePaid(userId) {
    const participant = this.participants.get(userId);
    if (participant) {
      participant.entryFeePaid = true;
      this.updatePrizePool();
    }
  }

  // Add chat message
  addChatMessage(userId, message) {
    const participant = this.participants.get(userId);
    const chatMessage = {
      id: uuidv4(),
      userId,
      username: participant?.username || 'Unknown',
      message,
      timestamp: new Date(),
      type: 'user' // user, system, admin
    };
    
    this.chatMessages.push(chatMessage);
    
    // Keep only last 100 messages
    if (this.chatMessages.length > 100) {
      this.chatMessages = this.chatMessages.slice(-100);
    }
    
    return chatMessage;
  }

  // Add system message
  addSystemMessage(message) {
    const systemMessage = {
      id: uuidv4(),
      userId: 'system',
      username: 'System',
      message,
      timestamp: new Date(),
      type: 'system'
    };
    
    this.chatMessages.push(systemMessage);
    return systemMessage;
  }

  // Update player performance and calculate points
  updatePlayerPerformance(playerId, performance) {
    // Points system as per requirements
    const pointsSystem = {
      runs: 1,           // 1 point per run
      wickets: 25,       // 25 points per wicket
      catches: 10,       // 10 points per catch
      stumpings: 15,     // 15 points per stumping
      runOuts: 10,       // 10 points per run-out
      fifties: 25,       // Bonus for 50s
      centuries: 50,     // Bonus for 100s
      fiveWickets: 50    // Bonus for 5-wicket hauls
    };

    let totalPoints = 0;
    
    // Calculate points based on performance
    totalPoints += (performance.runs || 0) * pointsSystem.runs;
    totalPoints += (performance.wickets || 0) * pointsSystem.wickets;
    totalPoints += (performance.catches || 0) * pointsSystem.catches;
    totalPoints += (performance.stumpings || 0) * pointsSystem.stumpings;
    totalPoints += (performance.runOuts || 0) * pointsSystem.runOuts;
    
    // Bonus points
    if (performance.fifties) totalPoints += performance.fifties * pointsSystem.fifties;
    if (performance.centuries) totalPoints += performance.centuries * pointsSystem.centuries;
    if (performance.fiveWickets) totalPoints += performance.fiveWickets * pointsSystem.fiveWickets;

    // Update participant points
    this.participants.forEach(participant => {
      const playerInSquad = participant.squad.find(p => p.id === playerId);
      if (playerInSquad) {
        if (!playerInSquad.performance) {
          playerInSquad.performance = { totalPoints: 0 };
        }
        
        const previousPoints = playerInSquad.performance.totalPoints || 0;
        playerInSquad.performance = { ...performance, totalPoints };
        
        // Update participant's total points
        participant.points += (totalPoints - previousPoints);
      }
    });

    this.updateLeaderboard();
  }

  // Update leaderboard
  updateLeaderboard() {
    this.leaderboard = Array.from(this.participants.values())
      .sort((a, b) => b.points - a.points)
      .map((participant, index) => ({
        rank: index + 1,
        userId: participant.userId,
        username: participant.username,
        points: participant.points,
        squad: participant.squad.map(p => ({
          name: p.name,
          points: p.performance?.totalPoints || 0
        }))
      }));
  }

  // Get tournament state
  getState() {
    return {
      id: this.id,
      adminId: this.adminId,
      settings: this.settings,
      participants: Array.from(this.participants.entries()).map(([id, data]) => ({ id, ...data })),
      prizePool: this.prizePool,
      status: this.status,
      participantCount: this.participants.size,
      chatMessages: this.chatMessages.slice(-20), // Last 20 messages
      leaderboard: this.leaderboard,
      createdAt: this.createdAt
    };
  }

  // Check if user can join
  canUserJoin(userId) {
    return !this.participants.has(userId) && 
           this.participants.size < this.settings.maxParticipants &&
           this.status === 'created';
  }

  // Validate squad composition
  validateSquad(squad) {
    const composition = {
      batsmen: squad.filter(p => p.role === 'Batsman').length,
      bowlers: squad.filter(p => p.role === 'Bowler').length,
      allRounders: squad.filter(p => p.role === 'All-rounder').length,
      wicketKeepers: squad.filter(p => p.role === 'Wicket-Keeper').length
    };

    const rules = this.settings.squadRules;
    
    return {
      valid: composition.batsmen >= rules.batsmen &&
             composition.bowlers >= rules.bowlers &&
             composition.allRounders >= rules.allRounders &&
             composition.wicketKeepers >= rules.wicketKeepers &&
             squad.length === rules.totalPlayers,
      composition,
      rules
    };
  }
}

module.exports = Tournament;