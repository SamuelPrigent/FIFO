import { Dispatch, SetStateAction, useEffect } from "react";
import { fetchCreditsData } from "../api/creditsRequests";

export function useFetchAndSetCredits(
  setCreditsA: Dispatch<SetStateAction<number | string | null>>,
  setCreditsB: Dispatch<SetStateAction<number | string | null>>,
  setCreditsC: Dispatch<SetStateAction<number | string | null>>
) {
  useEffect(() => {
    async function FetchAndSetCredits() {
      const creditsAData = await fetchCreditsData("A"); // fetch credits A data
      setCreditsA(creditsAData.number); // update local state
      const creditsBData = await fetchCreditsData("B"); // fetch credits B data
      setCreditsB(creditsBData.number); // update local state
      const creditsCData = await fetchCreditsData("C"); // fetch credits B data
      setCreditsC(creditsCData.number); // update local state
    }
    FetchAndSetCredits(); // on reload
  }, []);
}
