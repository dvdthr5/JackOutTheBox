import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", paddingTop: 10 }}>
      <h1
        style={{
        fontSize: 64,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 12
      }}
      >      
        Odd One In 
      </h1>
      <p style={{ marginTop: 0, marginBottom: 30, opacity: 0.8 }}>
        Choose between hosting and joining a session
      </p>

      <div style={{ display: "grid", gap: 12, marginTop: 24 }}>
        <button
          style={{
            padding: "14px 16px",
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={() => navigate("/host")}
        >
          Host a Game (Display Screen)
        </button>

        <button
          style={{
            padding: "14px 16px",
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={() => navigate("/play")}
        >
          Join a Game (Phone)
        </button>
      </div>

    </div>
  );
}
