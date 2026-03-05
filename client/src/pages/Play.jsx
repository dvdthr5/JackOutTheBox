import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

export default function Play() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState("");
  const [joinedRoomId, setJoinedRoomId] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const onState = (state) => {
      // When the server broadcasts room state, assume we are in that room
      setJoinedRoomId(state.roomId);
    };
    const onError = (e) => setErr(e?.message || "Error");

    socket.on("room:state", onState);
    socket.on("error", onError);

    return () => {
      socket.off("room:state", onState);
      socket.off("error", onError);
    };
  }, []);

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: 24 }}>
      <button onClick={() => navigate("/")}>Back</button>

      <h2 style={{ marginTop: 12 }}>Join a Game</h2>

      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <label>
          Room Code
          <input
            style={{ width: "100%", padding: 10, marginTop: 4 }}
            placeholder="ABC123"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value.toUpperCase())}
          />
        </label>

        <label>
          Your Name
          <input
            style={{ width: "100%", padding: 10, marginTop: 4 }}
            placeholder="David"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>

        <button
          style={{ padding: 12, cursor: "pointer" }}
          onClick={() => {
            setErr("");
            socket.emit("room:join", { roomId: roomId.trim(), name });
          }}
        >
          Join
        </button>
      </div>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {joinedRoomId && (
        <p style={{ marginTop: 14 }}>
          Joined room <b>{joinedRoomId}</b>. Waiting for host.
        </p>
      )}
    </div>
  );
}
