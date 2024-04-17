const PORT = import.meta.env.VITE_API_PORT || 3000; // env port
import { CreditData } from "../types/types.ts"; // types
import axios from "axios";

export async function fetchCreditsData(name: string): Promise<CreditData> {
  try {
    const response = await axios.get(
      `http://localhost:${PORT}/api/credits/${name}`
    );
    return response.data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}

export async function putCreditsData(
  name: string,
  number: number,
  version: number
): Promise<CreditData> {
  try {
    const response = await axios.put(
      `http://localhost:${PORT}/api/credits/${name}`,
      {
        number: number,
        __v: version,
      }
    );
    return response.data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
    throw error;
  }
}
