// Route des crédits

// Création du router via express
import express from "express";
const router = express.Router();

import creditCtrl from "../controllers/creditsController.js"; // Import Controller

// -------------------------------------

// debut routes: /api/credits/
router.get("/:id", creditCtrl.getCredit); // Get credit number for ONE type
router.put("/:id", creditCtrl.editCredit); // Edit credit numer for ONE type

// -------------------------------------

export default router;

// -- method without "type": "module",
// const express = require("express");
// module.exports = router;
