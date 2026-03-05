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
    <div
      style={{
        textAlign: "center",
        maxWidth: 900,
        margin: "0 auto",
        paddingTop: 40,
        fontFamily: "system-ui",
      }}
    >
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          left: 20,
          top: 20,
        }}
      >
        ← Home
      </button>

      <h1 style={{ fontSize: 42, marginBottom: 20 }}>
        Trivia Host Screen
      </h1>

      {!room && (
        <button
          onClick={() => {
            setErr("");
            socket.emit("room:create");
          }}
          style={{
            fontSize: 22,
            padding: "14px 28px",
            cursor: "pointer",
          }}
        >
          Create Room
        </button>
      )}

      {err && (
        <p style={{ color: "crimson", marginTop: 20 }}>{err}</p>
      )}

      {room && (
        <>
          <div style={{ marginTop: 20 }}>
            <p style={{ fontSize: 18 }}>Room Code</p>

            <div
              style={{
                fontSize: 72,
                fontWeight: "bold",
                letterSpacing: 8,
                background: "#f4f4f4",
                padding: "20px 40px",
                borderRadius: 10,
                display: "inline-block",
              }}
            >
              {room.roomId}
            </div>
          </div>

          <h2 style={{ marginTop: 40 }}>
            Players Connected ({room.players.length})
          </h2>

          {room.players.length === 0 ? (
            <p style={{ opacity: 0.6 }}>Waiting for players...</p>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
                gap: 16,
                marginTop: 20,
              }}
            >
              {room.players.map((p) => (
                <div
                  key={p.playerId}
                  style={{
                    background: "#95bae3",
                    padding: 18,
                    borderRadius: 8,
                    fontSize: 20,
                    fontWeight: 500,
                  }}
                >
                  {p.name}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}