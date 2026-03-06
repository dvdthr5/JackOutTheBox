import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import { useNavigate } from "react-router-dom";

export default function Host() {
  const navigate = useNavigate();
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
    <div className="page">
      <div className="page-center host-page">
        <div className="actions">
          <button onClick={() => navigate("/")}>Back Home</button>
        </div>

        <h1 className="hero-title">Host Screen</h1>
        <p className="subtitle">
          Create a room and have players join from their phones.
        </p>

        {!room && (
          <div className="card host-create-card">
            <button
              className="host-create-button"
              onClick={() => {
                setErr("");
                socket.emit("room:create");
              }}
            >
              Create Room
            </button>
          </div>
        )}

        {err && <p style={{ color: "crimson" }}>{err}</p>}

        {room && (
          <>
            <div className="card host-room-card">
              <p className="label">Room Code</p>
              <div className="room-code-box">{room.roomId}</div>
            </div>

            <div className="card" style={{ marginTop: "24px" }}>
              <h2>Players Connected ({room.players.length})</h2>

              {room.players.length === 0 ? (
                <p className="muted">Waiting for players...</p>
              ) : (
                <div className="player-grid">
                  {room.players.map((p) => (
                    <div key={p.playerId} className="player-card">
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}