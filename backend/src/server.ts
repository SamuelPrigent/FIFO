import mongoose from "mongoose"; // database
import dotenv from "dotenv"; // .env
dotenv.config(); // .env
import { Server as SocketIOServer } from "socket.io"; // socket.io

// ---------------- Connexion to database ----------------
mongoose
  .connect(process.env.MongoURL as string)
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

// ---------------- http, app ----------------
import http from "http";
import app from "./app.js";

// ---------------- Port ----------------
const normalizePort = (val: string | number): number | string | boolean => {
  const port: number = typeof val === "string" ? parseInt(val, 10) : val;
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port: number | string | boolean = normalizePort(
  process.env.PORT || "3000"
);
app.set("port", port);

// ---------------- Create server ----------------
const server: http.Server = http.createServer(app);

// ---------------- Socket.io : attache io au server et permet la connection du front 5173  ----------------
const io = new SocketIOServer(server, {
  cors: { origin: ["http://localhost:5173"] },
});

// ---------------- Error Handler (server) ----------------
const errorHandler = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
server.on("error", errorHandler);

// ---------------- Server Listen request (server) ----------------
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);

// ---------------- Export ----------------
export { io };
export default server;
