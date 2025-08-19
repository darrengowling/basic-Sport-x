// =====================================================================================
// KABADDI TOURNAMENT MODEL - COMMENTED OUT FOR PRODUCTION
// This file contains the complete Kabaddi tournament implementation
// Ready to be restored when Kabaddi functionality is needed
// =====================================================================================

const { v4: uuidv4 } = require('uuid');

// Kabaddi Tournament Management System for Sport X
class KabaddiTournament {
  constructor(adminId, settings) {
    this.id = uuidv4().substring(0, 8).toUpperCase();
    this.adminId = adminId;
    this.settings = {
      name: settings.name,
      realTournament: settings.realTournament, // Pro Kabaddi League, World Cup, etc.
      entryFee: settings.entryFee || 0, // in £
      maxParticipants: settings.maxParticipants || 8,
      budget: settings.budget || 30000000, // £30m default for Kabaddi
      squadRules: {
        raiders: settings.squadRules?.raiders || 4,
        defenders: settings.squadRules?.defenders || 4,
        allRounders: settings.squadRules?.allRounders || 4,
        totalPlayers: settings.squadRules?.totalPlayers || 12 // 7 playing + 5 subs
      },
      auctionSettings: {
        bidIncrement: settings.auctionSettings?.bidIncrement || 25000, // £25k default
        bidTimeout: settings.auctionSettings?.bidTimeout || 30, // 30 seconds default
        minimumBid: settings.auctionSettings?.minimumBid || 50000 // £50k minimum
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

  // Update player performance and calculate points (Kabaddi-specific)
  updatePlayerPerformance(playerId, performance) {
    // Kabaddi Points system
    const kabaddiPointsSystem = {
      raidPoints: 2,        // 2 points per successful raid
      tacklePoints: 3,      // 3 points per successful tackle
      bonusPoints: 1,       // 1 point per touch in raid
      allOutBonus: 10,      // 10 points for team all-out
      superRaid: 5,         // 5 bonus points (3+ defenders tackled)
      superTackle: 3,       // 3 bonus points (raider tackled when 3+ defenders down)
      emptyRaid: -1,        // -1 point for empty raid
      technicalPoint: 1     // 1 point for technical points
    };

    let totalPoints = 0;
    
    // Calculate points based on Kabaddi performance
    totalPoints += (performance.raidPoints || 0) * kabaddiPointsSystem.raidPoints;
    totalPoints += (performance.tacklePoints || 0) * kabaddiPointsSystem.tacklePoints;
    totalPoints += (performance.bonusPoints || 0) * kabaddiPointsSystem.bonusPoints;
    totalPoints += (performance.allOutBonus || 0) * kabaddiPointsSystem.allOutBonus;
    totalPoints += (performance.superRaid || 0) * kabaddiPointsSystem.superRaid;
    totalPoints += (performance.superTackle || 0) * kabaddiPointsSystem.superTackle;
    totalPoints += (performance.emptyRaid || 0) * kabaddiPointsSystem.emptyRaid;
    totalPoints += (performance.technicalPoint || 0) * kabaddiPointsSystem.technicalPoint;

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
          role: p.role,
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
      createdAt: this.createdAt,
      sport: 'kabaddi'
    };
  }

  // Check if user can join
  canUserJoin(userId) {
    return !this.participants.has(userId) && 
           this.participants.size < this.settings.maxParticipants &&
           this.status === 'created';
  }

  // Validate Kabaddi squad composition
  validateSquad(squad) {
    const composition = {
      raiders: squad.filter(p => p.role === 'Raider').length,
      defenders: squad.filter(p => p.role === 'Defender').length,
      allRounders: squad.filter(p => p.role === 'All-rounder').length
    };

    const rules = this.settings.squadRules;
    
    return {
      valid: composition.raiders >= rules.raiders &&
             composition.defenders >= rules.defenders &&
             composition.allRounders >= rules.allRounders &&
             squad.length === rules.totalPlayers,
      composition,
      rules
    };
  }
}

module.exports = KabaddiTournament;