import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <div className="home-container">
        <h1 className="home-title">Odd Ones In</h1>

        <p className="home-subtitle">
          Host a room on the main screen or join from your phone.
        </p>

        <div className="home-buttons">
          <button
            className="home-button"
            onClick={() => navigate("/host")}
          >
            Host a Game
          </button>

          <button
            className="home-button"
            onClick={() => navigate("/play")}
          >
            Join a Game
          </button>
        </div>
      </div>
    </div>
  );
}