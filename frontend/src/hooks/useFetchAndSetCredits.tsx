import { useEffect } from "react";
import { fetchAllCreditsData } from "../api/creditsRequests";
import { UpdateCreditsStateFunction } from "../types/types";

// Get data on reload
export function useFetchAllAndSetCredits(
  updateCreditsState: UpdateCreditsStateFunction
) {
  useEffect(() => {
    async function FetchAndSetAllCredits() {
      const AllCreditsData = await fetchAllCreditsData(); // get all credits
      AllCreditsData.forEach((credit: any) => {
        updateCreditsState(credit.name, credit.number); // update local state
      });
    }
    FetchAndSetAllCredits(); // on reload
  }, []);
}
