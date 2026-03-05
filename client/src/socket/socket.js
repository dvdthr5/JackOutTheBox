import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

if (!SERVER_URL) {
  throw new Error("Missing VITE_SERVER_URL. Create client/.env and set it.");
}

export const socket = io(SERVER_URL, { autoConnect: true });
