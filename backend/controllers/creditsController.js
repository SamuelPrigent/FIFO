export const getCredit = async (req, res, next) => {
  try {
    // Get data from database
    // return data
    res.json({
      credits: {
        /* crédits disponibles pour le type demandé */
      },
    });
  } catch (error) {
    next(error);
  }
};

export const editCredit = async (req, res, next) => {
  try {
    // Get data from database
    // confirm credit editing
    res.json({ message: "Crédits mis à jour avec succès" });
  } catch (error) {
    next(error);
  }
};

export default { getCredit, editCredit };
