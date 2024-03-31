import Credit from "../models/credits.js"; // credit schema
import fetch from "node-fetch";

// ==== Check if Credits already in Database ====
async function DoesCreditsExist() {
  try {
    // === credits A exist ?
    const response = await fetch("http://localhost:3000/api/credits/a", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to find credits A");
    }
  } catch (error) {
    console.error("Error get credits A:", error);
  }
}

// ==== Create All Credits ====
export const createCreditsIfNotExist = async (req, res, next) => {
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

export default {
  createCreditsIfNotExist,
};
