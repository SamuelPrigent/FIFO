import express from "express";
const app = express();

// import routes
import creditsRoute from "./routes/credits.js";

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

// -- url/
app.get("/", (req, res) => {
  res.send("Hello Waalaxy");
});

// -- Routes
app.use("/api/credits", creditsRoute);

export default app;

// -- method without "type": "module",
// const express = require("express");
// module.exports = app;
