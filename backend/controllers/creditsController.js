import Credit from "../models/credits.js"; // credit schema

export const createCredit = async (req, res, next) => {
  try {
    // recup données du corps de la requête
    const { name, number } = req.body;
    // Use shema
    const newCredit = new Credit({
      name,
      number,
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

export const getCreditById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Recherche en BDD
    const credit = await Credit.findOne({ name: id.toUpperCase() });
    // Response : crédit non trouvé
    if (!credit) {
      return res.status(404).json({ message: "Crédit non trouvé" });
    }
    // Response : crédit trouvé
    res.status(200).json(credit);
  } catch (error) {
    // Gère les erreurs
    next(error);
  }
};

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
    // Response : crédit trouvé
    res.status(200).json(credit);
  } catch (error) {
    // Gère les erreurs
    next(error);
  }
};

export default {
  createCredit,
  getCreditById,
  editCreditById,
};
