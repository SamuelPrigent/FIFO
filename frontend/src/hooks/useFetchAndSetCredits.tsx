import { useEffect } from "react";
import { fetchCreditsData } from "../api/creditsRequests";

type UpdateCreditsStateFunction = (type: string, value: number) => void;

export function useFetchAndSetCredits(
  updateCreditsState: UpdateCreditsStateFunction,
  type: string
) {
  useEffect(() => {
    async function FetchAndSetCredits() {
      const creditsXData = await fetchCreditsData(type); // fetch credits of "type"
      updateCreditsState(type, creditsXData.number); // update local state
    }
    FetchAndSetCredits(); // on reload
  }, []);
}
