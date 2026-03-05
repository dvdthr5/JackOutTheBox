const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors({ origin: true, credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true }
});

// In-memory rooms: roomId -> roomState
const rooms = new Map();

function makeRoomCode(len = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

io.on("connection", (socket) => {
  socket.on("room:create", () => {
    let roomId = makeRoomCode();
    while (rooms.has(roomId)) roomId = makeRoomCode();

    const room = {
      roomId,
      hostSocketId: socket.id,
      phase: "lobby",
      players: [] // { playerId, name, score }
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    io.to(roomId).emit("room:state", room);
  });

  socket.on("room:join", ({ roomId, name }) => {
    const room = rooms.get(roomId);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }

    const trimmed = String(name || "").trim();
    if (!trimmed) {
      socket.emit("error", { message: "Name required" });
      return;
    }

    // Basic uniqueness check for names in the room
    if (room.players.some((p) => p.name.toLowerCase() === trimmed.toLowerCase())) {
      socket.emit("error", { message: "Name already taken" });
      return;
    }

    const playerId = socket.id; // skeleton: use socket.id as playerId
    room.players.push({ playerId, name: trimmed, score: 0 });

    socket.join(roomId);
    io.to(roomId).emit("room:state", room);
  });

  socket.on("disconnect", () => {
    // Skeleton behavior: remove disconnected players from any room they were in
    for (const [roomId, room] of rooms.entries()) {
      if (room.hostSocketId === socket.id) {
        rooms.delete(roomId);
        io.to(roomId).emit("error", { message: "Host disconnected, room closed" });
        continue;
      }
      const before = room.players.length;
      room.players = room.players.filter((p) => p.playerId !== socket.id);
      if (room.players.length !== before) {
        io.to(roomId).emit("room:state", room);
      }
    }
  });
});

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`server listening on ${PORT}`));
