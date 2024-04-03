// Database
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Connexion to database
mongoose.connect(process.env.MongoURL_test as string);
// .then(() => console.log("Connexion à MongoDB réussie !"))
// .catch(() => console.log("Connexion à MongoDB echec !"));

// Server
import http from "http";
import app from "./app.js";

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

const port: number | string | boolean = normalizePort("3004");
app.set("port", port);
const serverTest: http.Server = http.createServer(app);

// errorHandler recherche les erreurs et les gère
const errorHandler = (error: NodeJS.ErrnoException): void => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = serverTest.address();
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

// ecoute les évênement et nous indique dans la console sur quel port ils sont écouté
serverTest.on("error", errorHandler);
serverTest.on("listening", () => {
  const address = serverTest.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

serverTest.listen(port);

export default serverTest;
