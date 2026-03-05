const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors({ origin: true, credentials: true }));

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: true, credentials: true },
});

const rooms = new Map();

function makeRoomCode(len = 5) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ"; // letters only, removed numbers
  let s = "";
  for (let i = 0; i < len; i++) {
    s += chars[Math.floor(Math.random() * chars.length)];
  }
  return s;
}

function emitRoomState(roomId) {
  const room = rooms.get(roomId);
  if (room) io.to(roomId).emit("room:state", room);
}

io.on("connection", (socket) => {
  socket.on("room:create", () => {
    let roomId = makeRoomCode();
    while (rooms.has(roomId)) roomId = makeRoomCode();

    const room = {
      roomId,
      hostSocketId: socket.id,
      phase: "lobby",
      players: [], // { playerId, name, score }
    };

    rooms.set(roomId, room);
    socket.join(roomId);
    emitRoomState(roomId);
  });

  socket.on("room:join", ({ roomId, name }) => {
    const code = String(roomId || "").trim().toUpperCase();
    const trimmedName = String(name || "").trim();

    const room = rooms.get(code);
    if (!room) {
      socket.emit("error", { message: "Room not found" });
      return;
    }
    if (!trimmedName) {
      socket.emit("error", { message: "Name required" });
      return;
    }
    if (room.players.some((p) => p.name.toLowerCase() === trimmedName.toLowerCase())) {
      socket.emit("error", { message: "Name already taken" });
      return;
    }

    socket.join(code);

    room.players.push({
      playerId: socket.id,
      name: trimmedName,
      score: 0,
    });

    emitRoomState(code);
  });

  socket.on("disconnect", () => {
    for (const [roomId, room] of rooms.entries()) {
      if (room.hostSocketId === socket.id) {
        // Close the room if host leaves
        io.to(roomId).emit("error", { message: "Host disconnected, room closed" });
        rooms.delete(roomId);
        continue;
      }

      const before = room.players.length;
      room.players = room.players.filter((p) => p.playerId !== socket.id);
      if (room.players.length !== before) emitRoomState(roomId);
    }
  });
});

app.get("/health", (req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`server listening on ${PORT}`));
