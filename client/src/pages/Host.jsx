import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";

export default function Host() {
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
      <h2>Host Screen</h2>

      <button
        onClick={() => {
          setErr("");
          socket.emit("room:create");
        }}
      >
        Create Room
      </button>

      {err && <p style={{ color: "crimson" }}>{err}</p>}

      {room && (
        <div style={{ marginTop: 12 }}>
          <div>
            <b>Room Code:</b> {room.roomId}
          </div>
          <div>
            <b>Phase:</b> {room.phase}
          </div>

          <h3>Players</h3>
          <ul>
            {room.players.map((p) => (
              <li key={p.playerId}>
                {p.name} (score: {p.score})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
