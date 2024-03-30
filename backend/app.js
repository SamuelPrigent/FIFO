// Express
import express from "express";
const app = express();

// Body-parser (body requête)
import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Define Header for response - évite les erreurs de sécurité CORS
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

// ==== Import routes ====
import creditsRoute from "./routes/credits.js";

// ==== Routes crédits ====
app.use("/api/credits", creditsRoute);

// ==== Say hello ====
app.get("/", (req, res) => {
  res.send("Hello Waalaxy");
});

// export
export default app;
