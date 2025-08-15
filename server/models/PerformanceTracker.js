const axios = require('axios');

// Performance Tracking System for Real Cricket Data
class PerformanceTracker {
  constructor() {
    this.tournaments = new Map(); // tournamentId -> Tournament instance
    this.apiEndpoints = {
      // These would be real cricket data APIs in production
      ipl: 'https://api.cricapi.com/v1/matches',
      testSeries: 'https://api.cricapi.com/v1/series'
    };
    this.updateInterval = null;
  }

  // Register tournament for tracking
  registerTournament(tournament) {
    this.tournaments.set(tournament.id, tournament);
    
    // Start performance tracking if this is the first tournament
    if (this.tournaments.size === 1) {
      this.startPerformanceTracking();
    }
  }

  // Unregister tournament
  unregisterTournament(tournamentId) {
    this.tournaments.delete(tournamentId);
    
    // Stop tracking if no tournaments left
    if (this.tournaments.size === 0) {
      this.stopPerformanceTracking();
    }
  }

  // Start periodic performance updates
  startPerformanceTracking() {
    // Update every 15 minutes during matches
    this.updateInterval = setInterval(() => {
      this.updateAllTournaments();
    }, 15 * 60 * 1000);
  }

  // Stop performance tracking
  stopPerformanceTracking() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Update all active tournaments
  async updateAllTournaments() {
    for (const tournament of this.tournaments.values()) {
      if (tournament.status === 'tournament_active') {
        await this.updateTournamentPerformance(tournament);
      }
    }
  }

  // Update performance for a specific tournament
  async updateTournamentPerformance(tournament) {
    try {
      // In a real implementation, this would fetch from cricket APIs
      // For now, we'll simulate with mock data
      const mockPerformances = this.generateMockPerformance(tournament);
      
      mockPerformances.forEach(performance => {
        tournament.updatePlayerPerformance(performance.playerId, performance.stats);
      });

      // Broadcast updates to all tournament participants
      this.broadcastPerformanceUpdate(tournament);
      
    } catch (error) {
      console.error(`Error updating tournament ${tournament.id} performance:`, error);
    }
  }

  // Generate mock performance data for testing
  generateMockPerformance(tournament) {
    const performances = [];
    
    // Get all players from all squads
    const allPlayers = new Set();
    tournament.participants.forEach(participant => {
      participant.squad.forEach(player => allPlayers.add(player));
    });

    // Generate random performance updates for some players
    const playersToUpdate = Array.from(allPlayers).slice(0, Math.floor(Math.random() * 5) + 1);
    
    playersToUpdate.forEach(player => {
      const performance = {
        playerId: player.id,
        stats: {}
      };

      // Generate stats based on player role
      switch (player.role) {
        case 'Batsman':
          performance.stats.runs = Math.floor(Math.random() * 100);
          performance.stats.catches = Math.floor(Math.random() * 3);
          if (performance.stats.runs >= 50) {
            performance.stats.fifties = performance.stats.runs >= 100 ? 0 : 1;
            performance.stats.centuries = performance.stats.runs >= 100 ? 1 : 0;
          }
          break;
          
        case 'Bowler':
          performance.stats.wickets = Math.floor(Math.random() * 6);
          performance.stats.catches = Math.floor(Math.random() * 2);
          if (performance.stats.wickets >= 5) {
            performance.stats.fiveWickets = 1;
          }
          break;
          
        case 'All-rounder':
          performance.stats.runs = Math.floor(Math.random() * 60);
          performance.stats.wickets = Math.floor(Math.random() * 4);
          performance.stats.catches = Math.floor(Math.random() * 3);
          break;
          
        case 'Wicket-Keeper':
          performance.stats.runs = Math.floor(Math.random() * 50);
          performance.stats.catches = Math.floor(Math.random() * 5);
          performance.stats.stumpings = Math.floor(Math.random() * 2);
          break;
      }

      // Add random run-outs
      if (Math.random() > 0.8) {
        performance.stats.runOuts = 1;
      }

      performances.push(performance);
    });

    return performances;
  }

  // Broadcast performance updates to tournament participants
  broadcastPerformanceUpdate(tournament) {
    // This would integrate with the Socket.io system
    // For now, just log the update
    console.log(`Performance updated for tournament ${tournament.id}`);
    console.log(`Current leaderboard:`, tournament.leaderboard.slice(0, 3));
  }

  // Manual performance update (for testing/admin use)
  updatePlayerPerformance(tournamentId, playerId, performance) {
    const tournament = this.tournaments.get(tournamentId);
    if (tournament) {
      tournament.updatePlayerPerformance(playerId, performance);
      this.broadcastPerformanceUpdate(tournament);
      return true;
    }
    return false;
  }

  // Get real-time match data (placeholder for API integration)
  async getRealTimeMatchData(tournamentType) {
    // In production, this would integrate with cricket APIs like:
    // - CricAPI
    // - ESPN Cricinfo API  
    // - Official IPL API
    
    try {
      // Example API call structure (would need real API keys)
      // const response = await axios.get(`${this.apiEndpoints[tournamentType]}?apikey=${API_KEY}`);
      // return response.data;
      
      // For now, return mock data
      return {
        matches: [],
        message: 'Real-time data integration requires cricket API setup'
      };
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      return null;
    }
  }
}

module.exports = PerformanceTracker;