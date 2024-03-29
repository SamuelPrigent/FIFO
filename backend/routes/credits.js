// Express router
import express from "express";
const router = express.Router();
// Controllers
import creditCtrl from "../controllers/creditsController.js";

// -------------------------------------

// Debut route: /api/credits/
router.post("/", creditCtrl.createCredit);
router.get("/:id", creditCtrl.getCreditById);
router.put("/:id", creditCtrl.editCreditById);

// -------------------------------------

export default router;
