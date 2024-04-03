// import Credit from "../models/credits.js"; // credit schema
import fetch from "node-fetch";
import "dotenv/config";
const port: number = parseInt(process.env.PORT!) || 3000;

// ==== Credit exist ? ====
async function DoesCreditExist(name: string): Promise<Boolean> {
  try {
    // === credits (id) exist ?
    const response = await fetch(
      `http://localhost:${port}/api/credits/${name}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.ok;
  } catch (error) {
    console.error(`Error get credits ${name}`, error);
    return false;
  }
}

// ==== Create the Credit ====
async function createCreditIfNotExist(name: string): Promise<void> {
  try {
    if ((await DoesCreditExist(name)) === false) {
      const body = JSON.stringify({
        name: name,
        number: 5,
        maxNumber: 5,
      });
      const response = await fetch(`http://localhost:${port}/api/credits/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      if (response.ok) {
        console.log(`Credits ${name} created`);
      } else {
        console.error(
          "Failed to create credit:",
          response.status,
          response.statusText
        );
      }
    }
  } catch (error) {
    console.error(`Error while creating ${name}`, error);
  }
}

//  ===== Create Crédits =====
async function createAllCreditsIfNotExist(): Promise<void> {
  try {
    await createCreditIfNotExist("A");
    await createCreditIfNotExist("B");
    await createCreditIfNotExist("C");
  } catch (error) {
    console.error("Error during credits initialization", error);
  }
}

export default createAllCreditsIfNotExist;
