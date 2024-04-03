import Credit from "../models/credits.js"; // credit schema
import fetch from "node-fetch";
import "dotenv/config";
const port = process.env.PORT || 3000;

// ==== Create 1 credit ====
export const createCredit = async (req, res, next) => {
  try {
    const { name, number, maxNumber } = req.body;
    const newCredit = new Credit({
      name,
      number,
      maxNumber,
    });
    // Enregistre en BDD
    await newCredit.save();
    // Response
    res.status(201).json(newCredit);
  } catch (error) {
    // Gérez les erreurs
    next(error);
  }
};

// ==== Get 1 credit ====
export const getCreditById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Recherche en BDD
    const credit = await Credit.findOne({ name: id.toUpperCase() });
    // Response : crédit non trouvé
    if (!credit) {
      return res.status(404).json({ message: "Crédit non trouvé" });
    }
    // Response
    res.status(200).json(credit);
  } catch (error) {
    // Gère les erreurs
    next(error);
  }
};

// ==== Edit 1 credit ====
export const editCreditById = async (req, res, next) => {
  try {
    // req
    const { id } = req.params; // credit name (ex : "A")
    const { number, __v } = req.body;
    const credit = await Credit.findOne({ name: id.toUpperCase() }); // Recherche en BDD

    // Response : crédit non trouvé
    if (!credit) {
      return res.status(404).json({ message: "Crédit non trouvé" });
    }
    // Vérification de la version (si "-1" update sans verification)
    if (credit.__v !== __v && __v !== -1) {
      return res
        .status(409)
        .json({ message: "La version du crédit ne correspond pas" });
    }
    // Update credit.number
    credit.number = number;
    // Update version number "__v" of data
    const newVersion = parseFloat((credit.__v + 0.01).toFixed(2));
    credit.__v = newVersion;
    // Save en BDD
    await credit.save();
    // Response
    res.status(200).json(credit);
  } catch (error) {
    // Gère les erreurs
    next(error);
  }
};

// ==== Delete 1 credit by (ID) ====
export const deleteCreditById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Recherche en BDD et suppression
    const credit = await Credit.findOneAndDelete({ name: id.toUpperCase() });
    // Réponse : crédit non trouvé
    if (!credit) {
      return res.status(404).json({ message: "Crédit non trouvé" });
    }
    // Réponse
    res
      .status(200)
      .json({ message: "Crédit supprimé avec succès", credit: credit });
  } catch (error) {
    // Gère les erreurs
    next(error);
  }
};

// ==== Edit All Crédits (A, B, C) ====
// -- generate the credits with maxNumber
function generateRandomPercentage(maxNumber) {
  const minPercentage = 0.8;
  const maxPercentage = 1;
  const randomPercentage =
    Math.random() * (maxPercentage - minPercentage) + minPercentage;
  return Math.round(maxNumber * randomPercentage);
}

// -- Edit all crédits
export const editAllCredits = async (req, res, next) => {
  try {
    // === Fetch maxCredits [A, B, C]
    // -- Fetch maxCreditsA
    const responseA = await fetch(`http://localhost:${port}/api/credits/A`);
    const dataA = await responseA.json();
    const maxCreditsA = dataA.maxNumber;
    const versionCreditsA = dataA.__v;
    // -- Fetch maxCreditsB
    const responseB = await fetch(`http://localhost:${port}/api/credits/B`);
    const dataB = await responseB.json();
    const maxCreditsB = dataB.maxNumber;
    const versionCreditsB = dataB.__v;
    // -- Fetch maxCreditsC
    const responseC = await fetch(`http://localhost:${port}/api/credits/C`);
    const dataC = await responseC.json();
    const maxCreditsC = dataC.maxNumber;
    const versionCreditsC = dataC.__v;
    // === Calculate random credits and update
    const randomCreditsA = generateRandomPercentage(maxCreditsA);
    const randomCreditsB = generateRandomPercentage(maxCreditsB);
    const randomCreditsC = generateRandomPercentage(maxCreditsC);
    // === PUT request to update credits
    await Promise.all([
      fetch(`http://localhost:${port}/api/credits/A`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: randomCreditsA, __v: versionCreditsA }),
        // body: JSON.stringify({ number: 100, __v: versionCreditsA }),
      }),
      fetch(`http://localhost:${port}/api/credits/B`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: randomCreditsB, __v: versionCreditsB }),
        // body: JSON.stringify({ number: 100, __v: versionCreditsB }),
      }),
      fetch(`http://localhost:${port}/api/credits/C`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: randomCreditsC, __v: versionCreditsC }),
        // body: JSON.stringify({ number: 100, __v: versionCreditsC }),
      }),
    ]);
    // Response
    console.log(`All credits updated (controller)`);
    res.status(200).json({ message: "All credits updated successfully" });
  } catch (error) {
    console.error("Error updating credits:", error);
  }
};

export default {
  createCredit,
  getCreditById,
  editCreditById,
  deleteCreditById,
  editAllCredits,
};
