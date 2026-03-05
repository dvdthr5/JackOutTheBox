# Trivia Minigame (Host Screen + Phone Players)

A simple real-time multiplayer trivia skeleton:
- One device acts as the host display screen
- Players join from their phones
- Live lobby updates via WebSockets

## Tech Stack
- Client: Vite + React
- Server: Node.js + Express + Socket.IO
- State: in-memory (no database yet)

## Repo Structure
- `client/` Vite React app
- `server/` Express + Socket.IO server

## Prerequisites
- Node.js 18+ recommended
- npm (comes with Node)

## Setup

### 1) Install dependencies

Server:
```bash
cd server
npm install
```

Client:
```bash
cd ../client
npm install
```

### 2) Run Locally

Terminal A
```bash
cd server
npm run dev
```

Terminal B
```bash 
cd client
npm run dev
```

## Accessing the App

After both the client and server are running:

Client (web app):
http://localhost:5173

Server (API + WebSocket):
http://localhost:3001
