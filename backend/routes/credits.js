// Express router
import express from "express";
const router = express.Router();
// Code
import creditCtrl from "../controllers/creditsController.js";
import {
  updateCreditsWithController,
  updateCreditsWithControllerPeriodically,
} from "../utils/updateCreditsPeriodically.js";

// ------------------------------------------------------------------------
// --- Debut route: /api/credits/

router.post("/", creditCtrl.createCredit);
router.get("/:id", creditCtrl.getCreditById);
router.put("/:id", creditCtrl.editCreditById);
// Route update All
router.post("/updateCredits", creditCtrl.editAllCredits);
// --- Update crédits
updateCreditsWithController(); // start du serveur => approvisionne en crédit
updateCreditsWithControllerPeriodically(); // interval => approvisionne en crédit

// ------------------------------------------------------------------------
// Route for testing

// ------------------------------------------------------------------------

export default router;
