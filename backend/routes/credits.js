// Express router
import express from "express";
const router = express.Router();
// Code
import creditCtrl from "../controllers/creditsController.js";
import {
  updateCreditsWithController,
  updateCreditsWithControllerPeriodically,
} from "../utils/updateCreditsPeriodically.js";
// import createCreditsIfNotExist from "../utils/createCreditsIfNotExist.js"

// ------------------------------------------------------------------------
// ----- Routes -----

router.post("/", creditCtrl.createCredit);
router.get("/:id", creditCtrl.getCreditById);
router.put("/:id", creditCtrl.editCreditById);
router.delete("/:id", creditCtrl.deleteCreditById);
router.post("/updateCredits", creditCtrl.editAllCredits);

// ------------------------------------------------------------------------
// ----- Functions -----
// --- Update crédits
updateCreditsWithController(); // start du serveur => approvisionne en crédit
updateCreditsWithControllerPeriodically(); // interval => approvisionne en crédit
// --- Does Credits exist ?
// CreateAllCreditsInDatabase();

// ------------------------------------------------------------------------

export default router;
