import dotenv from "dotenv";
import http from "http";
import app from "./app.js";
import { initializeSocket } from "./socket.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});