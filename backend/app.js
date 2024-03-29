import express from "express";
const app = express();
import bodyParser from "body-parser";

// Utilisation de body-parser pour parser le corps de la requête
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

// -- Say hello
app.get("/", (req, res) => {
  res.send("Hello Waalaxy");
});

// import routes
import creditsRoute from "./routes/credits.js";

// -- Routes
app.use("/api/credits", creditsRoute);

export default app;

// -- method without "type": "module",
// const express = require("express");
// module.exports = app;
