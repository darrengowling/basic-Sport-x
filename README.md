# 🏏 Cricket Auction App

> A full-stack real-time cricket auction simulation with AI-powered match predictions

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-Real--time-orange.svg)](https://socket.io/)
[![AI](https://img.shields.io/badge/AI-Gemini_API-purple.svg)](https://ai.google.dev/)

## 🌟 Features

### 🏷️ **Auction Modes**
- **Standard Auction**: Real-time bidding with budget constraints, timer-based rounds
- **Friendly Draft**: Quick team selection without budgets for casual play

### 👥 **Multiplayer Support**
- **Local Multiplayer**: Multiple teams on one device
- **Online Multiplayer**: Real-time bidding across devices with room codes
- **Live Sync**: Socket.io powered real-time updates

### 📊 **Player Database**
- **50+ Cricket Players** with comprehensive stats
- **Detailed Profiles**: Age, country, role, ratings, averages
- **Dynamic Addition**: Add custom players during auction

### 🎛️ **Team Management**
- **Budget Tracking**: Real-time budget management
- **Role Composition**: Automatic role balance analysis
- **Live Dashboard**: Team stats, player counts, money remaining

### 🤖 **AI Integration**
- **Match Predictions**: Gemini AI powered outcome predictions
- **Tournament Simulation**: Multi-team tournament forecasting
- **Team Analysis**: AI evaluation of team composition

### 🎨 **Modern UI/UX**
- **Dark/Light Mode**: Toggle between themes
- **Responsive Design**: Works on mobile, tablet, desktop
- **Smooth Animations**: Framer Motion powered transitions
- **Real-time Updates**: Live bidding interface with timers

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern component-based UI
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Socket.io Client** - Real-time communication
- **Recharts** - Data visualization

### Backend
- **Node.js & Express** - Server framework
- **Socket.io** - Real-time bidding engine
- **Gemini AI API** - Match predictions
- **UUID** - Unique room generation

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### 1. Clone Repository
```bash
git clone https://github.com/your-username/cricket-auction-app.git
cd cricket-auction-app
```

### 2. Setup Backend
```bash
cd server
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm start
```
*🌐 Backend runs on http://localhost:5000*

### 3. Setup Frontend
```bash
# In a new terminal
cd client
npm install
npm start
```
*🌐 Frontend runs on http://localhost:3000*

### 4. Environment Configuration
Edit `server/.env`:
```env
PORT=5000
GEMINI_API_KEY=your_actual_api_key_here
```

## 🎮 How to Use

1. **Home Page**: Beautiful landing page with feature overview
2. **Create Room**: Set room name, auction mode, and budget
3. **Join Room**: Enter room code to join existing auction
4. **Live Auction**: Real-time bidding with countdown timers
5. **AI Simulation**: Match predictions and team analysis

## 🔧 Development

### Project Structure
```
cricket-auction-app/
├── client/                 # React frontend
│   ├── src/components/    # Reusable components
│   ├── src/pages/         # Main pages
│   └── src/context/       # React context
├── server/                # Node.js backend
│   ├── server.js          # Main server
│   └── .env.example       # Environment template
├── data/                  # Player database
│   └── players.json       # 50+ cricket players
└── README.md             # Documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details.

---

**⭐ Star this repo if you found it helpful!**

Built with ❤️ for cricket enthusiasts worldwide 🏏
