import { Credit, ICredit } from "../models/credits.js"; // credit schema
import { Request, Response, NextFunction } from "express";
import fetch, { Response as FetchResponse } from "node-fetch"; // Importez Response de node-fetch
import "dotenv/config";
const port: number = parseInt(process.env.PORT!) || 3000;
// socket
import { io } from "../server.js";

// type d'action utilise dans editAllCredits
const allType: string[] = ["A", "B", "C"];

// ==== Create 1 credit ====
export const createCredit = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { name, number, maxNumber } = req.body;
    const newCredit: ICredit = new Credit({
      name,
      number,
      maxNumber,
    });
    // Enregistre en BDD
    await newCredit.save();
    // Response
    return res.status(201).json(newCredit);
  } catch (error) {
    // Gérez les erreurs
    next(error);
  }
};

// ==== Get 1 credit ====
export const getCreditById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params;
    // Recherche en BDD
    const credit: ICredit | null = await Credit.findOne({
      name: id.toUpperCase(),
    });
    // Response : crédit non trouvé
    if (!credit) {
      return res.status(404).json({ message: "Crédit non trouvé" });
      // return;
    }
    // Response
    return res.status(200).json(credit);
    // return;
  } catch (error) {
    // Gère les erreurs
    next(error);
  }
};

// ==== Edit 1 credit ====
export const editCreditById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    // req
    const { id } = req.params as { id: string }; // credit name (ex : "A")
    const { number, __v } = req.body as { number: number; __v: number };
    const credit = await Credit.findOne({ name: id.toUpperCase() }); // Recherche en BDD
    // Si crédit non trouvé
    if (!credit) {
      return res.status(404).json({ message: "Crédit non trouvé" });
    }
    // Verifie si la request a fait un calcul avec une data à jour
    if (credit.__v !== __v && __v !== -1) {
      return res
        .status(409)
        .json({ message: "La version du crédit ne correspond pas" });
    }
    // Update credit.number
    credit.number = number;
    // Update version number "__v" of data
    const newVersion: number = parseFloat((credit.__v + 0.01).toFixed(2));
    credit.__v = newVersion;
    // Save en BDD
    await credit.save();
    // Response
    return res.status(200).json(credit);
  } catch (error) {
    // Gère les erreurs
    next(error);
  }
};

// ==== Delete 1 credit by (ID) ====
export const deleteCreditById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    const { id } = req.params;
    // Recherche en BDD et suppression
    const credit: ICredit | null = await Credit.findOneAndDelete({
      name: id.toUpperCase(),
    });
    // Réponse : crédit non trouvé
    if (!credit) {
      return res.status(404).json({ message: "Crédit non trouvé" });
    }
    // Réponse
    return res
      .status(200)
      .json({ message: "Crédit supprimé avec succès", credit: credit });
  } catch (error) {
    // Gère les erreurs
    next(error);
  }
};

// ==== Edit All Crédits (A, B, C) ====
// -- generate the credits with maxNumber
function generateRandomPercentage(maxNumber: number): number {
  const minPercentage: number = 0.8;
  const maxPercentage: number = 1;
  const randomPercentage: number =
    Math.random() * (maxPercentage - minPercentage) + minPercentage;
  return Math.round(maxNumber * randomPercentage);
}

// -- Edit all crédits
export const editAllCredits = async (
  // io:
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response> => {
  try {
    // === Fetch maxCredits [A, B, C]
    // -- Fetch maxCreditsA
    const responseA: FetchResponse = await fetch(
      `http://localhost:${port}/api/credits/A`
    );
    const dataA: { maxNumber: number; __v: number } =
      (await responseA.json()) as {
        maxNumber: number;
        __v: number;
      };
    const maxCreditsA: number = dataA.maxNumber;
    const versionCreditsA: number = dataA.__v;
    // -- Fetch maxCreditsB
    const responseB: FetchResponse = await fetch(
      `http://localhost:${port}/api/credits/B`
    );
    const dataB: { maxNumber: number; __v: number } =
      (await responseB.json()) as {
        maxNumber: number;
        __v: number;
      };
    const maxCreditsB: number = dataB.maxNumber;
    const versionCreditsB: number = dataB.__v;
    // -- Fetch maxCreditsC
    const responseC: FetchResponse = await fetch(
      `http://localhost:${port}/api/credits/C`
    );
    const dataC: { maxNumber: number; __v: number } =
      (await responseC.json()) as {
        maxNumber: number;
        __v: number;
      };
    const maxCreditsC: number = dataC.maxNumber;
    const versionCreditsC: number = dataC.__v;
    // === Calculate random credits and update
    const randomCreditsA: number = generateRandomPercentage(maxCreditsA);
    const randomCreditsB: number = generateRandomPercentage(maxCreditsB);
    const randomCreditsC: number = generateRandomPercentage(maxCreditsC);
    // === PUT request to update credits
    await Promise.all([
      fetch(`http://localhost:${port}/api/credits/A`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: randomCreditsA, __v: versionCreditsA }),
      }),
      fetch(`http://localhost:${port}/api/credits/B`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: randomCreditsB, __v: versionCreditsB }),
      }),
      fetch(`http://localhost:${port}/api/credits/C`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ number: randomCreditsC, __v: versionCreditsC }),
      }),
    ]);
    // Response
    console.log(`All credits updated (controller)`);
    // Socket event
    io.emit("creditsUpdated", {
      message: "Les crédits ont été mis à jour",
      creditsA: randomCreditsA,
      creditsB: randomCreditsB,
      creditsC: randomCreditsC,
    });
    //
    return res
      .status(200)
      .json({ message: "All credits updated successfully" });
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
