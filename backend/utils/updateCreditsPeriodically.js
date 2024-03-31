import fetch from "node-fetch";

// Update with controller via route => /api/credits/updateCredits
async function updateCreditsWithController() {
  try {
    // === PUT request to update credits
    const response = await fetch(
      "http://localhost:3000/api/credits/updateCredits",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to update credits");
    }
  } catch (error) {
    console.error("Error updating credits:", error);
  }
}

function updateCreditsWithControllerPeriodically() {
  const intervalId = setInterval(updateCreditsWithController, 15000); // Intervalle de 15s
  return intervalId;
}

export { updateCreditsWithController, updateCreditsWithControllerPeriodically };
