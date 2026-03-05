import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Host from "./pages/Host.jsx";
import Play from "./pages/Play.jsx";

export default function App() {
  return (
    <div style={{ fontFamily: "system-ui", padding: 16 }}>
      <nav style={{ display: "flex", gap: 12, marginBottom: 16 }}>
        <Link to="/host">Host</Link>
        <Link to="/play">Play</Link>
      </nav>

      <Routes>
        <Route path="/host" element={<Host />} />
        <Route path="/play" element={<Play />} />
        <Route path="*" element={<div>Go to Host or Play.</div>} />
      </Routes>
    </div>
  );
}
