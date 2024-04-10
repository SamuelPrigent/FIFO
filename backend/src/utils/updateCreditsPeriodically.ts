import fetch from "node-fetch";
import "dotenv/config";
const port: number = parseInt(process.env.PORT!) || 3000;

interface ApiResponse {
  message?: string;
}

// Update with controller via route => /api/credits/updateCredits
async function updateCreditsWithController() {
  try {
    // === PUT request to update credits
    const response = await fetch(
      `http://localhost:${port}/api/credits/updateCredits`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data: ApiResponse = await response.json(); // Conversion du type de données
    if (!response.ok) {
      throw new Error(data.message || "Failed to update credits");
    }
  } catch (error) {
    console.error("Error updating credits:", error);
  }
}

function updateCreditsWithControllerPeriodically(): NodeJS.Timeout {
  const intervalId = setInterval(updateCreditsWithController, 25 * 1000); // Intervalle de 25s
  return intervalId;
}

export { updateCreditsWithController, updateCreditsWithControllerPeriodically };
