import { Credit } from "../models/credits.js"; // credit schema
import "dotenv/config";

const allTypeString: string = process.env.CreditList || "";
const allType: string[] = allTypeString.split(",");

// ========== Create credit if not exist ==========
async function createCreditIfNotExist(name: string): Promise<void> {
  // Check if credit exist
  const creditExists = await Credit.findOne({ name });
  // Create credit if not exist
  if (!creditExists) {
    const newCredit = new Credit({
      name,
      number: 5,
      maxNumber: 5,
    });
    await newCredit.save(); // save in database
    console.log(`Credit ${name} created`);
  }
}
// boucle sur allType
async function createAllCreditsIfNotExist(): Promise<void> {
  for (const name of allType) {
    await createCreditIfNotExist(name);
  }
}

// ========== Delete credit if should not exist ==========
async function deleteCreditsIfShouldNotExist(): Promise<void> {
  try {
    // Get all crédits from database
    const creditsInDb = await Credit.find({});
    // Liste les crédits qui ne devrait pas être dans la bdd
    const creditsToDelete = creditsInDb
      .filter((credit) => !allType.includes(credit.name))
      .map((credit) => credit.name);
    // Supprime crédits identifiés
    for (const creditName of creditsToDelete) {
      await Credit.deleteOne({ name: creditName });
      console.log(`Credit ${creditName} deleted`);
    }
  } catch (error) {
    console.error("Erreur lors de la suppression des crédits:", error);
  }
}

export { createAllCreditsIfNotExist, deleteCreditsIfShouldNotExist };
