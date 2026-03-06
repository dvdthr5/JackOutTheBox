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
    const onState = (state) => setJoinedRoomId(state.roomId);
    const onError = (e) => setErr(e?.message || "Error");

    socket.on("room:state", onState);
    socket.on("error", onError);

    return () => {
      socket.off("room:state", onState);
      socket.off("error", onError);
    };
  }, []);

  return (
    <div className="page">
      <div className="page-center">
        <div className="actions">
          <button onClick={() => navigate("/")}>Back Home</button>
        </div>

        <h1 className="hero-title">Join a Game</h1>
        <p className="subtitle">
          Enter the room code from the host screen and your name.
        </p>

        <div className="card" style={{ maxWidth: "520px" }}>
          <div className="stack">
            <div>
              <p className="label">Room Code</p>
              <input
                placeholder="ABCDE"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
              />
            </div>

            <div>
              <p className="label">Your Name</p>
              <input
                placeholder="David"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <button
              onClick={() => {
                setErr("");
                socket.emit("room:join", { roomId: roomId.trim(), name });
              }}
            >
              Join Room
            </button>
          </div>
        </div>

        {err && <p style={{ color: "crimson", marginTop: "16px" }}>{err}</p>}

        {joinedRoomId && (
          <div className="card" style={{ marginTop: "20px", maxWidth: "520px" }}>
            <p>
              Joined room <strong>{joinedRoomId}</strong>. Waiting for host.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}