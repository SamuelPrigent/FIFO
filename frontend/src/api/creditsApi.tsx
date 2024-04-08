const PORT = import.meta.env.VITE_API_PORT || 3000; // env port

interface CreditData {
  _id: string;
  name: string;
  number: number;
  maxNumber: number;
  __v: number;
}

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
        if (data && "number" in data) {
          // ========== je modifie jamais le state ici du coup ============
          // eval(`setCredits${name}(${number})`);
          // updateState(number);
          // console.log(`Credits ${name} (updated) =>`, data.number);
          // ===============================================
        }
        resolve();
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        reject(error);
      });
  });
}
