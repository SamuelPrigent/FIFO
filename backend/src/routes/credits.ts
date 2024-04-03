// Express router
import express from "express";
const router = express.Router();
// Code
import creditCtrl from "../controllers/creditsController.js";
import {
  updateCreditsWithController,
  updateCreditsWithControllerPeriodically,
} from "../utils/updateCreditsPeriodically.js";
import createAllCreditsIfNotExist from "../utils/createCreditsIfNotExist.js";

// ------------------------------------------------------------------------
// ===== Routes =====
router.post("/", creditCtrl.createCredit);
router.get("/:id", creditCtrl.getCreditById);
router.put("/:id", creditCtrl.editCreditById);
router.delete("/:id", creditCtrl.deleteCreditById);
router.post("/updateCredits", creditCtrl.editAllCredits);

// ------------------------------------------------------------------------
// ===== Utils =====
// --- Update crédits -- re-approvisionne en crédit dans la range 0.8 - 1 * maxNumber
updateCreditsWithController(); // => start du serveur
updateCreditsWithControllerPeriodically(); // => interval
// --- Initialize credits in database if dont exist
createAllCreditsIfNotExist();

// ------------------------------------------------------------------------

export default router;
