// Express router
import express from "express";
const router = express.Router();
// Code
import creditCtrl from "../controllers/creditsController.js";
import {
  updateCreditsWithController,
  updateCreditsWithControllerPeriodically,
} from "../utils/updateCreditsPeriodically.js";
import {
  createAllCreditsIfNotExist,
  deleteCreditsIfShouldNotExist,
} from "../utils/setupDatabase.js";

// =========== Routes ===========
// -- statiques
router.post("/", creditCtrl.createCredit);
router.get("/", creditCtrl.getAllCredits);
router.put("/updateCredits", creditCtrl.editAllCredits);
// -- dynamique
router.get("/:id", creditCtrl.getCreditById);
router.put("/:id", creditCtrl.editCreditById);
router.delete("/:id", creditCtrl.deleteCreditById);

// =========== Utils ============
// --- Generate credits
updateCreditsWithController(); // => start du serveur
updateCreditsWithControllerPeriodically(); // => interval
// --- Set up database (create / delete credits)
createAllCreditsIfNotExist();
deleteCreditsIfShouldNotExist();

// ============================

export default router;
