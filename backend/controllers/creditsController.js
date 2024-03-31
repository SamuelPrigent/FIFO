import Credit from "../models/credits.js"; // credit schema
import fetch from "node-fetch";
import "dotenv/config";
const port = process.env.PORT;

// ==== Create 1 credit ====
export const createCredit = async (req, res, next) => {
  try {
    // recup données du corps de la requête
    const { name, number, maxNumber } = req.body;
    // Use shema
    const newCredit = new Credit({
      name,
      number,
      maxNumber,
    });
    // Enregistrez le nouvel élément dans la base de données
    await newCredit.save();
    // Répondre avec le nouvel élément créé
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
    const { id } = req.params;
    // Recherche en BDD
    const credit = await Credit.findOne({ name: id.toUpperCase() }); // Convertir en majuscules pour la correspondance
    // Response : crédit non trouvé
    if (!credit) {
      return res.status(404).json({ message: "Crédit non trouvé" });
    }
    // Update credit.number
    const { number } = req.body;
    credit.number = number;
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
    // -- Fetch maxCreditsB
    const responseB = await fetch(`http://localhost:${port}/api/credits/B`);
    const dataB = await responseB.json();
    const maxCreditsB = dataB.maxNumber;
    // -- Fetch maxCreditsC
    const responseC = await fetch(`http://localhost:${port}/api/credits/C`);
    const dataC = await responseC.json();
    const maxCreditsC = dataC.maxNumber;
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
        body: JSON.stringify({ number: randomCreditsA }),
      }),
      fetch(`http://localhost:${port}/api/credits/B`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: randomCreditsB }),
      }),
      fetch(`http://localhost:${port}/api/credits/C`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: randomCreditsC }),
      }),
    ]);
    // Response
    console.log("All credits updated (controller)");
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
