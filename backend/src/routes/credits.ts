// Express router
import express from "express";
const router = express.Router();
// Code
import creditCtrl from "../controllers/creditsController.js";
import {
  createAllCreditsIfNotExist,
  deleteCreditsIfShouldNotExist,
} from "../utils/setupDatabase.js";
import {
  generateCredits,
  generateCreditsPeriodically,
} from "../utils/generateCredits.js";

// =========== Routes ===========
// -- statiques
router.post("/", creditCtrl.createCredit);
router.get("/", creditCtrl.getAllCredits);
router.put("/updateCredits", creditCtrl.editAllCredits); // dev mode route
// -- dynamique
router.get("/:id", creditCtrl.getCreditById);
router.put("/:id", creditCtrl.editCreditById);
router.delete("/:id", creditCtrl.deleteCreditById);

// =========== Utils ============
// --- Generate credits
generateCredits(); // server start
generateCreditsPeriodically(); // every 25s
// --- Set up database (create / delete credits)
createAllCreditsIfNotExist();
deleteCreditsIfShouldNotExist();

// ============================

export default router;
