const PORT = import.meta.env.VITE_API_PORT || 3000; // env port
import { CreditData } from "../types/types.ts"; // types

// fetch data return data
export async function fetchCreditsData(name: string): Promise<CreditData> {
  return fetch(`http://localhost:${PORT}/api/credits/${name}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json() as Promise<CreditData>;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
      throw error;
    });
}

export function putCreditsData(
  name: string,
  number: number,
  version: number
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    fetch(`http://localhost:${PORT}/api/credits/${name}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ number: number, __v: version }),
    })
      .then((response) => {
        if (!response.ok) {
          reject(new Error("Network response was not ok"));
        }
        return response.json();
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        reject(error);
      });
  });
}
