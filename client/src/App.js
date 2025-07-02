import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './context/SocketContext';
import { ThemeProvider } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import AuctionRoom from './pages/AuctionRoom';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import TeamManagement from './pages/TeamManagement';
import Simulation from './pages/Simulation';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <ThemeProvider>
      <SocketProvider>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <Header />
          
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-room" element={<CreateRoom />} />
              <Route path="/join-room" element={<JoinRoom />} />
              <Route path="/room/:roomId" element={<AuctionRoom />} />
              <Route path="/teams" element={<TeamManagement />} />
              <Route path="/simulation" element={<Simulation />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </SocketProvider>
    </ThemeProvider>
  );
}

export default App;
