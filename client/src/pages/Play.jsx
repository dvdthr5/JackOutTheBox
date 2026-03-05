import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";

export default function Play() {
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const onState = (state) => setRoom(state);
    const onError = (e) => setErr(e?.message || "Error");

    socket.on("room:state", onState);
    socket.on("error", onError);

    return () => {
      socket.off("room:state", onState);
      socket.off("error", onError);
    };
  }, []);

  return (
    <div>
      <h2>Player</h2>

      <div style={{ display: "grid", gap: 8, maxWidth: 320 }}>
        <input
          placeholder="Room code"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value.toUpperCase())}
        />
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          onClick={() => {
            setErr("");
            socket.emit("room:join", { roomId: roomId.trim(), name });
          }}
        >
          Join
        </button>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {room && (
        <div style={{ marginTop: 12 }}>
          <div>
            <b>Joined:</b> {room.roomId}
          </div>
          <div>
            <b>Players:</b> {room.players.length}
          </div>
        </div>
      )}
    </div>
  );
}
