import { Credit } from "../models/credits.js"; // credit schema
import { io } from "../server.js"; // socket
import "dotenv/config";

// credits from .env
const allTypeString: string = process.env.CreditList || "";
const allType: string[] = allTypeString.split(",");

// -- function to generate credits with maxNumber
function generateRandomPercentage(maxNumber: number): number {
  const minPercentage: number = 0.8;
  const maxPercentage: number = 1;
  const randomPercentage: number =
    Math.random() * (maxPercentage - minPercentage) + minPercentage;
  return Math.round(maxNumber * randomPercentage);
}

// -- edit all crédits
async function generateCredits(): Promise<void> {
  try {
    // Objet qui stocke les nouvelles data => response + socket
    const newCredits = {};
    // Boucle sur les ≠ type de crédits
    for (const type of allType) {
      const credit = await Credit.findOne({ name: type }); // Recherche en BDD
      if (!credit) {
        console.log(`Credits ${type} non éxistant`);
        continue; // => passe au prochain crédits
      }
      const maxNumber = credit.maxNumber; // recup maxNumber de la BDD
      const newNumber = generateRandomPercentage(maxNumber); // génère les nouveaux crédits
      credit.number = newNumber; // Met à jour le nouveau nombre de crédits
      await credit.save(); // Sauvegarde en BDD
      // Add data in { newCredits } avec clés correspondant au format attendu par le front
      newCredits[`credits${type}`] = newNumber;
    }
    // Envoi de l'événement socket avec les data mise à jours
    io.emit("creditsUpdated", {
      message: "Les crédits ont été mis à jour",
      ...newCredits,
    });
    console.log("All credits updated (controller)");
  } catch (error) {
    console.error("Error updating credits:", error);
  }
}

function generateCreditsPeriodically(): NodeJS.Timeout {
  const intervalId = setInterval(generateCredits, 25 * 1000); // Intervalle de 25s
  return intervalId;
}

export { generateCredits, generateCreditsPeriodically };
